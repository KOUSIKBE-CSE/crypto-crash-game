const { Server } = require('socket.io');
const { generateCrashPoint } = require('../../utils/fairCrash');
const { getCryptoPrice } = require('../../utils/cryptoPrice');
const Player = require('../models/Player');
const GameRound = require('../models/GameRound');

let io;
let roundNumber = 0;
let currentMultiplier = 1;
let currentCrash = 0;
let activeBets = [];
let gameInterval;

function setupWebSocket(server) {
    io = new Server(server, { cors: { origin: '*' } });

    io.on('connection', (socket) => {
        console.log('👤 New client connected');

        socket.on('place-bet', async ({ username, usdAmount, currency }) => {
            const player = await Player.findOne({ username });
            const price = await getCryptoPrice(currency);
            const cryptoAmount = usdAmount / price;

            if (!player || player.wallets[currency] < cryptoAmount) {
                socket.emit('error', '❌ Insufficient balance');
                return;
            }

            player.wallets[currency] -= cryptoAmount;
            await player.save();

            const txHash = crypto.randomBytes(8).toString('hex');

            activeBets.push({
                playerId: player._id,
                usdAmount,
                cryptoAmount,
                currency,
                txHash,
                priceAtTime: price,
                multiplierAtCashout: null,
                cashedOut: false,
            });

            socket.emit('bet-placed', { txHash });
        });

        socket.on('cashout', async ({ username }) => {
            const player = await Player.findOne({ username });
            const bet = activeBets.find(b => b.playerId.toString() === player._id.toString() && !b.cashedOut);

            if (!bet) return;

            bet.cashedOut = true;
            bet.multiplierAtCashout = currentMultiplier;

            const winnings = bet.cryptoAmount * currentMultiplier;
            player.wallets[bet.currency] += winnings;
            await player.save();

            socket.emit('cashed-out', {
                currency: bet.currency,
                amount: winnings,
                usd: (winnings * bet.priceAtTime).toFixed(2),
            });

            io.emit('player-cashed-out', {
                playerId: player._id,
                multiplier: currentMultiplier,
            });
        });
    });

    startGameLoop();
}

async function startGameLoop() {
    setInterval(() => {
        roundNumber++;
        const seed = crypto.randomBytes(8).toString('hex');
        currentCrash = generateCrashPoint(seed, roundNumber);
        currentMultiplier = 1;

        io.emit('round-start', { roundNumber, seed });

        let startTime = Date.now();
        gameInterval = setInterval(async () => {
            const elapsed = (Date.now() - startTime) / 1000;
            currentMultiplier = +(1 + elapsed * 0.1).toFixed(2);

            if (currentMultiplier >= currentCrash) {
                clearInterval(gameInterval);
                await saveGameRound(roundNumber, currentCrash, seed);
                io.emit('round-crash', { roundNumber, crashPoint: currentCrash });
                activeBets = [];
            } else {
                io.emit('multiplier-update', currentMultiplier);
            }
        }, 100);
    }, 10000);
}

async function saveGameRound(roundId, crashPoint, seed) {
    await GameRound.create({
        roundId,
        crashPoint,
        seed,
        bets: activeBets,
        startTime: new Date(),
        endTime: new Date(),
    });
}

module.exports = { setupWebSocket };

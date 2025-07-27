const { generateSeed } = require('../utils/randomUtils');
const { generateCrashMultiplier } = require('../services/crashAlgorithm');
const GameRound = require('../models/GameRound');
const Player = require('../models/Player');
const { fetchCryptoPrices } = require('../services/cryptoService');

module.exports = (io) => {
  let currentRound = null;

  // 🔁 Start new game round
const startNewGame = async () => {
  const seed = generateSeed();
  const crashMultiplier = generateCrashMultiplier(seed);
  const startTime = new Date();

  currentRound = new GameRound({
    roundId: seed,
    startTime,
    crashMultiplier,
    seed,
    bets: [],
    cashouts: [],
    ended: false,
  });

  await currentRound.save();

  const prices = await fetchCryptoPrices(); // ✅ Fetch and send prices on start
  io.emit('gameStarted', { roundId: seed, startTime, prices });

  setTimeout(async () => {
    currentRound.ended = true;
    await currentRound.save();

    const prices = await fetchCryptoPrices(); // ✅ Fetch again for latest at end
    io.emit('gameEnded', { crashMultiplier, prices });

    startNewGame(); // 🔁 Start next round
  }, 10000);
};
};


const Player = require('../models/Player');
const GameRound = require('../models/GameRound');
const Transaction = require('../models/Transaction');
const { fetchPrice } = require('../services/cryptoService');
const { getCachedPrice } = require('../utils/priceCache');
const crypto = require('crypto');

// POST /api/bet
exports.placeBet = async (req, res) => {
  const { playerId, usdAmount, currency } = req.body;
  if (usdAmount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  try {
    const player = await Player.findOne({ playerId });
    if (!player) return res.status(404).json({ error: 'Player not found' });

    const price = await getCachedPrice(fetchPrice, currency.toLowerCase());
    const cryptoAmount = usdAmount / price;

    if (player.wallets[currency] < cryptoAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Deduct from wallet
    player.wallets[currency] -= cryptoAmount;
    await player.save();

    // Add to active round
    const currentRound = await GameRound.findOne({ ended: false });
    if (!currentRound) return res.status(400).json({ error: 'No active round' });

    currentRound.bets.push({ playerId, usdAmount, cryptoAmount, currency });
    await currentRound.save();

    // Log transaction
    const tx = new Transaction({
      playerId,
      usdAmount,
      cryptoAmount,
      currency,
      transactionType: 'bet',
      transactionHash: crypto.randomUUID(),
      priceAtTime: price
    });
    await tx.save();

    res.json({ success: true, cryptoAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Bet failed' });
  }
};

// POST /api/cashout
exports.cashout = async (req, res) => {
  const { playerId, roundId } = req.body;
  try {
    const round = await GameRound.findOne({ roundId, ended: false });
    if (!round) return res.status(404).json({ error: 'No such active round' });

    const bet = round.bets.find(b => b.playerId === playerId);
    if (!bet) return res.status(400).json({ error: 'No active bet found' });

    const nowMultiplier = global.currentMultiplier || 1;

    const cryptoPayout = bet.cryptoAmount * nowMultiplier;
    const usdPayout = bet.usdAmount * nowMultiplier;

    // Add to player wallet
    const player = await Player.findOne({ playerId });
    player.wallets[bet.currency] += cryptoPayout;
    await player.save();

    round.cashouts.push({
      playerId,
      multiplier: nowMultiplier,
      cryptoPayout,
      usdPayout
    });

    await round.save();

    const tx = new Transaction({
      playerId,
      usdAmount: usdPayout,
      cryptoAmount: cryptoPayout,
      currency: bet.currency,
      transactionType: 'cashout',
      transactionHash: crypto.randomUUID(),
      priceAtTime: usdPayout / cryptoPayout
    });
    await tx.save();

    res.json({ success: true, cryptoPayout, usdPayout });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cashout failed' });
  }
};

// GET /api/wallet/:playerId
exports.getWallet = async (req, res) => {
  const player = await Player.findOne({ playerId: req.params.playerId });
  if (!player) return res.status(404).json({ error: 'Player not found' });

  try {
    const btcPrice = await getCachedPrice(fetchPrice, 'bitcoin');
    const ethPrice = await getCachedPrice(fetchPrice, 'ethereum');

    const wallet = player.wallets;
    const usd = {
      BTC: wallet.BTC * btcPrice,
      ETH: wallet.ETH * ethPrice
    };

    res.json({ wallets: wallet, usdEquivalent: usd });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wallet' });
  }
};

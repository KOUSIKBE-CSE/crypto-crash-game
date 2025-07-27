const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const { getCryptoPrice } = require('../utils/cryptoPrice');

router.get('/wallet/:username', async (req, res) => {
  try {
    const player = await Player.findOne({ playerId: req.params.username });
    if (!player) return res.status(404).json({ error: 'Player not found' });

    const BTC = await getCryptoPrice('BTC');
    const ETH = await getCryptoPrice('ETH');

    res.json({
      BTC: {
        crypto: player.wallets.BTC,
        usd: +(player.wallets.BTC * BTC).toFixed(2),
      },
      ETH: {
        crypto: player.wallets.ETH,
        usd: +(player.wallets.ETH * ETH).toFixed(2),
      }
    });
  } catch (error) {
    console.error('Wallet fetch error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

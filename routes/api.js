const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const { getCryptoPrice } = require('../../utils/cryptoPrice');

router.get('/test-insert', async (req, res) => {
    try {
        const newPlayer = new Player({
            username: 'alice',
            wallets: {
                BTC: 0.1,
                ETH: 0.2
            },
            wins: 0,
            losses: 0
        });
        await newPlayer.save();
        res.json({ message: 'Test player inserted ✅' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Insert failed ❌' });
    }
});
module.exports = router;

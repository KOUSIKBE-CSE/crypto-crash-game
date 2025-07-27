const mongoose = require('mongoose');

const GameRoundSchema = new mongoose.Schema({
  roundId: String,
  startTime: Date,
  crashMultiplier: Number,
  seed: String,
  bets: [
    {
      playerId: String,
      usdAmount: Number,
      cryptoAmount: Number,
      currency: String,
    },
  ],
  cashouts: [
    {
      playerId: String,
      multiplier: Number,
      usdPayout: Number,
      cryptoPayout: Number,
    },
  ],
  ended: { type: Boolean, default: false },
});

module.exports = mongoose.model('GameRound', GameRoundSchema);

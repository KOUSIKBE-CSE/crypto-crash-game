// seedPlayer.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Player = require('./models/Player');

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Player.deleteMany({});
  await Player.create({
    username: 'alice',
    wallets: {
      BTC: 0.005,
      ETH: 0.12,
    },
  });
  console.log('🎉 Seeded player: alice');
  process.exit();
});

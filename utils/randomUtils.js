const crypto = require('crypto');

function generateSeed() {
  return crypto.randomBytes(8).toString('hex'); // 16-char hex
}

module.exports = { generateSeed };

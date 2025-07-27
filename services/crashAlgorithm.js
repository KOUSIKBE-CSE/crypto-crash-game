function generateCrashMultiplier(seed) {
  const hash = require('crypto')
    .createHash('sha256')
    .update(seed)
    .digest('hex');

  const h = parseInt(hash.slice(0, 13), 16);
  const max = Math.pow(2, 52);

  return Math.max(1, Math.floor((100 * max) / (max - h)) / 100);
}

module.exports = { generateCrashMultiplier };

// utils/cryptoPrice.js

const axios = require('axios');

let cache = {
  BTC: null,
  ETH: null,
  timestamp: 0,
};

async function getCryptoPrice(coin) {
  const now = Date.now();

  // Cache valid for 60 seconds
  if (cache[coin] && now - cache.timestamp < 60 * 1000) {
    return cache[coin];
  }

  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin.toLowerCase()}&vs_currencies=usd`);
    const price = response.data[coin.toLowerCase()].usd;
    cache[coin] = price;
    cache.timestamp = now;
    return price;
  } catch (err) {
    console.error(`❌ Failed to fetch ${coin} price: ${err.message}`);
    return 0; // fallback
  }
}

module.exports = { getCryptoPrice };

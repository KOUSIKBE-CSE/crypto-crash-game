// services/priceService.js
const axios = require('axios');

let cachedPrices = null;
let lastFetchTime = 0;
const CACHE_DURATION_MS = 10 * 1000; // 10 seconds

const fetchCryptoPrices = async () => {
  const now = Date.now();
  if (cachedPrices && (now - lastFetchTime) < CACHE_DURATION_MS) {
    return cachedPrices; // return cached if fresh enough
  }

  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
    );

    cachedPrices = {
      BTC: response.data.bitcoin.usd,
      ETH: response.data.ethereum.usd,
    };
    lastFetchTime = now;
    return cachedPrices;
  } catch (error) {
    console.error('❌ Failed to fetch crypto prices:', error.message);
    if (cachedPrices) {
      console.warn('⚠️ Using cached prices due to fetch error.');
      return cachedPrices; // fallback if previously cached
    }
    throw error;
  }
};

module.exports = { fetchCryptoPrices };

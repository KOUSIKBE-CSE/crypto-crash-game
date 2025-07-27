// services/cryptoService.js
const axios = require('axios');

async function fetchCryptoPrices() {
  try {
    const res = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
    );

    return {
      BTC: res.data.bitcoin.usd,
      ETH: res.data.ethereum.usd,
    };
  } catch (err) {
    console.error('❌ Failed to fetch crypto prices:', err.message);
    return { BTC: 0, ETH: 0 };
  }
}

module.exports = { fetchCryptoPrices };

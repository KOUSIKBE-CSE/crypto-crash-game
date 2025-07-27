let prices = { BTC: 0, ETH: 0 };

exports.setPrices = (newPrices) => {
  prices = newPrices;
};

exports.getPrices = () => {
  return prices;
};

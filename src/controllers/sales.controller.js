const { saleService } = require('../services');

const creatSale = async (req, res) => {
  const saleInfo = req.body;
  const { type, message } = await saleService.createSale(saleInfo);

  if (type === 'ID_IS_REQUIRED') return res.status(400).json(message);
  if (type === 'PRODUCT_NOT_FOUND') return res.status(404).json(message);
  if (type === 'QUANTITY_IS_REQUIRED') return res.status(400).json(message);
  if (type === 'QUANTITY_INVALID') return res.status(422).json(message);

  return res.status(201).json(message);
};

module.exports = {
  creatSale,
};
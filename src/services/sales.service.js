const salesModel = require('../models/sales.model');
const { validateData } = require('./validations/salesValidations');

const createSale = async (saleInfo) => {
  const { itemsSold } = saleInfo;
  let error = await validateData(itemsSold[0]);
  if (error.type) {
    return error;
  }
  error = await validateData(itemsSold[1]);
  if (error.type) {
    return error;
  }

  const saleId = await salesModel.createSale();
  await salesModel.saleProducts(saleId, itemsSold[0].productId, itemsSold[0].quantity);
  await salesModel.saleProducts(saleId, itemsSold[1].productId, itemsSold[1].quantity);

  return { type: null, message: { id: saleId, itemSold: saleInfo } };
};

module.exports = {
  createSale,
};
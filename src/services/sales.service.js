const salesModel = require('../models/sales.model');
const { validateData } = require('./validations/salesValidations');

const createSale = async (saleInfo) => {
  let error = await validateData(saleInfo[0]);
  if (error.type) {
    return error;
  }
  error = await validateData(saleInfo[1]);
  if (error.type) {
    return error;
  }

  const saleId = await salesModel.createSale();
  await salesModel.saleProducts(saleId, saleInfo[0].productId, saleInfo[0].quantity);
  await salesModel.saleProducts(saleId, saleInfo[1].productId, saleInfo[1].quantity);

  return { type: null, message: { id: saleId, itemSold: [...saleInfo] } };
};

module.exports = {
  createSale,
};
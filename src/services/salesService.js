const Joi = require('joi');
const productsModel = require('../models/productsModel');
const salesModel = require('../models/salesModel');

const saleSchema = Joi.object({
  productId: Joi.number().min(1).required(),
  quantity: Joi.number().min(1).required(),
});

const getAllSales = async () => {
  const sales = await salesModel.getAllSales();
  return sales;
};

const getSaleById = async (saleId) => {
  const sale = await salesModel.getSaleById(saleId);
  return sale;
};

const validateInfo = async (sales) => {
  const allProductIds = await productsModel.productsIds();

  for (let i = 0; i < sales.length; i += 1) {
    const { error } = saleSchema.validate(sales[i]);
    if (error) {
      return {
        message: error.message,
      };
    }
    if (!allProductIds.includes(sales[i].productId)) {
      return {
        message: 'Product not found',
      };
    }
  }
};

const createSale = async (sales) => {
  const validaton = await validateInfo(sales);

  if (validaton) return validaton;

  const saleId = await salesModel.createSale();
  const promise = sales.map(async (sale) => {
    await salesModel.itemsSold(sale, saleId);
  });

  await Promise.all(promise);

  return {
    id: saleId,
    itemsSold: sales,
  };
};

const deleteSale = async (saleId) => {
  const sale = await getSaleById(saleId);

  if (sale.length === 0) {
    return {
      message: 'Sale not found',
    };
  }

  await salesModel.deleteSale(saleId);

  return {
    message: 'done',
  };
};

const updateSale = async (saleId, updateInfo) => {
  const validation = await validateInfo(updateInfo);

  if (validation) return validation;

  const sale = await salesModel.getSaleById(saleId);
  if (sale.length === 0) {
    return {
      message: 'Sale not found',
    };
  }

  await salesModel.updateSales(saleId, updateInfo);
  return {
    saleId,
    itemsUpdated: updateInfo,
  };
};

module.exports = {
  getAllSales,
  createSale,
  getSaleById,
  deleteSale,
  updateSale,
};

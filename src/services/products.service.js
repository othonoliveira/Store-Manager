const { productsModel } = require('../models');
const { validateProductById } = require('./validations/productValidations');

const getProducts = async () => {
  const products = await productsModel.getProducts();
  return { type: null, message: products };
};

const getProductById = async (productId) => {
  const product = await productsModel.getProductById(productId);
  const error = await validateProductById(productId);

  if (error.type) return error;
  
  return { type: null, message: product };
};

module.exports = {
  getProducts,
  getProductById,
};
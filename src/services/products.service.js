const { productsModel } = require('../models');
const { validateProductById, validateProductName } = require('./validations/productValidations');

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

const addProduct = async (productName) => {
  const error = await validateProductName(productName);

  if (error.type) return error;
  const product = await productsModel.addProduct(productName);
  
  return { type: null, message: product };
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
};
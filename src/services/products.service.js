const { productsModel } = require('../models');

const getProducts = async () => {
  const products = await productsModel.getProducts();
  return { type: null, message: products };
};

const getProductById = async (productId) => {
  const product = await productsModel.getProductById(productId);
  return { type: null, message: product };
};

module.exports = {
  getProducts,
  getProductById,
};
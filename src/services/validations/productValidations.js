const { productsModel } = require('../../models');

const validateProductById = async (id) => {
  const product = await productsModel.getProductById(id);
  if (!product) return { type: 'PRODUCT_NOT_FOUND', message: 'Product not found' };
  
  return { type: null, message: '' };
};

module.exports = {
  validateProductById,
};
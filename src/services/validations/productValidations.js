const { productsModel } = require('../../models');

const validateProductById = async (id) => {
  const product = await productsModel.getProductById(id);
  if (!product) return { type: 'PRODUCT_NOT_FOUND', message: 'Product not found' };
  
  return { type: null, message: '' };
};

const validateProductName = async (productName) => {
  if (!productName) return { type: 'NAME_NOT_DEFINED', message: '"name" is required' };
  if (productName.length < 5) {
    return {
      type: 'WRONG_NAME_LENGHT', message: '"name" length must be at least 5 characters long',
    };
  }
  return { type: null, message: '' };
};

module.exports = {
  validateProductById,
  validateProductName,
};
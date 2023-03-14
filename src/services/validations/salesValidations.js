// const { salesModel } = require('../../models');

const { productsModel } = require('../../models');
// const { validateProductById } = require('./productValidations');
const validateData = async ({ productId, quantity }) => {
  if (!productId) return { type: 'ID_IS_REQUIRED', message: '"productId" is required' };
  const product = await productsModel.getProductById(productId);
  if (!product) return { type: 'PRODUCT_NOT_FOUND', message: 'Product not found' };
  if (quantity < 1) {
    return {
      type: 'QUANTITY_INVALID', message: '"quantity" must be greater than or equal to 1',
    }; 
  }
  if (!quantity) return { type: 'QUANTITY_IS_REQUIRED', message: '"quantity" is required' };
  return { type: null, message: '' };
};

module.exports = {
  validateData,
};
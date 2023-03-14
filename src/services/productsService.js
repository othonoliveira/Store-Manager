const Joi = require('joi');
const productsModel = require('../models/productsModel');

const idSchema = Joi.object({
  id: Joi.number().min(1).required(),
});

const productSchema = Joi.object({
  name: Joi.string().min(5).max(45).required(),
});

const getAllProducts = async () => {
  const products = await productsModel.getAllProducts();
  return products;
};

const getProductById = async ({ id }) => {
  // const { error } = idSchema.validate(id);
  // if (error) {
  //   return {
  //     status: 404,
  //     message: 'Product not found',
  //   };
  // }

  const product = await productsModel.getProductById(id);
  if (product.length < 1) {
    return {
      status: 404,
      message: 'Product not found',
    };
  }

  return { status: 200, product };
};

const createProduct = async (productName) => {
  if (!productName) return { message: '"name" is required' };
  if (productName.length < 5) {
    return { message: '"name" length must be at least 5 characters long' };
  }

  const productId = await productsModel.createProduct(productName);
  return {
    status: 201,
    product: { id: productId, name: productName },
  };
};

const updateProduct = async (productId, productName) => {
  const { error } = productSchema.validate({ productName });
  if (error) {
    return { message: error.message };
  }

  const updatedProduct = await getProductById({ productId });
  if (updatedProduct.message) {
    return updatedProduct;
  }

  const newProduct = { productId, productName };
  const result = await productsModel.updateProduct(newProduct);

  return result;
};

const deleteProduct = async (productId) => {
  const productChecking = await getProductById({ productId });
  if (productChecking.message) return productChecking;

  await productsModel.deleteProduct(productId);

  return 'done';
};

// const searchProduct = async (productName) => {
//   const searchedProduct = await productsModel.searchProduct(productName);
//   console.log(searchedProduct);
//   return searchedProduct;
// };

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  // searchProduct,
};

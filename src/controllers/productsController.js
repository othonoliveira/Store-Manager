const camelize = require('camelize');
const productsService = require('../services/productsService');

const getAllProducts = async (req, res) => {
  const products = await productsService.getAllProducts();
  
  res.status(200).json(products);
};

const getProductById = async (req, res) => {
    const { id } = req.params;
  const product = await productsService.getProductById({ id });
    if (product.message) {
      return res.status(product.status).json({
        message: product.message,
      });
    }
  
      return res.status(product.status).json(product.product[0]);
};

const createProduct = async (req, res) => {
  const { name } = req.body;
  const { product, message } = await productsService.createProduct(name);
  if (message) {
    if (message.includes('length')) {
      return res.status(422).json({ message });
    }
    if (message) {
      return res.status(400).json({ message });
    }
  }
  return res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { message } = await productsService.updateProduct(id, name);

  console.log(message);

  if (message) {
    if (message.includes('length')) {
      return res.status(422).json({ message });
    }
    if (message.includes('required')) {
      return res.status(400).json({ message });
    }
    return res.status(404).json({ message });
  }

  return res.status(200).json({ id, name });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { message } = await productsService.deleteProduct(id);
  if (message) {
    return res.status(404).json({
      message: 'Product not found',
    });
  }
  return res.status(204).end();
};

const searchProducts = async (req, res) => {
  const productName = req.query.q;

  if (productName.length === 0) {
    const result = await productsService.getAllProducts();
    return res.status(200).json(result);
  }

  const products = await productsService.getAllProducts();
  const camelizedProducts = await camelize(products);
  const foundProduct = camelizedProducts.find((product) => product.name.includes(productName));

  return res.status(200).json([foundProduct]);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
};

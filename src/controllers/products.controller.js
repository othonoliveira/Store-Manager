const { productsService } = require('../services');

const listProducts = async (req, res) => {
  const { type, message } = await productsService.getProducts();
  
  if (type) return res.status(404).json('NO_PRODUCTS_FOUND');
  return res.status(200).json(message);
};

const getProduct = async (req, res) => {
  const { id } = req.params;
  const { type, message } = await productsService.getProductById(id);
  console.log(message);

  if (type) return res.status(404).json({ message });

  return res.status(200).json(message);
};

module.exports = {
  listProducts,
  getProduct,
};
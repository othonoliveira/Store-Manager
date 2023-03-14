const express = require('express');
const productsController = require('../controllers/productsController');

const productsRouter = express.Router();

productsRouter.get('/search', productsController.searchProducts);

productsRouter.get('/:id', productsController.getProductById);

productsRouter.put('/:id', productsController.updateProduct);

productsRouter.delete('/:id', productsController.deleteProduct);

productsRouter.get('/', productsController.getAllProducts);

productsRouter.post('/', productsController.createProduct);

module.exports = productsRouter;

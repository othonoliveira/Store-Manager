const express = require('express');
const salesController = require('../controllers/salesController');

const salesRouter = express.Router();

salesRouter.get('/', salesController.getAllSales);

salesRouter.get('/:id', salesController.getSaleById);

salesRouter.post('/', salesController.createSale);

salesRouter.delete('/:id', salesController.deleteSale);

salesRouter.put('/:id', salesController.updateSale);

module.exports = salesRouter;

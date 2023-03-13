const express = require('express');

const { productsController } = require('../controllers/index');

const router = express.Router();

router.get('/', productsController.listProducts);
router.get('/:id', productsController.getProduct);
router.post('/', productsController.addProduct);

module.exports = router;
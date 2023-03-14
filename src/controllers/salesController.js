const salesService = require('../services/salesService');

const getAllSales = async (_req, res) => {
  const sales = await salesService.getAllSales();

  return res.status(200).json(sales);
};

const getSaleById = async (req, res) => {
  const { id } = req.params;
  const sale = await salesService.getSaleById(id);
  if (sale.length < 1) {
    return res.status(404).json({
      message: 'Sale not found',
    });
  }
  return res.status(200).json(sale);
};

const createSale = async (req, res) => {
  const sales = await salesService.create(req.body);
  if (!sales.message) return res.status(201).json(sales);
  if (sales.message.includes('greater')) {
    return res.status(422)
      .json({ message: sales.message });
  }
  if (sales.message.includes('required')) {
    return res.status(400)
      .json({ message: sales.message });
  }
  if (sales.message.includes('Product')) {
    return res.status(404)
      .json({ message: sales.message });
  }
};

const deleteSale = async (req, res) => {
  const { id } = req.params;
  const { message } = await salesService.deleteSale(id);

  if (message === 'done') {
    return res.status(204).end();
  }
  
  return res.status(404).json({ message });
};

const messages = ({ message }) => {
  if (message.includes('greater')) {
    return {
      status: 422,
      message,
    };
  } if (message.includes('required')) {
    return {
      status: 400, message,
    };
  } if (message.includes('Sale')) {
    return {
      status: 404, message,
    };
  } if (message.includes('Product')) {
    return {
      status: 404, message,
    };
  }
};

const updateSale = async (req, res) => {
  const updateInfo = req.body;
  const { id } = req.params;

  const update = await salesService.updateSale(id, updateInfo);
  if (!update.message) return res.status(200).json(update);

  const { status, message } = messages(update);
  return res.status(status).json({ message });
};

module.exports = {
  getAllSales,
  createSale,
  getSaleById,
  deleteSale,
  updateSale,
};

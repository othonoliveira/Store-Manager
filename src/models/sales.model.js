const camelize = require('camelize');
const connection = require('./connection');

const createSale = async () => {
  const [{ insertId }] = await connection.execute(
    'INSERT INTO sales (date) VALUES (NOW())',
  );
  return insertId;
};

const saleProducts = async (saleId, productId, quantity) => {
  const [{ insertId }] = await connection.execute(
    'INSERT INTO sales_products (sale_id, product_id, quantity) VALUES (?, ?, ?)',
    [saleId, productId, quantity],
  );
  return insertId;
};

const getSaleProducts = async (saleId) => {
  const [[products]] = await connection.execute(
    'SELECT product_id, quantity FROM sales_products WHERE sale_id = ?',
    [saleId],
  );
  return camelize(products);
};

module.exports = {
  createSale,
  saleProducts,
  getSaleProducts,
};
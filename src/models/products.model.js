const camelize = require('camelize');
const connection = require('./connection');

const getProducts = async () => {
  const [result] = await connection.execute(
    'SELECT * FROM products',
  );
  return camelize(result);
};

const getProductById = async (productId) => {
  const [[product]] = await connection.execute(
    'SELECT * FROM products WHERE id = ?',
    [productId],
  );
  return camelize(product);
};

const addProduct = async (productName) => {
  await connection.execute(
    'INSERT INTO products (name) VALUES (?)',
    [productName],
  );
  const [[product]] = await connection.execute(
    'SELECT * FROM products WHERE name = ?',
    [productName],
  );
  return camelize(product);
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
};
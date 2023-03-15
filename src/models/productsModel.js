const camelize = require('camelize');
const connection = require('./connection');

const getAllProducts = async () => {
  const [result] = await connection.execute('SELECT * FROM products');
  return result;
};

const getProductById = async (productId) => {
  const [product] = await connection.execute(
    'SELECT * FROM products WHERE id = ?',
    [productId],
  );
  return product;
};

const productsIds = async () => {
  const ids = await connection.execute(
    'SELECT id FROM products',
  );
  const result = Object.values(JSON
    .parse(JSON.stringify(ids[0])));
  return result.map((product) => product.id);
};

const createProduct = async (productName) => {
  const [addedProduct] = await connection.execute(
    'INSERT INTO products (name) VALUE (?)',
    [productName],
  );
  return addedProduct.insertId;
};

const updateProduct = async ({ productId, productName }) => {
  const [updatedProduct] = await connection.execute(
    'UPDATE products SET name = ? WHERE id = ?',
    [productName, productId],
  );
  return camelize(updatedProduct);
};

const deleteProduct = async (prodctId) => {
  await connection.execute(
    'DELETE FROM products WHERE id = ?',
    [prodctId],
  );
  return 'done';
};

const searchProduct = async (productName) => {
  const [searchedProduct] = await connection.execute(
    'SELECT name FROM products WHERE name LIKE "?%"',
    [productName],
  );
  return searchedProduct;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  productsIds,
  updateProduct,
  deleteProduct,
  searchProduct,
};

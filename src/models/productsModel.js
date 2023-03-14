const camelize = require('camelize');
const connection = require('./connection');

const getAllProducts = async () => {
  const [result] = await connection.execute('SELECT * FROM products');
  return result;
};

const getProductById = async ({ productId }) => {
  const [product] = await connection.execute(
    'SELECT * FROM products WHERE id = ?',
    [productId],
  );
  return product;
};

const allIds = async () => {
  const productsIds = await connection.execute('SELECT id FROM products');
  const result = Object.values(JSON.parse(JSON.stringify(productsIds[0])));
  return result.map((product) => product.id);
};

const createProduct = async (productName) => {
  const [addedProduct] = await connection.execute(
    'INSERT INTO products (name) VALUE (?)',
    [productName],
  );
  return addedProduct.insertId;
};

const updateProduct = async ({ prodctId, productName }) => {
  const [updatedProduct] = await connection.execute(
    'UPDATE products SET name = ? WHERE id = ?',
    [productName, prodctId],
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
  console.log(searchedProduct);
  return searchedProduct;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  allIds,
  updateProduct,
  deleteProduct,
  searchProduct,
};

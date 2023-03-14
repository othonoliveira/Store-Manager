const camelize = require('camelize');
const connection = require('./connection');

const getAllSales = async () => {
  const [sales] = await connection.execute(
    `SELECT id AS saleId, date, product_id
    AS productId, quantity
    FROM StoreManager.sales
    INNER JOIN StoreManager.sales_products AS sales_products
    ON sales.id = sales_products.sale_id;`,
  );
  return sales;
};

const getSaleById = async (id) => {
  const [sale] = await connection.execute(
    `SELECT date, product_id, quantity FROM StoreManager.sales
    AS sales
    INNER JOIN StoreManager.sales_products as sales_products
    on sales.id = sales_products.sale_id 
    AND sales.id = ?
    ORDER BY sales.id`,
    [id],
  );
  return camelize(sale);
};

const createSale = async () => {
  const [sale] = await connection.execute(
    'INSERT INTO StoreManager.sales (date) VALUES (NOW())',
  );
  return sale.insertId;
};

const itemsSold = async (sale, id) => {
  const itemsSaved = await connection.execute(
    'INSERT INTO StoreManager.sales_products(sale_id, product_id, quantity) VALUES (?, ?, ?)',
    [id, sale.productId, sale.quantity],
);
  return itemsSaved;
};

const deleteSale = async (id) => {
  await connection.execute(
    'DELETE FROM StoreManager.sales WHERE id = ?',
    [id],
  );
  return 'done';
};

const updateSale = async (saleId, updateData) => {
  await connection.execute(
    'DELETE FROM StoreManager.sales_products WHERE sale_id = ?',
    [saleId],
  );
  const values = updateData.map(() => '(?, ? ,?)').join(', ');
  const valuesArray = updateData.map((sale) => [saleId, sale.productId, sale.quantity]).flat();
  const [updatedSale] = await connection.execute(
    `INSERT INTO StoreManager.sales_products (sale_id, product_id, quantity) VALUES ${values}`,
    [...valuesArray],
  );
  return camelize(updatedSale);
};

module.exports = {
  itemsSold,
  createSale,
  getAllSales,
  getSaleById,
  deleteSale,
  updateSale,
};

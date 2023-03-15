const chai = require("chai");
const sinon = require("sinon");
const connection = require("../../../src/models/connection");
const salesModel = require("../../../src/models/salesModel");

const { expect } = chai;

const sales = [
  {
    saleId: 1,
    date: "2023-03-14T11:35:50.000Z",
    productId: 1,
    quantity: 7,
  },
  {
    productId: 2,
    quantity: 11,
  },
  {
    productId: 1,
    quantity: 3,
  },
];

describe("Sales Model Tests", function () {
  it("should get all sales", async function () {
    sinon.stub(connection, "execute").resolves([sales]);

    const response = await salesModel.getAllSales();
    expect(response).to.be.deep.equal(sales);
  });

  it("should get sales by id", async function () {
    sinon.stub(connection, "execute").resolves([sales[0]]);

    const response = await salesModel.getSaleById(1);
    expect(response).to.be.deep.equal(sales[0]);
  });

  it("should save the products there were bought", async function () {
    sinon.stub(connection, "execute").resolves(sales[2]);

    const response = await salesModel.itemsSold(sales[2]);
    expect(response).to.be.deep.equal(sales[2]);
  });

  it("should delet the sale", async function () {
    sinon.stub(connection, "execute").resolves();

    const response = await salesModel.deleteSale(1);
    expect(response).to.be.equal("done");
  });

  it("should create sale", async function () {
    sinon.stub(connection, "execute").resolves([{
      insertId: 3
    }]);

    const response = await salesModel.createSale(sales[1]);
    expect(response).to.be.deep.equal(3);
  });

  afterEach(() => {
    sinon.restore();
  });
});

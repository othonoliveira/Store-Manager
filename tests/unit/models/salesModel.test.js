const chai = require("chai");
const sinon = require("sinon");
const connection = require("../../../src/models/connection");
const salesModel = require("../../../src/models/salesModel");

const { expect } = chai;

const sales = [
  {
    saleId: 1,
    date: "2023-02-15T01:00:50.000Z",
    productId: 1,
    quantity: 5,
  },
  {
    productId: 2,
    quantity: 15,
  },
  {
    productId: 1,
    quantity: 15,
  },
];

describe("Testing salesModel", function () {
  it("Testing get all", async function () {
    sinon.stub(connection, "execute").resolves([sales]);
    const result = await salesModel.getAll();
    expect(result).to.be.deep.equal(sales);
  });

  it("Testing getSaleById", async function () {
    sinon.stub(connection, "execute").resolves([sales[0]]);
    const result = await salesModel.getSaleById(1);
    expect(result).to.be.deep.equal(sales[0]);
  });

  it("Testing createSale", async function () {
    sinon.stub(connection, "execute").resolves([{ insertId: 3 }]);
    const result = await salesModel.createSale(sales[1]);
    expect(result).to.be.deep.equal(3);
  });

  it("Testing create", async function () {
    sinon.stub(connection, "execute").resolves(sales[1]);
    const result = await salesModel.create(sales[1]);
    expect(result).to.be.deep.equal(sales[1]);
  });

  it("Testing delete", async function () {
    sinon.stub(connection, "execute").resolves();
    const result = await salesModel.deleteSale(1);
    expect(result).to.be.equal("done");
  });

  it("Testing update", async function () {
    sinon.stub(connection, "execute").resolves(sales);
    const result = await salesModel.update(1, sales);
    expect(result).to.be.deep.equal({
      saleId: 1,
      date: "2023-02-15T01:00:50.000Z",
      productId: 1,
      quantity: 5,
    });
  });

  afterEach(() => {
    sinon.restore();
  });
});

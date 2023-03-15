const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const salesService = require("../../../src/services/salesService");
const salesModel = require("../../../src/models/salesModel");
const productsModel = require("../../../src/models/productsModel");

const { expect } = chai;

chai.use(sinonChai);

const sales = [
  {
    saleId: 1,
    date: "2023-03-15T12:13:50.000Z",
    productId: 3,
    quantity: 7,
  },
  {
    productId: 3,
    quantity: 5,
  },
  {
    quantity: 10,
  },
];

describe("Sales Service Tests", function () {
  it("should not update with invalid product id", async function () {
    const updateData = {
      saleId: 1,
      date: "2023-02-15T01:00:50.000Z",
      quantity: 5,
    };

    sinon.stub(salesModel, "getSaleById").resolves([1]);

    const response = await salesService.updateSale(1, [updateData]);
    expect(response).to.be.deep.equal({
      message: '"productId" is required'
    });
  });

  it("should get all sales", async function () {
    sinon.stub(salesModel, "getAllSales").resolves(sales);

    const response = await salesService.getAllSales();
    expect(response).to.be.deep.equal(sales);
  });

  it("should get sale by id", async function () {
    sinon.stub(salesModel, "getSaleById").resolves(sales[0]);

    const response = await salesService.getSaleById({
      id: 1
    });
    expect(response).to.be.deep.equal(sales[0]);
  });

  it("should not update with invalid sale info", async function () {
    const expected = {
      saleId: 1,
      date: "2023-02-15T01:00:50.000Z",
      productId: 1,
      quantity: 5,
    };

    sinon.stub(salesModel, "updateSale").resolves(expected);

    sinon.stub(salesModel, "getSaleById").resolves([]);

    const result = await salesService.updateSale(1, expected);
    expect(result).to.be.deep.equal({
      message: "Sale not found"
    });
  });

  it("should delete a sale", async function () {
    sinon.stub(salesModel, "getSaleById").resolves([
      {
        date: "2023-03-15T12:21:28.000Z",
        productId: 3,
        quantity: 7,
      },
    ]);

    sinon.stub(salesModel, "deleteSale").resolves("done");

    const response = await salesService.deleteSale(1);
    expect(response).to.be.deep.equal({
      message: "done"
    });
  });

  it("should update the sale", async function () {
    const updateData = {
      saleId: 1,
      date: "2023-02-15T01:00:50.000Z",
      productId: 1,
      quantity: 5,
    };
    const expected = {
      saleId: 1,
      itemsUpdated: {
        date: "2023-02-15T01:00:50.000Z",
        productId: 1,
        quantity: 5,
        saleId: 1,
      },
    };
    sinon.stub(salesModel, "updateSale").resolves(updateData);
    sinon.stub(salesModel, "getSaleById").resolves([1]);
    const result = await salesService.updateSale(1, updateData);
    expect(result).to.be.deep.equal(expected);
  });

  afterEach(() => {
    sinon.restore();
  });
});

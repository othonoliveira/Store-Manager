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
  it("should not create a sale with invalid product", async function () {
    sinon.stub(salesModel, "itemsSold").resolves(sales[0]);

    sinon.stub(productsModel, "productIds").resolves([1]);

    sinon.stub(salesModel, "createSale").resolves(3);

    const response = await salesService.create([sales[1]]);
    expect(response).to.be.deep.equal({
      message: "Product not found"
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

  it("should create sale", async function () {
    const expected = {
      id: 3,
      itemsSold: [
        {
          productId: 1,
          quantity: 7,
        },
      ],
    };

    sinon.stub(salesModel, "itemsSold").resolves(sales[0]);

    sinon.stub(productsModel, "productIds").resolves([1, 2]);

    sinon.stub(salesModel, "createSale").resolves(3);

    const response = await salesService.createSale([sales[1]]);
    expect(response).to.be.deep.equal(expected);
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

  it("should not create a sale with missing information", async function () {
    sinon.stub(salesModel, "itemsSold").resolves(sales[0]);

    sinon.stub(productsModel, "productIds").resolves([1]);

    sinon.stub(salesModel, "createSale").resolves(3);

    const response = await salesService.create([sales[2]]);
    expect(response).to.be.deep.equal({
      message: '"productId" is required'
    });
  });

  afterEach(() => {
    sinon.restore();
  });
});

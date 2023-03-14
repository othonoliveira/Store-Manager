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
    date: "2023-02-15T01:00:50.000Z",
    productId: 1,
    quantity: 5,
  },
  {
    productId: 2,
    quantity: 15,
  },
  {
    quantity: 15,
  },
];

describe("Testing salesService", function () {
  it("Testing getAll", async function () {
    sinon.stub(salesModel, "getAll").resolves(sales);
    const result = await salesService.getAll();
    expect(result).to.be.deep.equal(sales);
  });

  it("Test getting sale by ID", async function () {
    sinon.stub(salesModel, "getSaleById").resolves(sales[0]);
    const result = await salesService.getSaleById({ id: 1 });
    expect(result).to.be.deep.equal(sales[0]);
  });

  it("Test create sale", async function () {
    const expected = {
      id: 3,
      itemsSold: [
        {
          productId: 2,
          quantity: 15,
        },
      ],
    };
    sinon.stub(salesModel, "create").resolves(sales[0]);
    sinon.stub(productsModel, "allIds").resolves([1, 2]);
    sinon.stub(salesModel, "createSale").resolves(3);
    const result = await salesService.create([sales[1]]);
    expect(result).to.be.deep.equal(expected);
  });

  it("Error on create sale", async function () {
    sinon.stub(salesModel, "create").resolves(sales[0]);
    sinon.stub(productsModel, "allIds").resolves([1]);
    sinon.stub(salesModel, "createSale").resolves(3);
    const result = await salesService.create([sales[1]]);
    expect(result).to.be.deep.equal({ message: "Product not found" });
  });

  it("Error on create sale, missing info", async function () {
    sinon.stub(salesModel, "create").resolves(sales[0]);
    sinon.stub(productsModel, "allIds").resolves([1]);
    sinon.stub(salesModel, "createSale").resolves(3);
    const result = await salesService.create([sales[2]]);
    expect(result).to.be.deep.equal({ message: '"productId" is required' });
  });

  it("Tests delete", async function () {
    sinon.stub(salesModel, "getSaleById").resolves([
      {
        date: "2023-02-15T03:02:28.000Z",
        productId: 3,
        quantity: 15,
      },
    ]);
    sinon.stub(salesModel, "deleteSale").resolves("done");
    const result = await salesService.deleteSale(1);
    expect(result).to.be.deep.equal({ message: "done" });
  });

  it("Tests error delete", async function () {
    sinon.stub(salesModel, "getSaleById").resolves([]);
    sinon.stub(salesModel, "deleteSale").resolves("done");
    const result = await salesService.deleteSale(1);
    expect(result).to.be.deep.equal({ message: "Sale not found" });
  });

  it("Tests update", async function () {
    const updateSale = {
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
    sinon.stub(salesModel, "update").resolves(updateSale);
    sinon.stub(salesModel, "getSaleById").resolves([1]);
    const result = await salesService.update(1, updateSale);
    expect(result).to.be.deep.equal(expected);
  });
  it("Tests error update, sale not found", async function () {
    const expected = {
      saleId: 1,
      date: "2023-02-15T01:00:50.000Z",
      productId: 1,
      quantity: 5,
    };
    sinon.stub(salesModel, "update").resolves(expected);
    sinon.stub(salesModel, "getSaleById").resolves([]);
    const result = await salesService.update(1, expected);
    expect(result).to.be.deep.equal({ message: "Sale not found" });
  });
  it("Tests error update, validation error", async function () {
    const updateSale = {
      saleId: 1,
      date: "2023-02-15T01:00:50.000Z",
      quantity: 5,
    };
    sinon.stub(salesModel, "getSaleById").resolves([1]);
    const result = await salesService.update(1, [updateSale]);
    expect(result).to.be.deep.equal({ message: '"productId" is required' });
  });

  afterEach(() => {
    sinon.restore();
  });
});

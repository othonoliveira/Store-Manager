const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const salesService = require("../../../src/services/salesService");
const salesController = require("../../../src/controllers/salesController");

const { expect } = chai;

chai.use(sinonChai);

const sales = [
  {
    saleId: 1,
    date: "2023-03-14T11:35:50.000Z",
    productId: 3,
    quantity: 2,
  },
  {
    saleId: 2,
    date: "2023-03-15T03:27:50.000Z",
    productId: 2,
    quantity: 7,
  },
];

describe("Sales Controller Tests", function () {
  it("should be possible to get all sales", async function () {
    const req = {};
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    sinon.stub(salesService, "getAllSales").resolves(sales);
    await salesController.getAllSales(req, res);

    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(sales);
  });

  it("should be possible to get sales by id", async function () {
    const req = { params: { id: 2 } };
    const res = {};

    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    sinon.stub(salesService, "getSaleById").resolves(sales[0]);
    await salesController.getSaleById(req, res);

    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(sales[0]);
  });

  it("should not be possible to get a sale from a invalid id", async function () {
    const req = { params: { id: 10 } };
    const res = {};

    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    const sale = [];

    sinon.stub(salesService, "getSaleById").resolves(sale);
    await salesController.getSaleById(req, res);

    expect(res.status).to.have.been.calledWith(404);
    expect(res.json).to.have.been.calledWith({
      message: "Sale not found"
    });
  });

  it("should be possible to create a new sale", async function () {
    const req = {
      body: {
        name: "Rompe-Tormentas"
      }
    };

    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    const reponse = {
      id: 1,
      itemsSold: sales
    };

    sinon.stub(salesService, "createSale").resolves(reponse);
    await salesController.createSale(req, res);

    expect(res.status).to.have.been.calledWith(201);
    expect(res.json).to.have.been.calledWith(reponse);
  });

  afterEach(() => {
    sinon.restore();
  });
});

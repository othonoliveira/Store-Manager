const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const productsService = require("../../../src/services/productsService");
const productsController = require("../../../src/controllers/productsController");

const { expect } = chai;

chai.use(sinonChai);

describe("Product Controloer Tests", function () {
  it("should not be possible to get products with a incorrect id", async function () {
    const req = { params: { id: 10 } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    const product = {
      status: 404,
      message: true,
      product: {
        message: "Product not Found"
      },
    };

    sinon.stub(productsService, "getProductById").resolves(product);
    await productsController.getProductById(req, res);
    expect(res.status).to.have.been.calledWith(404);
    expect(res.json).to.have.been.calledWith({
      message: product.message
    });
  });

  it("should be possible to get all products", async function () {
    const req = {};
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    const products = [
      {
        id: 1,
        name: "Martelo do Thor"
      },
      {
        id: 2,
        name: "Traje de encolhimento"
      },
    ];

    sinon.stub(productsService, "getAllProducts").resolves(products);
    await productsController.getAllProducts(req, res);

    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(products);
  });

  it("should be possible to get a product by id", async function () {
    const req = { params: { id: 1 } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    const product = {
      status: 200,
      product: [
      {
        id: 1,
        name: "Martelo de Thor"
      }],
    };

    sinon.stub(productsService, "getProductById").resolves(product);
    await productsController.getProductById(req, res);
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(product.product[0]);
  });

  it("should not be possible to create a product without name", async function () {
    const req = { body: {} };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    const reponse = {
      message: '"name" is required'
    };

    sinon.stub(productsService, "createProduct").resolves(reponse);
    await productsController.createProduct(req, res);
    expect(res.status).to.have.been.calledWith(400);
    expect(res.json).to.have.been.calledWith(reponse);
  });

  it("should be possible to create a new product", async function () {
    const req = { body: { name: "Arco do Gavião" } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    const reponse = {
      status: 201,
      product: {
        id: 4,
        name: "Arco do Gavião",
      },
    };

    sinon.stub(productsService, "createProduct").resolves(reponse);
    await productsController.createProduct(req, res);
    expect(res.status).to.have.been.calledWith(201);
    expect(res.json).to.have.been.calledWith(reponse.product);
  });

  it("should not be possible to create a product with name having less than 5 characters", async function () {
    const req = { body: { name: "Faca" } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    const reponse = {
      message: '"name" length must be at least 5 characters long',
    };
    
    sinon.stub(productsService, "createProduct").resolves(reponse);
    await productsController.createProduct(req, res);
    expect(res.status).to.have.been.calledWith(422);
    expect(res.json).to.have.been.calledWith(reponse);
  });

  it("should not be possbile to update a product with a invalid name", async function () {
    const req = {
      body: {},
      params: { id: 1 }
    };
    const res = {};

    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    const reponse = {
      message: '"name" is required'
    };

    sinon.stub(productsService, "updateProduct").resolves(reponse);
    await productsController.updateProduct(req, res);
    expect(res.status).to.have.been.calledWith(400);
    expect(res.json).to.have.been.calledWith(reponse);
  });

  it("should be possible to update a product", async function () {
    const req = {
      params: { id: 1 },
      body: {
        name: "Rompe-Tormentas do Thor"
      }
    };

    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    const reponse = {
      id: 1,
      name: "Rompe-Tormentas do Thor",
    };

    sinon.stub(productsService, "updateProduct").resolves(reponse);
    await productsController.updateProduct(req, res);
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(reponse);
  });

  afterEach(() => {
    sinon.restore();
  });
});

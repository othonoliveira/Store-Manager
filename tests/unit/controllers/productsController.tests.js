const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const productsService = require("../../../src/services/productsService");
const productsController = require("../../../src/controllers/productsController");

const { expect } = chai;

chai.use(sinonChai);

describe("Unit Testing products controller", function () {
  it("Testing all products", async function () {
    const req = {};
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    const products = [
      { id: 1, name: "PS5" },
      { id: 2, name: "Hair Brush" },
    ];
    sinon.stub(productsService, "getAll").resolves(products);
    await productsController.getAll(req, res);
    // expect(res.status.calledWith(200)).to.be.true;
    // expect(res.json.calledWith(products)).to.be.true;
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(products);
  });

  it("Tests if it brings specified ID", async function () {
    const req = { params: { id: 1 } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    const product = {
      status: 200,
      product: [{ id: 1, name: "Martelo de Thor" }],
    };
    sinon.stub(productsService, "getById").resolves(product);
    await productsController.getById(req, res);
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(product.product[0]);
  });

  it("Error on not finding ID", async function () {
    const req = { params: { id: 99 } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    const product = {
      status: 404,
      message: true,
      product: { message: "Product not Found" },
    };
    sinon.stub(productsService, "getById").resolves(product);
    await productsController.getById(req, res);
    expect(res.status).to.have.been.calledWith(404);
    expect(res.json).to.have.been.calledWith({ message: product.message });
  });

  it("Creates a new product", async function () {
    const req = { body: { name: "PS5 Digital Version" } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    const reponse = {
      status: 201,
      product: {
        id: 4,
        name: "PS5 Digital Version",
      },
    };
    sinon.stub(productsService, "create").resolves(reponse);
    await productsController.create(req, res);
    expect(res.status).to.have.been.calledWith(201);
    expect(res.json).to.have.been.calledWith(reponse.product);
  });

  it("Fail to Create a new product, less than 5 chars", async function () {
    const req = { body: { name: "PS5" } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    const reponse = {
      message: '"name" length must be at least 5 characters long',
    };
    sinon.stub(productsService, "create").resolves(reponse);
    await productsController.create(req, res);
    expect(res.status).to.have.been.calledWith(422);
    expect(res.json).to.have.been.calledWith(reponse);
  });

  it("Fail to Create a new product, no name", async function () {
    const req = { body: {} };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    const reponse = { message: '"name" is required' };
    sinon.stub(productsService, "create").resolves(reponse);
    await productsController.create(req, res);
    expect(res.status).to.have.been.calledWith(400);
    expect(res.json).to.have.been.calledWith(reponse);
  });

  it("Updates a product", async function () {
    const req = { body: { name: "PS5 Digital Version" }, params: { id: 1 } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    const reponse = {
      id: 1,
      name: "PS5 Digital Version",
    };
    sinon.stub(productsService, "update").resolves(reponse);
    await productsController.update(req, res);
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(reponse);
  });

  it("Fails do update a product, name required", async function () {
    const req = { body: {}, params: { id: 1 } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    const reponse = { message: '"name" is required' };

    sinon.stub(productsService, "update").resolves(reponse);
    await productsController.update(req, res);
    expect(res.status).to.have.been.calledWith(400);
    expect(res.json).to.have.been.calledWith(reponse);
  });

  it("Fails do update a product, name less than 5 chars", async function () {
    const req = { body: { name: "PS5" }, params: { id: 1 } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    const reponse = {
      message: '"name" length must be at least 5 characters long',
    };

    sinon.stub(productsService, "update").resolves(reponse);
    await productsController.update(req, res);
    expect(res.status).to.have.been.calledWith(422);
    expect(res.json).to.have.been.calledWith(reponse);
  });

  it("Fails do update a product, wrong id", async function () {
    const req = { body: { name: "PS5 Digital Version" }, params: { id: 99 } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    const reponse = { status: 404, message: "Product not found" };
    sinon.stub(productsService, "update").resolves(reponse);
    await productsController.update(req, res);
    expect(res.status).to.have.been.calledWith(404);
    expect(res.json).to.have.been.calledWith({ message: reponse.message });
  });

  it("Deletes a product", async function () {
    const req = { body: { name: "PS5 Digital Version" }, params: { id: 50 } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.end = sinon.stub().returns();
    const reponse = "done";
    sinon.stub(productsService, "deleteProduct").resolves(reponse);
    await productsController.deleteProduct(req, res);
    expect(res.status).to.have.been.calledWith(204);
    expect(res.end).to.have.been.calledWith();
  });

  it("Fails to delete product", async function () {
    const req = { body: { name: "PS5 Digital Version" }, params: { id: 99 } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    const reponse = { status: 404, message: "Product not found" };
    sinon.stub(productsService, "deleteProduct").resolves(reponse);
    await productsController.deleteProduct(req, res);
    expect(res.status).to.have.been.calledWith(404);
    expect(res.json).to.have.been.calledWith({ message: reponse.message });
  });

  // it('', function () {

  // })
  // it('', function () {

  // })
  afterEach(() => {
    sinon.restore();
  });
});

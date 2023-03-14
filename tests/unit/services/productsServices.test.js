const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const productsService = require("../../../src/services/productsService");
const productsModel = require("../../../src/models/productsModel");

const { expect } = chai;

chai.use(sinonChai);

describe("Testing products Service", async function () {
  it("Test getting all products", async function () {
    const products = [
      { id: 1, name: "PS5" },
      { id: 2, name: "Hair Brush" },
    ];
    sinon.stub(productsModel, "getAll").resolves(products);
    const result = await productsService.getAll();
    expect(result).to.be.deep.equal(products);
  });

  it("Test getting product by ID", async function () {
    const product = { name: "PS5" };
    const expected = {
      product: {
        name: "PS5",
      },
      status: 200,
    };
    sinon.stub(productsModel, "getById").resolves(product);
    const result = await productsService.getById({ id: 1 });
    expect(result).to.be.deep.equal(expected);
  });

  it("Failing on ID, id doesn't exist", async function () {
    const expected = { status: 404, message: "Product not found" };
    sinon.stub(productsModel, "getById").resolves([]);
    const result = await productsService.getById({ id: 1 });
    expect(result).to.be.deep.equal(expected);
  });

  it("Failing on ID, invalid ID", async function () {
    const product = { status: 400, message: '"id" must be a number' };
    sinon.stub(productsModel, "getById").resolves(product);
    const result = await productsService.getById({ id: "a" });
    expect(result).to.be.deep.equal(product);
  });

  it("Testing create", async function () {
    const createdId = 1;
    const expected = { status: 201, product: { id: 1, name: "PS5 2023" } };
    sinon.stub(productsModel, "create").resolves(createdId);
    const result = await productsService.create("PS5 2023");
    expect(result).to.be.deep.equal(expected);
  });

  it("Failing on create, less than 5 char name", async function () {
    const createdId = 1;
    const expected = {
      status: 400,
      message: '"name" length must be at least 5 characters long',
    };
    sinon.stub(productsModel, "create").resolves(createdId);
    const result = await productsService.create("PS5");
    expect(result).to.be.deep.equal(expected);
  });

  it("Testing update", async function () {
    const expected = { id: 1, name: "PS5 2023" };
    sinon.stub(productsModel, "getById").resolves(expected);
    sinon.stub(productsModel, "update").resolves({ id: 1, name: "PS5 2023" });
    const result = await productsService.update(1, "PS5 2023");
    expect(result).to.be.deep.equal(expected);
  });

  it("Failing update, less than 5 char name", async function () {
    const expected = {
      message: '"name" length must be at least 5 characters long',
    };
    sinon.stub(productsModel, "update").resolves({ id: 1, name: "PS5" });
    const result = await productsService.update(1, "PS5");
    expect(result).to.be.deep.equal(expected);
  });

  it("Failing update, missing id", async function () {
    const expected = { status: 404, message: "Product not found" };
    sinon.stub(productsModel, "getById").resolves([]);
    sinon.stub(productsModel, "update").resolves({ id: 1, name: "PS5 231" });
    const result = await productsService.update(1, "PS5 12");
    expect(result).to.be.deep.equal(expected);
  });

  it("Testing delete", async function () {
    sinon.stub(productsModel, "deleteProduct").resolves({});
    sinon.stub(productsModel, "getById").resolves({});
    const result = await productsService.deleteProduct(1);
    expect(result).to.be.deep.equal("done");
  });

  it("Failing on delete, missing Id", async function () {
    sinon.stub(productsModel, "deleteProduct").resolves({});
    sinon.stub(productsModel, "getById").resolves([]);
    const result = await productsService.deleteProduct(1);
    expect(result).to.be.deep.equal({
      status: 404,
      message: "Product not found",
    });
  });

  afterEach(() => {
    sinon.restore();
  });
});

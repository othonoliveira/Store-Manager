const chai = require("chai");
const sinon = require("sinon");
const connection = require("../../../src/models/connection");
const productsModel = require("../../../src/models/productsModel");

const { expect } = chai;


describe("Testing productsModel", function () {
  it("Testing getAll", async function () {
    const products = [
      { id: 1, name: "PS5" },
      { id: 2, name: "Hair Brush" },
    ];
    sinon.stub(connection, "execute").resolves([products]);
    const result = await productsModel.getAll();
    expect(result).to.be.deep.equal(products);
  });

  it("Testing getById", async function () {
    const product = [{ id: 1, name: "PS5" }];
    sinon.stub(connection, "execute").resolves([product]);
    const result = await productsModel.getById({ id: 1 });
    expect(result).to.be.deep.equal(product);
  });

  it("Testing allIds", async function () {
    const ids = [1, 2, 3, 4];
    sinon.stub(connection, "execute").resolves(ids);
    const result = await productsModel.allIds();
    expect(result).to.be.deep.equal([]);
  });

  it("Testing create", async function () {
    const product = [{ id: 1, name: "PS5" }];
    sinon.stub(connection, "execute").resolves([{ insertId: 1 }]);
    const result = await productsModel.create(product.name);
    expect(result).to.be.deep.equal(1);
  });

  it("Testing update", async function () {
    const product = { id: 1, name: "PS5" };
    sinon.stub(connection, "execute").resolves([product]);
    const result = await productsModel.update(product);
    expect(result).to.be.deep.equal(product);
  });

  it("Testing deleteProduct", async function () {
    const product = { id: 1, name: "PS5" };
    sinon.stub(connection, "execute").resolves("done");
    const result = await productsModel.deleteProduct(product.id);
    expect(result).to.be.deep.equal("done");
  });

  afterEach(() => {
    sinon.restore();
  });
});

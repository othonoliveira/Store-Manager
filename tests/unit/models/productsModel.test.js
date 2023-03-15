const chai = require("chai");
const sinon = require("sinon");
const connection = require("../../../src/models/connection");
const productsModel = require("../../../src/models/productsModel");

const { expect } = chai;


describe("Product Model Tests", function () {
  it("should get all products", async function () {
    const products = [
      {
        id: 1,
        name: "Martelo de Thor"
      },
      {
        id: 2,
        name: "Traje de encolhimento"
      },
    ];

    sinon.stub(connection, "execute").resolves([products]);
    const response = await productsModel.getAllProducts();
    expect(response).to.be.deep.equal(products);
  });

  it("should get by id", async function () {
    const product = [{
      id: 1,
      name: "Martelo de Thor"
    }];

    sinon.stub(connection, "execute").resolves([product]);
    const response = await productsModel.getProductById({ id: 1 });
    expect(response).to.be.deep.equal(product);
  });

  it("should get all products ids", async function () {
    const productIds = [1, 2, 3, 4];

    sinon.stub(connection, "execute").resolves(productIds);

    const response = await productsModel.productsIds();
    expect(response).to.be.deep.equal([]);
  });

  it("should create a product", async function () {
    const product = [{
      id: 1,
      name: "Martelo de Thor"
    }];
    sinon.stub(connection, "execute").resolves([{
      insertId: 1
    }]);
    
    const response = await productsModel.createProduct(product.name);
    expect(response).to.be.deep.equal(1);
  });

  afterEach(() => {
    sinon.restore();
  });
});

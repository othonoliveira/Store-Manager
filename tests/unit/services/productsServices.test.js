const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const productsService = require("../../../src/services/productsService");
const productsModel = require("../../../src/models/productsModel");

const { expect } = chai;

chai.use(sinonChai);

describe("Product Service Tests", async function () {
  it("should be possible to get product by id", async function () {
    const product = { name: "Martelo do Thor" };
    const expected = {
      product: {
        name: "Martelo do Thor",
      },
      status: 200,
    };
    sinon.stub(productsModel, "getById").resolves(product);
    const result = await productsService.getProductById({
      id: 1
    });
    expect(result).to.be.deep.equal(expected);
  });
  
  it("should get all the products", async function () {
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
    sinon.stub(productsModel, "getAllProducts").resolves(products);
    const response = await productsService.getAllProducts();
    expect(response).to.be.deep.equal(products);
  });

  it("should have a number id", async function () {
    const product = {
      status: 400,
      message: '"id" must be a number'
    };
    sinon.stub(productsModel, "getProductById").resolves(product);
    const response = await productsService.getProductById({
      id: "a"
    });
    expect(response).to.be.deep.equal(product);
  });

  it("should create a product", async function () {
    const id = 1;

    const expected = {
      status: 201,
      product: {
        id: 1,
        name: "Martelo do Thor"
      }
    };

    sinon.stub(productsModel, "createProduct").resolves(id);

    const response = await productsService.createProduct("Martelo do Thor");
    expect(response).to.be.deep.equal(expected);
  });

  it("should not be possible to get product with invalid id", async function () {
    const expected = {
      status: 404,
      message: "Product not found"
    };

    sinon.stub(productsModel, "getById").resolves([]);
    const response = await productsService.getProductById({
      id: 1
    });
    expect(response).to.be.deep.equal(expected);
  });

  afterEach(() => {
    sinon.restore();
  });
});

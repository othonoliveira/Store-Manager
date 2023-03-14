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
    date: "2023-02-15T01:00:50.000Z",
    productId: 1,
    quantity: 5,
  },
  {
    saleId: 2,
    date: "2023-02-15T01:00:50.000Z",
    productId: 3,
    quantity: 15,
  },
];

describe("Testing salesController", function () {
  it("Testing all sales", async function () {
    const req = {};
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    sinon.stub(salesService, "getAll").resolves(sales);
    await salesController.getAll(req, res);
    // expect(res.status.calledWith(200)).to.be.true;
    // expect(res.json.calledWith(products)).to.be.true;
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(sales);
  });

  it("Testing getById", async function () {
    const req = { params: { id: 1 } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();

    sinon.stub(salesService, "getSaleById").resolves(sales[0]);
    await salesController.getSaleById(req, res);
    // expect(res.status.calledWith(200)).to.be.true;
    // expect(res.json.calledWith(products)).to.be.true;
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(sales[0]);
  });

  it("Error on not finding ID", async function () {
    const req = { params: { id: 99 } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    const sale = [];
    sinon.stub(salesService, "getSaleById").resolves(sale);
    await salesController.getSaleById(req, res);
    expect(res.status).to.have.been.calledWith(404);
    expect(res.json).to.have.been.calledWith({ message: "Sale not found" });
  });

  it("Creates a new sale", async function () {
    const req = { body: { name: "PS5 Digital Version" } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    const reponse = { id: 1, itemsSold: sales };
    sinon.stub(salesService, "create").resolves(reponse);
    await salesController.create(req, res);
    expect(res.status).to.have.been.calledWith(201);
    expect(res.json).to.have.been.calledWith(reponse);
  });

  it("Failing on create sale, missing productId", async function () {
    const sales = [
      {
        date: "2023-02-15T01:00:50.000Z",
        quantity: 5,
      },
      {
        date: "2023-02-15T01:00:50.000Z",
        productId: 3,
        quantity: 15,
      },
    ];
    const req = { body: sales };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    const response = { message: '"productId" is required' };
    sinon.stub(salesService, "create").resolves(response);
    await salesController.create(req, res);
    expect(res.status).to.have.been.calledWith(400);
    expect(res.json).to.have.been.calledWith(response);
  });

  it("Failing on create sale, missing quantity", async function () {
    const sales = [
      {
        date: "2023-02-15T01:00:50.000Z",
        productId: 1,
        quantity: 0,
      },
      {
        date: "2023-02-15T01:00:50.000Z",
        productId: 3,
        quantity: 15,
      },
    ];
    const req = { body: sales };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    const response = {
      message: '"quantity" must be greater than or equal to 1',
    };
    sinon.stub(salesService, "create").resolves(response);
    await salesController.create(req, res);
    expect(res.status).to.have.been.calledWith(422);
    expect(res.json).to.have.been.calledWith(response);
  });

  it("Failing on create sale, wrong productId", async function () {
    const sales = [
      {
        productId: 99,
        quantity: 0,
      },
      {
        productId: 3,
        quantity: 15,
      },
    ];
    const req = { body: sales };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    const response = { message: "Product not found" };
    sinon.stub(salesService, "create").resolves(response);
    await salesController.create(req, res);
    expect(res.status).to.have.been.calledWith(404);
    expect(res.json).to.have.been.calledWith(response);
  });

  it("Testing deleteSale", async function () {
    const req = { params: { id: 1 } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.end = sinon.stub().returns();
    sinon.stub(salesService, "deleteSale").resolves({ message: "done" });
    await salesController.deleteSale(req, res);
    expect(res.end).to.have.been.calledWith();
  });

  it("Testing error on deleteSale", async function () {
    const req = { params: { id: 1 } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    sinon
      .stub(salesService, "deleteSale")
      .resolves({ message: "Product not found" });
    await salesController.deleteSale(req, res);
    expect(res.json).to.have.been.calledWith({ message: "Product not found" });
  });

  it('Testing update sale', async function () {
    const req = {params: {id: 1}, body: [
    {
        productId: 99,
        quantity: 15
    },
    {
        productId: 2,
        quantity: 15
    }
    ]
    }
    const res = {}
    const expected = {
    saleId: "1",
    itemsUpdated: [
        {
            productId: 1,
            quantity: 15
        },
        {
            productId: 2,
            quantity: 15
        }
    ]
}
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    sinon
      .stub(salesService, "update")
      .resolves(expected);
    await salesController.update(req, res);
    expect(res.json).to.have.been.calledWith(expected)
  })

  it('Testing error on update sale, missing productId', async function () {
    const req = {params: {id: 1}, body: [
    {
        quantity: 15
    },
    {
        productId: 2,
        quantity: 15
    }
    ]
    }
    const res = {}
    const expected = { message: "\"productId\" is required" }

    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    sinon
      .stub(salesService, "update")
      .resolves(expected);
    await salesController.update(req, res);
    expect(res.status).to.have.been.calledWith(400)
    expect(res.json).to.have.been.calledWith(expected)
  })

  it('Testing error on update sale, missing quantity', async function () {
    const req = {params: {id: 1}, body: [
      {
        productId: 2,
        quantity: 0
    },
    {
        productId: 2,
        quantity: 15
    }
    ]
    }
    const res = {}
    const expected = { message: "\"quantity\" must be greater than or equal to 1" }

    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    sinon
      .stub(salesService, "update")
      .resolves(expected);
    await salesController.update(req, res);
    expect(res.status).to.have.been.calledWith(422)
    expect(res.json).to.have.been.calledWith(expected)
  })

  it('Testing error on update sale, missing quantity', async function () {
    const req = {params: {id: 1}, body: [
      {
        productId: 99,
        quantity: 15
    },
    {
        productId: 2,
        quantity: 15
    }
    ]
    }
    const res = {}
    const expected = { message: "Product not found" }

    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    sinon
      .stub(salesService, "update")
      .resolves(expected);
    await salesController.update(req, res);
    expect(res.status).to.have.been.calledWith(404)
    expect(res.json).to.have.been.calledWith(expected)
  })

  it('Testing error on update sale, missing quantity', async function () {
    const req = {params: {id: 1}, body: [
      {
        productId: 99,
        quantity: 15
    },
    {
        productId: 2,
        quantity: 15
    }
    ]
    }
    const res = {}
    const expected = { message: "Sale not found" }

    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    sinon
      .stub(salesService, "update")
      .resolves(expected);
    await salesController.update(req, res);
    expect(res.status).to.have.been.calledWith(404)
    expect(res.json).to.have.been.calledWith(expected)
  })

  afterEach(() => {
    sinon.restore();
  });
});

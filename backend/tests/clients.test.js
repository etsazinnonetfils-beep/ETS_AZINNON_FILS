process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/prisma/prisma");

jest.mock("../src/prisma/prisma", () => ({
  client: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("Clients API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a list of clients", async () => {
    prisma.client.findMany.mockResolvedValue([{ id: 1, nom: "A", prenom: "B" }]);
    const token = require("jsonwebtoken").sign({ userId: 1, role: "GESTIONNAIRE" }, process.env.JWT_SECRET || "secret");
    const response = await request(app).get("/api/clients").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, nom: "A", prenom: "B" }]);
    expect(prisma.client.findMany).toHaveBeenCalledTimes(1);
  });

  it("should return 404 when a client is not found", async () => {
    prisma.client.findUnique.mockResolvedValue(null);
    const token = require("jsonwebtoken").sign({ userId: 1, role: "GESTIONNAIRE" }, process.env.JWT_SECRET || "secret");
    const response = await request(app).get("/api/clients/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Client introuvable" });
  });

  it("should create a client", async () => {
    const payload = {
      nom: "Test",
      prenom: "Client",
      telephone: "0123456789",
      email: "test@example.com",
      solde: 0,
    };
    prisma.client.create.mockResolvedValue({ id: 1, ...payload });

    const token = require("jsonwebtoken").sign({ userId: 1, role: "ADMIN" }, process.env.JWT_SECRET || "secret");
    const response = await request(app).post("/api/clients").set("Authorization", `Bearer ${token}`).send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 1, ...payload });
    expect(prisma.client.create).toHaveBeenCalledTimes(1);
  });

  it("should reject invalid client data", async () => {
    const token = require("jsonwebtoken").sign({ userId: 1, role: "ADMIN" }, process.env.JWT_SECRET || "secret");
    const response = await request(app).post("/api/clients").set("Authorization", `Bearer ${token}`).send({ nom: "" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("should strip solde when role is not allowed to set it on create", async () => {
    const payload = {
      nom: "Test",
      prenom: "Client",
      telephone: "0123456789",
      email: "test2@example.com",
      solde: 500,
    };
    prisma.client.create.mockResolvedValue({ id: 2, nom: payload.nom, prenom: payload.prenom, telephone: payload.telephone, email: payload.email });

    const token = require("jsonwebtoken").sign({ userId: 2, role: "GESTIONNAIRE" }, process.env.JWT_SECRET || "secret");
    const response = await request(app).post("/api/clients").set("Authorization", `Bearer ${token}`).send(payload);

    expect(response.status).toBe(201);
    // Ensure prisma.client.create was called with data that does NOT include solde
    const calledArg = prisma.client.create.mock.calls[0][0];
    expect(calledArg).toBeDefined();
    expect(calledArg.data).toBeDefined();
    expect(calledArg.data.solde).toBeUndefined();
  });

  it("should strip solde when role is not allowed to set it on update", async () => {
    prisma.client.update.mockResolvedValue({ id: 3, nom: "Up", prenom: "Client", telephone: "0123456789", email: "up@example.com" });
    const token = require("jsonwebtoken").sign({ userId: 3, role: "GESTIONNAIRE" }, process.env.JWT_SECRET || "secret");
    const response = await request(app)
      .put("/api/clients/3")
      .set("Authorization", `Bearer ${token}`)
      .send({ nom: "Up", prenom: "Client", telephone: "0123456789", email: "up@example.com", solde: 1000 });

    expect(response.status).toBe(200);
    const calledArg = prisma.client.update.mock.calls[0][0];
    expect(calledArg).toBeDefined();
    expect(calledArg.data).toBeDefined();
    expect(calledArg.data.solde).toBeUndefined();
  });

  it("GET /api/clients without JWT returns 401", async () => {
    const response = await request(app).get("/api/clients");
    expect(response.status).toBe(401);
  });

  it("GET /api/clients with unauthorized role returns 403", async () => {
    const token = require("jsonwebtoken").sign({ userId: 99, role: "COMMERCIAL" }, process.env.JWT_SECRET || "secret");
    const response = await request(app).get("/api/clients").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(403);
  });

  it("POST /api/clients without JWT returns 401", async () => {
    const payload = { nom: "X", prenom: "Y", telephone: "0123456789", email: "x@y.com", solde: 100 };
    const response = await request(app).post("/api/clients").send(payload);
    expect(response.status).toBe(401);
  });

  it("POST /api/clients with unauthorized role returns 403", async () => {
    const payload = { nom: "X", prenom: "Y", telephone: "0123456789", email: "x@y.com", solde: 100 };
    const token = require("jsonwebtoken").sign({ userId: 99, role: "COMMERCIAL" }, process.env.JWT_SECRET || "secret");
    const response = await request(app).post("/api/clients").set("Authorization", `Bearer ${token}`).send(payload);
    expect(response.status).toBe(403);
  });

  it("PUT /api/clients/:id without JWT returns 401", async () => {
    const response = await request(app).put("/api/clients/1").send({ nom: "Up", solde: 200 });
    expect(response.status).toBe(401);
  });

  it("PUT /api/clients/:id with unauthorized role returns 403", async () => {
    const token = require("jsonwebtoken").sign({ userId: 99, role: "COMMERCIAL" }, process.env.JWT_SECRET || "secret");
    const response = await request(app).put("/api/clients/1").set("Authorization", `Bearer ${token}`).send({ nom: "Up", solde: 200 });
    expect(response.status).toBe(403);
  });
});

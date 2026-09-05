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
    const response = await request(app).get("/api/clients");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, nom: "A", prenom: "B" }]);
    expect(prisma.client.findMany).toHaveBeenCalledTimes(1);
  });

  it("should return 404 when a client is not found", async () => {
    prisma.client.findUnique.mockResolvedValue(null);
    const response = await request(app).get("/api/clients/1");

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

    const response = await request(app).post("/api/clients").send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 1, ...payload });
    expect(prisma.client.create).toHaveBeenCalledTimes(1);
  });

  it("should reject invalid client data", async () => {
    const response = await request(app).post("/api/clients").send({ nom: "" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});

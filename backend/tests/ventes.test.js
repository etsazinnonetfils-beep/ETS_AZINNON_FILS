const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/prisma/prisma");

jest.mock("../src/prisma/prisma", () => ({
  client: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  moto: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  vente: {
    create: jest.fn(),
  },
  $transaction: jest.fn(),
}));

describe("Ventes API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a sale and mark the moto as sold", async () => {
    prisma.client.findUnique.mockResolvedValue(null);
    prisma.client.create.mockResolvedValue({ id: 10, nom: "Jean", prenom: "Dupont", telephone: "0123456789" });
    prisma.moto.findUnique.mockResolvedValue({ id: 5, statut: "EN_STOCK", disponible: true });
    prisma.$transaction.mockImplementation(async (callback) => callback(prisma));
    prisma.vente.create.mockResolvedValue({
      id: 1,
      clientId: 10,
      utilisateurId: 2,
      motoId: 5,
      type: "COMPTANT",
      montant: 10000,
      acompte: 10000,
      reste: 0,
      statut: "SOLDEE",
      paiements: [{ id: 1, montant: 10000, mode: "ESPECES" }],
    });
    prisma.moto.update.mockResolvedValue({ id: 5, statut: "VENDUE", disponible: false });

    const response = await request(app)
      .post("/api/ventes")
      .set("Authorization", `Bearer ${require("jsonwebtoken").sign({ userId: 2, role: "ADMIN" }, process.env.JWT_SECRET || "secret")}`)
      .send({
        utilisateurId: 2,
        motoId: 5,
        type: "COMPTANT",
        montant: 10000,
        acompte: 10000,
        client: {
          nom: "Jean",
          prenom: "Dupont",
          telephone: "0123456789",
        },
        paiement: {
          mode: "ESPECES",
          montant: 10000,
        },
      });

    expect(response.status).toBe(201);
    expect(response.body.statut).toBe("SOLDEE");
    expect(prisma.moto.update).toHaveBeenCalledWith({ where: { id: 5 }, data: { statut: "VENDUE", disponible: false } });
  });

  it("should reject a moto already sold", async () => {
    prisma.client.findUnique.mockResolvedValue({ id: 10, nom: "Jean", prenom: "Dupont", telephone: "0123456789" });
    prisma.moto.findUnique.mockResolvedValue({ id: 5, statut: "VENDUE", disponible: false });

    const response = await request(app)
      .post("/api/ventes")
      .set("Authorization", `Bearer ${require("jsonwebtoken").sign({ userId: 2, role: "ADMIN" }, process.env.JWT_SECRET || "secret")}`)
      .send({
        utilisateurId: 2,
        motoId: 5,
        type: "COMPTANT",
        montant: 10000,
        acompte: 10000,
        clientId: 10,
        paiement: { mode: "ESPECES", montant: 10000 },
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Moto déjà vendue");
  });
});

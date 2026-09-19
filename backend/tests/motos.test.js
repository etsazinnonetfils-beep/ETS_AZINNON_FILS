const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/prisma/prisma");

jest.mock("../src/prisma/prisma", () => ({
  moto: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const sampleMoto = {
  id: 1,
  reference: "MT-2026-001",
  sku: "SKU123",
  codeBarres: "CODE123",
  marqueId: 1,
  type: "Sport",
  modele: "R1",
  couleur: "Rouge",
  annee: 2024,
  numeroChassis: "CHASSIS123",
  numeroMoteur: "MOTEUR123",
  immatriculation: "AB-123-CD",
  fournisseurId: null,
  dateAchat: new Date("2024-01-01T00:00:00.000Z"),
  prixAchat: 8000,
  prixVente: 9500,
  garantie: "12 mois",
  photo: null,
  statut: "EN_STOCK",
  disponible: true,
  observations: "Neuf",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  marque: { id: 1, nom: "Yamaha" },
};

describe("Motos API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should list motos with pagination and filtering", async () => {
    prisma.moto.count.mockResolvedValue(1);
    prisma.moto.findMany.mockResolvedValue([sampleMoto]);

    const token = require("jsonwebtoken").sign({ userId: 1, role: "MAGASINIER" }, process.env.JWT_SECRET || "secret");
    const response = await request(app).get("/api/motos?search=R1&marque=Yamaha&statut=EN_STOCK&sortBy=createdAt&order=desc&page=1&limit=10").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.meta.total).toBe(1);
    expect(response.body.data[0].sku).toBe("SKU123");
  });

  it("should get a moto by id", async () => {
    prisma.moto.findUnique.mockResolvedValue(sampleMoto);

    const token = require("jsonwebtoken").sign({ userId: 1, role: "MAGASINIER" }, process.env.JWT_SECRET || "secret");
    const response = await request(app).get("/api/motos/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.reference).toBe("MT-2026-001");
  });

  it("should create a new moto", async () => {
    prisma.moto.create.mockResolvedValue(sampleMoto);

    const response = await request(app)
      .post("/api/motos")
      .set("Authorization", `Bearer ${require("jsonwebtoken").sign({ userId: 1, role: "MAGASINIER" }, process.env.JWT_SECRET || "secret")}`)
      .send({
        sku: "SKU123",
        codeBarres: "CODE123",
        marqueId: 1,
        type: "Sport",
        modele: "R1",
        couleur: "Rouge",
        annee: 2024,
        numeroChassis: "CHASSIS123",
        numeroMoteur: "MOTEUR123",
        immatriculation: "AB-123-CD",
        dateAchat: "2024-01-01",
        prixAchat: 8000,
        prixVente: 9500,
        statut: "EN_STOCK",
      });

    expect(response.status).toBe(201);
    expect(response.body.sku).toBe("SKU123");
    expect(response.body.reference).toBe("MT-2026-001");
  });

  it("should update a moto", async () => {
    prisma.moto.update.mockResolvedValue({ ...sampleMoto, couleur: "Noir" });

    const response = await request(app)
      .put("/api/motos/1")
      .set("Authorization", `Bearer ${require("jsonwebtoken").sign({ userId: 1, role: "MAGASINIER" }, process.env.JWT_SECRET || "secret")}`)
      .send({ couleur: "Noir" });

    expect(response.status).toBe(200);
    expect(response.body.couleur).toBe("Noir");
  });

  it("should delete a moto", async () => {
    prisma.moto.delete.mockResolvedValue({});

    const response = await request(app)
      .delete("/api/motos/1")
      .set("Authorization", `Bearer ${require("jsonwebtoken").sign({ userId: 1, role: "MAGASINIER" }, process.env.JWT_SECRET || "secret")}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Moto supprimée avec succès");
  });

  it("GET /api/motos without JWT returns 401", async () => {
    const response = await request(app).get("/api/motos");
    expect(response.status).toBe(401);
  });

  it("GET /api/motos with unauthorized role returns 403", async () => {
    const token = require("jsonwebtoken").sign({ userId: 5, role: "COMMERCIAL" }, process.env.JWT_SECRET || "secret");
    const response = await request(app).get("/api/motos").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(403);
  });
});

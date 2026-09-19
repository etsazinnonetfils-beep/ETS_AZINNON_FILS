process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const prisma = require("../src/prisma/prisma");

jest.mock("../src/prisma/prisma", () => ({
  utilisateur: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
}));

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const authToken = jwt.sign({ userId: 1, role: "SUPER_ADMIN" }, JWT_SECRET, { expiresIn: "1d" });

const sampleUtilisateur = {
  id: 1,
  nom: "Test",
  prenom: "User",
  email: "test.user@example.com",
  telephone: "0123456789",
  username: "testuser",
  role: "ADMIN",
  actif: true,
  statut: "ACTIF",
  deletedAt: null,
};

describe("Utilisateurs API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should list utilisateurs", async () => {
    prisma.utilisateur.count.mockResolvedValue(1);
    prisma.utilisateur.findMany.mockResolvedValue([sampleUtilisateur]);

    const response = await request(app)
      .get("/api/utilisateurs")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("meta");
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data[0].email).toBe(sampleUtilisateur.email);
  });

  it("should create a new utilisateur", async () => {
    prisma.utilisateur.create.mockResolvedValue({
      ...sampleUtilisateur,
      id: 2,
      email: "new.user@example.com",
      telephone: "0987654321",
      role: "GESTIONNAIRE",
    });

    const response = await request(app)
      .post("/api/utilisateurs")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        nom: "New",
        prenom: "User",
        email: "new.user@example.com",
        telephone: "0987654321",
        motDePasse: "securePass123",
        role: "GESTIONNAIRE",
      });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe("new.user@example.com");
  });

  it("should update utilisateur profile", async () => {
    prisma.utilisateur.update.mockResolvedValue({ ...sampleUtilisateur, prenom: "Updated" });

    const response = await request(app)
      .put("/api/utilisateurs/1")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ prenom: "Updated" });

    expect(response.status).toBe(200);
    expect(response.body.prenom).toBe("Updated");
  });

  it("should deactivate utilisateur", async () => {
    prisma.utilisateur.update.mockResolvedValue({
      ...sampleUtilisateur,
      id: 1,
      actif: false,
      statut: "INACTIF",
    });

    const response = await request(app)
      .patch("/api/utilisateurs/1/desactiver")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.actif).toBe(false);
  });
});

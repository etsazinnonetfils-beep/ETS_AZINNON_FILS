process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
const request = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const prisma = require("../src/prisma/prisma");

jest.mock("../src/prisma/prisma", () => ({
  utilisateur: {
    findFirst: jest.fn(),
    update: jest.fn(),
  },
}));

const JWT_SECRET = process.env.JWT_SECRET || "secret";

describe("Auth API", () => {
  let hashedPassword;
  const user = {
    id: 1,
    nom: "John",
    prenom: "Doe",
    email: "john@example.com",
    telephone: "0123456789",
    username: "johndoe",
    motDePasse: "",
    role: "SUPER_ADMIN",
    actif: true,
    statut: "ACTIF",
    deletedAt: null,
  };

  beforeAll(async () => {
    hashedPassword = await bcrypt.hash("secret123", 10);
    user.motDePasse = hashedPassword;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should login successfully with email", async () => {
    prisma.utilisateur.findFirst.mockResolvedValue(user);
    prisma.utilisateur.update.mockResolvedValue({ ...user, refreshToken: "refresh-token" });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ identifier: "john@example.com", motDePasse: "secret123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
    expect(response.body.utilisateur.email).toBe("john@example.com");
    expect(prisma.utilisateur.findFirst).toHaveBeenCalledTimes(1);
  });

  it("should reject login with wrong password", async () => {
    prisma.utilisateur.findFirst.mockResolvedValue(user);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ identifier: "john@example.com", motDePasse: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBeDefined();
  });

  it("should return 401 for invalid token on protected route", async () => {
    const response = await request(app)
      .get("/api/utilisateurs")
      .set("Authorization", "Bearer invalid.token.value");

    expect(response.status).toBe(401);
  });

  it("should return 403 for unauthorized role", async () => {
    const token = jwt.sign({ userId: 2, role: "COMMERCIAL" }, JWT_SECRET, { expiresIn: "1d" });
    const response = await request(app)
      .get("/api/utilisateurs")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it("should refresh token successfully", async () => {
    prisma.utilisateur.findFirst.mockResolvedValue({ ...user, refreshToken: "refresh-token" });
    prisma.utilisateur.update.mockResolvedValue({ ...user, refreshToken: "new-refresh-token" });

    const response = await request(app)
      .post("/api/auth/refresh-token")
      .send({ refreshToken: "refresh-token" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
  });
});

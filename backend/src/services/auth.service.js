const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/prisma");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
const SALT_ROUNDS = 10;

const signAccessToken = (utilisateur) =>
  jwt.sign({ userId: utilisateur.id, role: utilisateur.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

const generateRefreshToken = () => crypto.randomBytes(40).toString("hex");

const sanitizeUser = (utilisateur) => {
  if (!utilisateur) return null;
  const {
    motDePasse,
    refreshToken,
    passwordResetToken,
    passwordResetExpires,
    ...safeUser
  } = utilisateur;
  return safeUser;
};

exports.login = async (identifier, motDePasse) => {
  const utilisateur = await prisma.utilisateur.findFirst({
    where: {
      OR: [
        { email: identifier },
        { telephone: identifier },
        { username: identifier },
      ],
      deletedAt: null,
    },
  });

  if (!utilisateur) {
    const error = new Error("Identifiants invalides");
    error.status = 401;
    throw error;
  }

  if (!utilisateur.actif || utilisateur.statut !== "ACTIF") {
    const error = new Error("Utilisateur inactif ou suspendu");
    error.status = 403;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
  if (!passwordMatches) {
    const error = new Error("Identifiants invalides");
    error.status = 401;
    throw error;
  }

  const accessToken = signAccessToken(utilisateur);
  const refreshToken = generateRefreshToken();

  await prisma.utilisateur.update({
    where: { id: utilisateur.id },
    data: { refreshToken, dernierLogin: new Date() },
  });

  return {
    accessToken,
    refreshToken,
    utilisateur: sanitizeUser(utilisateur),
  };
};

exports.logout = async (userId) => {
  await prisma.utilisateur.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
};

exports.refreshToken = async (token) => {
  const utilisateur = await prisma.utilisateur.findFirst({
    where: { refreshToken: token, deletedAt: null },
  });
  if (!utilisateur) {
    const error = new Error("Refresh token invalide");
    error.status = 401;
    throw error;
  }

  const accessToken = signAccessToken(utilisateur);
  const refreshToken = generateRefreshToken();

  await prisma.utilisateur.update({
    where: { id: utilisateur.id },
    data: { refreshToken },
  });

  return { accessToken, refreshToken };
};

exports.changePassword = async (userId, currentPassword, newPassword) => {
  const utilisateur = await prisma.utilisateur.findUnique({ where: { id: userId } });
  if (!utilisateur) {
    const error = new Error("Utilisateur introuvable");
    error.status = 404;
    throw error;
  }

  const validPassword = await bcrypt.compare(currentPassword, utilisateur.motDePasse);
  if (!validPassword) {
    const error = new Error("Mot de passe actuel incorrect");
    error.status = 401;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.utilisateur.update({
    where: { id: userId },
    data: { motDePasse: hashedPassword, refreshToken: null },
  });
};

exports.forgotPassword = async (identifier) => {
  const utilisateur = await prisma.utilisateur.findFirst({
    where: {
      OR: [
        { email: identifier },
        { telephone: identifier },
        { username: identifier },
      ],
      deletedAt: null,
    },
  });

  if (!utilisateur) {
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.utilisateur.update({
    where: { id: utilisateur.id },
    data: {
      passwordResetToken: token,
      passwordResetExpires: expires,
    },
  });
  // Do NOT log the reset token. Delivery (email/SMS) must handle token securely.
};

exports.resetPassword = async (token, newPassword) => {
  const utilisateur = await prisma.utilisateur.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpires: { gt: new Date() },
      deletedAt: null,
    },
  });

  if (!utilisateur) {
    const error = new Error("Token de réinitialisation invalide ou expiré");
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.utilisateur.update({
    where: { id: utilisateur.id },
    data: {
      motDePasse: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
      refreshToken: null,
    },
  });
};

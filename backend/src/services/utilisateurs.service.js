const bcrypt = require("bcrypt");
const prisma = require("../prisma/prisma");
const SALT_ROUNDS = 10;

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

exports.listUsers = async ({ page = 1, limit = 20, search, role, statut, actif }) => {
  const take = Number(limit) > 0 ? Number(limit) : 20;
  const skip = (Number(page) > 1 ? Number(page) - 1 : 0) * take;

  const where = {
    deletedAt: null,
    AND: [],
  };

  if (search) {
    where.AND.push({
      OR: [
        { nom: { contains: search, mode: "insensitive" } },
        { prenom: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { telephone: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  if (role) {
    where.AND.push({ role });
  }

  if (statut) {
    where.AND.push({ statut });
  }

  if (typeof actif !== "undefined") {
    where.AND.push({ actif: actif === "true" || actif === true });
  }

  if (where.AND.length === 0) delete where.AND;

  const [total, utilisateurs] = await Promise.all([
    prisma.utilisateur.count({ where }),
    prisma.utilisateur.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    meta: {
      total,
      page: Number(page),
      limit: take,
      pages: Math.ceil(total / take),
    },
    data: utilisateurs.map(sanitizeUser),
  };
};

exports.getUserById = async (id) => {
  const utilisateur = await prisma.utilisateur.findFirst({
    where: { id, deletedAt: null },
  });
  return sanitizeUser(utilisateur);
};

exports.createUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.motDePasse, SALT_ROUNDS);
  const utilisateur = await prisma.utilisateur.create({
    data: {
      ...data,
      motDePasse: hashedPassword,
      actif: data.actif ?? true,
      statut: data.statut ?? "ACTIF",
    },
  });
  return sanitizeUser(utilisateur);
};

exports.updateUser = async (id, data) => {
  const updateData = { ...data };
  if (data.motDePasse) {
    updateData.motDePasse = await bcrypt.hash(data.motDePasse, SALT_ROUNDS);
  }
  const utilisateur = await prisma.utilisateur.update({
    where: { id },
    data: updateData,
  });
  return sanitizeUser(utilisateur);
};

exports.deactivateUser = async (id) => {
  const utilisateur = await prisma.utilisateur.update({
    where: { id },
    data: { actif: false, statut: "INACTIF" },
  });
  return sanitizeUser(utilisateur);
};

exports.reactivateUser = async (id) => {
  const utilisateur = await prisma.utilisateur.update({
    where: { id },
    data: { actif: true, statut: "ACTIF" },
  });
  return sanitizeUser(utilisateur);
};

exports.softDeleteUser = async (id) => {
  await prisma.utilisateur.update({
    where: { id },
    data: { deletedAt: new Date(), actif: false, statut: "SUPPRIME" },
  });
};

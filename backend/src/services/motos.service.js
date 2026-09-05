const prisma = require("../prisma/prisma");

const buildReference = async () => {
  const year = new Date().getFullYear();
  const prefix = `MT-${year}-`;
  const lastMoto = await prisma.moto.findFirst({
    where: { reference: { startsWith: prefix } },
    orderBy: { reference: "desc" },
  });

  if (!lastMoto || !lastMoto.reference) {
    return `${prefix}001`;
  }

  const parts = lastMoto.reference.split("-");
  const counter = Number(parts[2]) || 0;
  return `${prefix}${String(counter + 1).padStart(3, "0")}`;
};

const sanitizeMoto = (moto) => {
  if (!moto) return null;
  const { createdAt, ...rest } = moto;
  return { ...rest, createdAt: moto.createdAt };
};

exports.listMotos = async ({ page = 1, limit = 20, search, marque, statut, sortBy = "createdAt", order = "desc" }) => {
  const take = Number(limit) > 0 ? Number(limit) : 20;
  const skip = (Number(page) > 1 ? Number(page) - 1 : 0) * take;

  const where = { AND: [] };

  if (search) {
    where.AND.push({
      OR: [
        { sku: { contains: search, mode: "insensitive" } },
        { codeBarres: { contains: search, mode: "insensitive" } },
        { modele: { contains: search, mode: "insensitive" } },
        { couleur: { contains: search, mode: "insensitive" } },
        { numeroChassis: { contains: search, mode: "insensitive" } },
        { numeroMoteur: { contains: search, mode: "insensitive" } },
        { reference: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  if (marque) {
    where.AND.push({ marque: { nom: { contains: marque, mode: "insensitive" } } });
  }

  if (statut) {
    where.AND.push({ statut });
  }

  if (where.AND.length === 0) {
    delete where.AND;
  }

  const [total, motos] = await Promise.all([
    prisma.moto.count({ where }),
    prisma.moto.findMany({
      where,
      include: { marque: true },
      skip,
      take,
      orderBy: { [sortBy]: order },
    }),
  ]);

  return {
    meta: {
      total,
      page: Number(page),
      limit: take,
      pages: Math.ceil(total / take),
    },
    data: motos.map(sanitizeMoto),
  };
};

exports.getMotoById = async (id) => {
  const moto = await prisma.moto.findUnique({
    where: { id },
    include: { marque: true },
  });
  return sanitizeMoto(moto);
};

exports.createMoto = async (data) => {
  const reference = await buildReference();
  return prisma.moto.create({
    data: {
      reference,
      ...data,
      annee: data.annee ?? null,
      prixAchat: Number(data.prixAchat),
      prixVente: Number(data.prixVente),
      disponible: data.statut !== "VENDUE",
    },
    include: { marque: true },
  });
};

exports.updateMoto = async (id, data) => {
  const updateData = {
    ...data,
    annee: data.annee !== undefined ? Number(data.annee) : undefined,
    prixAchat: data.prixAchat !== undefined ? Number(data.prixAchat) : undefined,
    prixVente: data.prixVente !== undefined ? Number(data.prixVente) : undefined,
    disponible:
      data.statut === "VENDUE"
        ? false
        : data.statut === "EN_STOCK"
        ? true
        : undefined,
  };
  return prisma.moto.update({
    where: { id },
    data: updateData,
    include: { marque: true },
  });
};

exports.deleteMoto = async (id) => {
  await prisma.moto.delete({ where: { id } });
};

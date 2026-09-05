const prisma = require("../prisma/prisma");

const createError = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const findOrCreateClient = async (clientData) => {
  if (!clientData) return null;
  if (!clientData.telephone) {
    return prisma.client.create({ data: clientData });
  }

  const existingClient = await prisma.client.findUnique({ where: { telephone: clientData.telephone } });
  if (existingClient) {
    return existingClient;
  }

  return prisma.client.create({ data: clientData });
};

exports.listVentes = async () => {
  return prisma.vente.findMany({
    include: { client: true, moto: true, paiements: true },
    orderBy: { createdAt: "desc" },
  });
};

exports.getVenteById = async (id) => {
  return prisma.vente.findUnique({
    where: { id },
    include: { client: true, moto: true, paiements: true },
  });
};

exports.createVente = async (data) => {
  const clientId = data.clientId || null;
  let client = null;

  if (!clientId && !data.client) {
    throw createError("clientId ou client requis", 400);
  }

  if (clientId) {
    client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) {
      throw createError("Client introuvable", 404);
    }
  } else {
    client = await findOrCreateClient(data.client);
  }

  const moto = await prisma.moto.findUnique({ where: { id: data.motoId } });
  if (!moto) {
    throw createError("Moto introuvable", 404);
  }
  if (moto.statut === "VENDUE" || moto.disponible === false) {
    throw createError("Moto déjà vendue", 409);
  }

  const montant = Number(data.montant);
  const acompte = data.acompte !== undefined ? Number(data.acompte) : Number(data.paiement.montant || 0);
  if (Number.isNaN(montant) || montant <= 0) {
    throw createError("Montant de vente invalide", 400);
  }
  if (Number.isNaN(acompte) || acompte < 0) {
    throw createError("Montant d'acompte invalide", 400);
  }
  if (acompte > montant) {
    throw createError("L'acompte ne peut pas dépasser le montant total", 400);
  }

  const reste = Number((montant - acompte).toFixed(2));
  const statut = reste > 0 ? "EN_COURS" : "SOLDEE";
  const paiementType = reste > 0 ? "ACOMPTE" : "SOLDE";

  const vente = await prisma.$transaction(async (tx) => {
    const createdVente = await tx.vente.create({
      data: {
        clientId: client.id,
        utilisateurId: data.utilisateurId,
        motoId: data.motoId,
        type: data.type,
        montant,
        acompte,
        reste,
        statut,
        paiements: {
          create: {
            clientId: client.id,
            utilisateurId: data.utilisateurId,
            type: paiementType,
            montant: acompte,
            mode: data.paiement.mode,
            commentaire: data.paiement.commentaire,
          },
        },
      },
      include: { client: true, moto: true, paiements: true },
    });

    await tx.moto.update({
      where: { id: data.motoId },
      data: { statut: "VENDUE", disponible: false },
    });

    return createdVente;
  });

  return vente;
};

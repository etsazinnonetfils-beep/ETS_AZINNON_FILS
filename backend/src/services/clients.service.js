const prisma = require("../prisma/prisma");

exports.getAllClients = async () => {
  return prisma.client.findMany({
    include: { ventes: true, paiements: true, locations: true, documents: true },
    orderBy: { createdAt: "desc" },
  });
};

exports.getClientById = async (id) => {
  return prisma.client.findUnique({
    where: { id },
    include: { ventes: true, paiements: true, locations: true, documents: true },
  });
};

exports.createClient = async (data) => {
  return prisma.client.create({ data });
};

exports.updateClient = async (id, data) => {
  return prisma.client.update({ where: { id }, data });
};

exports.deleteClient = async (id) => {
  return prisma.client.delete({ where: { id } });
};

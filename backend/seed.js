const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const adminInitialPassword = process.env.ADMIN_INITIAL_PASSWORD;
  if (!adminInitialPassword) {
    throw new Error('ADMIN_INITIAL_PASSWORD must be set for seeding.');
  }
  const password = await bcrypt.hash(adminInitialPassword, 10);

  await prisma.utilisateur.upsert({
    where: { email: "admin@etsazinnon.com" },
    update: {},
    create: {
      nom: "Admin",
      prenom: "Super",
      telephone: "+229000000000",
      email: "admin@etsazinnon.com",
      motDePasse: password,
      role: "ADMIN",
    },
  });

  await prisma.marque.upsert({
    where: { nom: "Yamaha" },
    update: {},
    create: { nom: "Yamaha" },
  });

  await prisma.marque.upsert({
    where: { nom: "Honda" },
    update: {},
    create: { nom: "Honda" },
  });

  console.log("✅ Données initiales créées avec succès.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

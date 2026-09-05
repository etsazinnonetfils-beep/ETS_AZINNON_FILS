-- CreateTable
CREATE TABLE "Moto" (
    "id" SERIAL NOT NULL,
    "marque" TEXT NOT NULL,
    "modele" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "numeroChassis" TEXT NOT NULL,
    "numeroMoteur" TEXT NOT NULL,
    "couleur" TEXT NOT NULL,
    "prixAchat" DOUBLE PRECISION NOT NULL,
    "prixVente" DOUBLE PRECISION NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'EN_STOCK',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Moto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Moto_numeroChassis_key" ON "Moto"("numeroChassis");

-- CreateIndex
CREATE UNIQUE INDEX "Moto_numeroMoteur_key" ON "Moto"("numeroMoteur");

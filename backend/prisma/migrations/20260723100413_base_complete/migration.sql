/*
  Warnings:

  - You are about to drop the column `marque` on the `Moto` table. All the data in the column will be lost.
  - The `statut` column on the `Moto` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `marqueId` to the `Moto` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoleUtilisateur" AS ENUM ('ADMIN', 'CAISSIER', 'MAGASINIER', 'COMPTABLE');

-- CreateEnum
CREATE TYPE "StatutMoto" AS ENUM ('EN_STOCK', 'RESERVEE', 'VENDUE');

-- CreateEnum
CREATE TYPE "TypeVente" AS ENUM ('COMPTANT', 'CREDIT');

-- CreateEnum
CREATE TYPE "StatutVente" AS ENUM ('EN_COURS', 'SOLDEE', 'ANNULEE');

-- AlterTable
ALTER TABLE "Moto" DROP COLUMN "marque",
ADD COLUMN     "annee" INTEGER,
ADD COLUMN     "marqueId" INTEGER NOT NULL,
DROP COLUMN "statut",
ADD COLUMN     "statut" "StatutMoto" NOT NULL DEFAULT 'EN_STOCK';

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "role" "RoleUtilisateur" NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "adresse" TEXT,
    "profession" TEXT,
    "numeroPiece" TEXT,
    "typePiece" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marque" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Marque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vente" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "motoId" INTEGER NOT NULL,
    "type" "TypeVente" NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "acompte" DOUBLE PRECISION,
    "reste" DOUBLE PRECISION,
    "statut" "StatutVente" NOT NULL DEFAULT 'EN_COURS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_telephone_key" ON "Utilisateur"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_telephone_key" ON "Client"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "Marque_nom_key" ON "Marque"("nom");

-- AddForeignKey
ALTER TABLE "Moto" ADD CONSTRAINT "Moto_marqueId_fkey" FOREIGN KEY ("marqueId") REFERENCES "Marque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vente" ADD CONSTRAINT "Vente_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vente" ADD CONSTRAINT "Vente_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vente" ADD CONSTRAINT "Vente_motoId_fkey" FOREIGN KEY ("motoId") REFERENCES "Moto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

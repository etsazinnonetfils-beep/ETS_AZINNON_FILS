-- Safe additive alignment migration for the current Prisma sales/auth contract.
-- This migration preserves existing data and only adds missing columns,
-- enums, indexes and the sales payment table needed by the stable backend.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'RoleUtilisateur' AND e.enumlabel = 'SUPER_ADMIN'
  ) THEN
    ALTER TYPE "RoleUtilisateur" ADD VALUE 'SUPER_ADMIN';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'RoleUtilisateur' AND e.enumlabel = 'GESTIONNAIRE'
  ) THEN
    ALTER TYPE "RoleUtilisateur" ADD VALUE 'GESTIONNAIRE';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'RoleUtilisateur' AND e.enumlabel = 'COMMERCIAL'
  ) THEN
    ALTER TYPE "RoleUtilisateur" ADD VALUE 'COMMERCIAL';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'RoleUtilisateur' AND e.enumlabel = 'LECTURE_SEULE'
  ) THEN
    ALTER TYPE "RoleUtilisateur" ADD VALUE 'LECTURE_SEULE';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'StatutUtilisateur'
  ) THEN
    CREATE TYPE "StatutUtilisateur" AS ENUM ('ACTIF', 'INACTIF', 'SUSPENDU', 'SUPPRIME');
  END IF;
END $$;

ALTER TABLE "Utilisateur"
  ADD COLUMN IF NOT EXISTS "username" TEXT,
  ADD COLUMN IF NOT EXISTS "statut" "StatutUtilisateur" NOT NULL DEFAULT 'ACTIF',
  ADD COLUMN IF NOT EXISTS "dernierLogin" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "refreshToken" TEXT,
  ADD COLUMN IF NOT EXISTS "passwordResetToken" TEXT,
  ADD COLUMN IF NOT EXISTS "passwordResetExpires" TIMESTAMP(3);

CREATE UNIQUE INDEX IF NOT EXISTS "Utilisateur_username_key"
  ON "Utilisateur"("username");

ALTER TABLE "Client"
  ADD COLUMN IF NOT EXISTS "photo" TEXT,
  ADD COLUMN IF NOT EXISTS "pieceIdentite" TEXT,
  ADD COLUMN IF NOT EXISTS "email" TEXT,
  ADD COLUMN IF NOT EXISTS "solde" DOUBLE PRECISION NOT NULL DEFAULT 0;

UPDATE "Client"
SET "pieceIdentite" = "numeroPiece"
WHERE "pieceIdentite" IS NULL AND "numeroPiece" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "Client_email_key"
  ON "Client"("email");

ALTER TABLE "Moto"
  ADD COLUMN IF NOT EXISTS "reference" TEXT,
  ADD COLUMN IF NOT EXISTS "sku" TEXT,
  ADD COLUMN IF NOT EXISTS "codeBarres" TEXT,
  ADD COLUMN IF NOT EXISTS "garantie" TEXT,
  ADD COLUMN IF NOT EXISTS "photo" TEXT,
  ADD COLUMN IF NOT EXISTS "observations" TEXT,
  ADD COLUMN IF NOT EXISTS "immatriculation" TEXT,
  ADD COLUMN IF NOT EXISTS "fournisseurId" INTEGER,
  ADD COLUMN IF NOT EXISTS "dateAchat" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "disponible" BOOLEAN NOT NULL DEFAULT true;

CREATE UNIQUE INDEX IF NOT EXISTS "Moto_reference_key"
  ON "Moto"("reference");

CREATE UNIQUE INDEX IF NOT EXISTS "Moto_sku_key"
  ON "Moto"("sku");

CREATE UNIQUE INDEX IF NOT EXISTS "Moto_codeBarres_key"
  ON "Moto"("codeBarres");

CREATE UNIQUE INDEX IF NOT EXISTS "Moto_immatriculation_key"
  ON "Moto"("immatriculation");

ALTER TABLE "Vente"
  ADD COLUMN IF NOT EXISTS "dateVente" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS "Paiement" (
  "id" SERIAL NOT NULL,
  "venteId" INTEGER,
  "clientId" INTEGER,
  "utilisateurId" INTEGER NOT NULL,
  "type" TEXT NOT NULL,
  "montant" DOUBLE PRECISION NOT NULL,
  "datePaiement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "mode" TEXT NOT NULL,
  "commentaire" TEXT,
  CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Paiement"
  ADD CONSTRAINT "Paiement_venteId_fkey"
  FOREIGN KEY ("venteId") REFERENCES "Vente"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Paiement"
  ADD CONSTRAINT "Paiement_clientId_fkey"
  FOREIGN KEY ("clientId") REFERENCES "Client"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Paiement"
  ADD CONSTRAINT "Paiement_utilisateurId_fkey"
  FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

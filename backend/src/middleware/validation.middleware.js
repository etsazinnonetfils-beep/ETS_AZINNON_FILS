const { z } = require("zod");

const motoSchema = z.object({
  sku: z.string().min(3),
  codeBarres: z.string().min(3),
  marqueId: z.number(),
  type: z.string().min(1),
  modele: z.string().min(1),
  couleur: z.string().min(1),
  annee: z.number().int().optional(),
  numeroChassis: z.string().min(1),
  numeroMoteur: z.string().min(1),
  immatriculation: z.string().optional(),
  fournisseurId: z.number().optional(),
  dateAchat: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Date d'achat invalide",
  }),
  prixAchat: z.number().nonnegative(),
  prixVente: z.number().nonnegative(),
  garantie: z.string().optional(),
  photo: z.string().optional(),
  statut: z.enum(["EN_STOCK", "RESERVEE", "VENDUE"]).default("EN_STOCK"),
  observations: z.string().optional(),
});

const clientSchema = z.object({
  nom: z.string().min(1),
  prenom: z.string().min(1),
  telephone: z.string().min(8),
  adresse: z.string().optional(),
  profession: z.string().optional(),
  photo: z.string().optional(),
  pieceIdentite: z.string().optional(),
  email: z.string().email().optional(),
  solde: z.number().optional(),
});

const paiementSchema = z.object({
  mode: z.enum(["ESPECES", "VIREMENT", "MOBILE_MONEY"]),
  montant: z.number().nonnegative(),
  commentaire: z.string().optional(),
});

const venteSchema = z.object({
  utilisateurId: z.number(),
  motoId: z.number(),
  type: z.enum(["COMPTANT", "CREDIT"]),
  montant: z.number().positive(),
  acompte: z.number().nonnegative().optional(),
  clientId: z.number().optional(),
  client: z.object({
    nom: z.string().min(1),
    prenom: z.string().min(1),
    telephone: z.string().min(8),
    adresse: z.string().optional(),
    profession: z.string().optional(),
    photo: z.string().optional(),
    pieceIdentite: z.string().optional(),
    email: z.string().email().optional(),
  }).optional(),
  paiement: paiementSchema,
});

const motoUpdateSchema = motoSchema.partial().extend({
  reference: z.string().min(1).optional(),
  statut: z.enum(["EN_STOCK", "RESERVEE", "VENDUE"]).optional(),
});

const motoQuerySchema = z.object({
  page: z.preprocess((val) => (val === undefined ? undefined : Number(val)), z.number().int().positive().optional()),
  limit: z.preprocess((val) => (val === undefined ? undefined : Number(val)), z.number().int().positive().optional()),
  search: z.string().optional(),
  marque: z.string().optional(),
  statut: z.enum(["EN_STOCK", "RESERVEE", "VENDUE"]).optional(),
  sortBy: z.enum(["createdAt", "prixAchat", "prixVente", "modele", "couleur", "reference"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

const userRoleSchema = z.enum([
  "SUPER_ADMIN",
  "ADMIN",
  "GESTIONNAIRE",
  "MAGASINIER",
  "CAISSIER",
  "COMPTABLE",
  "COMMERCIAL",
  "LECTURE_SEULE",
]);

const userCreateSchema = z.object({
  nom: z.string().min(1),
  prenom: z.string().min(1),
  username: z.string().min(3).optional(),
  telephone: z.string().min(8),
  email: z.string().email(),
  motDePasse: z.string().min(8),
  role: userRoleSchema,
  actif: z.boolean().optional(),
  statut: z.enum(["ACTIF", "INACTIF", "SUSPENDU", "SUPPRIME"]).optional(),
});

const userUpdateSchema = userCreateSchema.partial().extend({ motDePasse: z.string().min(8).optional() });

const loginSchema = z.object({
  identifier: z.string().min(1),
  motDePasse: z.string().min(8),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

const forgotPasswordSchema = z.object({
  identifier: z.string().min(1),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

const validateBody = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse({
      ...req.body,
      marqueId: req.body.marqueId !== undefined ? Number(req.body.marqueId) : undefined,
      fournisseurId: req.body.fournisseurId !== undefined ? Number(req.body.fournisseurId) : undefined,
      prixAchat: req.body.prixAchat !== undefined ? Number(req.body.prixAchat) : undefined,
      prixVente: req.body.prixVente !== undefined ? Number(req.body.prixVente) : undefined,
      annee: req.body.annee !== undefined ? Number(req.body.annee) : undefined,
      solde: req.body.solde !== undefined ? Number(req.body.solde) : undefined,
    });
    req.body = validated;
    return next();
  } catch (error) {
    return res.status(400).json({ message: error.errors?.[0]?.message || "Données invalides" });
  }
};

const validateQuery = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse(req.query);
    req.query = validated;
    return next();
  } catch (error) {
    return res.status(400).json({ message: error.errors?.[0]?.message || "Paramètres de requête invalides" });
  }
};

module.exports = {
  motoSchema,
  motoUpdateSchema,
  motoQuerySchema,
  clientSchema,
  paiementSchema,
  venteSchema,
  userCreateSchema,
  userUpdateSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  validateBody,
  validateQuery,
};

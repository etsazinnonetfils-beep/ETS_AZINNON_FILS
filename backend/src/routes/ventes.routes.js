const express = require("express");
const { listerVentes, obtenirVente, creerVente } = require("../controllers/ventes.controller");
const { validateBody, venteSchema } = require("../middleware/validation.middleware");
const { authenticate, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", listerVentes);
router.get("/:id", obtenirVente);
// Protect creation of ventes: authenticated users with appropriate roles only
router.post(
	"/",
	validateBody(venteSchema),
	authenticate,
	authorizeRoles("SUPER_ADMIN", "ADMIN", "GESTIONNAIRE", "CAISSIER", "COMMERCIAL"),
	creerVente
);

module.exports = router;

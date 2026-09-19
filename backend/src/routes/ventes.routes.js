const express = require("express");
const { listerVentes, obtenirVente, creerVente } = require("../controllers/ventes.controller");
const { validateBody, venteSchema } = require("../middleware/validation.middleware");
const { authenticate, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authenticate, authorizeRoles("SUPER_ADMIN", "ADMIN", "GESTIONNAIRE", "CAISSIER", "COMMERCIAL"), listerVentes);
router.get("/:id", authenticate, authorizeRoles("SUPER_ADMIN", "ADMIN", "GESTIONNAIRE", "CAISSIER", "COMMERCIAL"), obtenirVente);
// Protect creation of ventes: authenticated users with appropriate roles only
router.post(
	"/",
	validateBody(venteSchema),
	authenticate,
	authorizeRoles("SUPER_ADMIN", "ADMIN", "GESTIONNAIRE", "CAISSIER", "COMMERCIAL"),
	creerVente
);

module.exports = router;

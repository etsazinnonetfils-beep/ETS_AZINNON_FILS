const express = require("express");
const { listerVentes, obtenirVente, creerVente } = require("../controllers/ventes.controller");
const { validateBody, venteSchema } = require("../middleware/validation.middleware");

const router = express.Router();

router.get("/", listerVentes);
router.get("/:id", obtenirVente);
router.post("/", validateBody(venteSchema), creerVente);

module.exports = router;

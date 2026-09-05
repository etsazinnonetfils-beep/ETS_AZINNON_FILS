const express = require("express");
const {
  listerMotos,
  obtenirMoto,
  creerMoto,
  modifierMoto,
  supprimerMoto,
} = require("../controllers/motos.controller");
const {
  validateBody,
  validateQuery,
  motoSchema,
  motoUpdateSchema,
  motoQuerySchema,
} = require("../middleware/validation.middleware");

const router = express.Router();

router.get("/", validateQuery(motoQuerySchema), listerMotos);
router.get("/:id", obtenirMoto);
router.post("/", validateBody(motoSchema), creerMoto);
router.put("/:id", validateBody(motoUpdateSchema), modifierMoto);
router.delete("/:id", supprimerMoto);

module.exports = router;

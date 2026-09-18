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
const { authenticate, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", validateQuery(motoQuerySchema), listerMotos);
router.get("/:id", obtenirMoto);
// Protect stock modifications: only authorized roles can create/update/delete
router.post("/", authenticate, authorizeRoles("SUPER_ADMIN", "ADMIN", "GESTIONNAIRE", "MAGASINIER"), validateBody(motoSchema), creerMoto);
router.put("/:id", authenticate, authorizeRoles("SUPER_ADMIN", "ADMIN", "GESTIONNAIRE", "MAGASINIER"), validateBody(motoUpdateSchema), modifierMoto);
router.delete("/:id", authenticate, authorizeRoles("SUPER_ADMIN", "ADMIN", "GESTIONNAIRE", "MAGASINIER"), supprimerMoto);

module.exports = router;

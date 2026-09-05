const express = require("express");
const {
  listerUtilisateurs,
  obtenirUtilisateur,
  creerUtilisateur,
  modifierUtilisateur,
  desactiverUtilisateur,
  reactiverUtilisateur,
  supprimerUtilisateur,
} = require("../controllers/utilisateurs.controller");
const { validateBody, userCreateSchema, userUpdateSchema } = require("../middleware/validation.middleware");
const { authenticate, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);
router.get("/", authorizeRoles("SUPER_ADMIN", "ADMIN", "GESTIONNAIRE", "LECTURE_SEULE"), listerUtilisateurs);
router.get("/:id", authorizeRoles("SUPER_ADMIN", "ADMIN", "GESTIONNAIRE", "LECTURE_SEULE"), obtenirUtilisateur);
router.post("/", authorizeRoles("SUPER_ADMIN", "ADMIN"), validateBody(userCreateSchema), creerUtilisateur);
router.put("/:id", authorizeRoles("SUPER_ADMIN", "ADMIN"), validateBody(userUpdateSchema), modifierUtilisateur);
router.patch("/:id/desactiver", authorizeRoles("SUPER_ADMIN", "ADMIN"), desactiverUtilisateur);
router.patch("/:id/reactiver", authorizeRoles("SUPER_ADMIN", "ADMIN"), reactiverUtilisateur);
router.delete("/:id", authorizeRoles("SUPER_ADMIN", "ADMIN"), supprimerUtilisateur);

module.exports = router;

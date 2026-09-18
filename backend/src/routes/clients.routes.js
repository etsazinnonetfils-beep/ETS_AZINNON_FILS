const express = require("express");
const {
  listerClients,
  obtenirClient,
  creerClient,
  modifierClient,
  supprimerClient,
} = require("../controllers/clients.controller");
const { clientSchema, validateBody } = require("../middleware/validation.middleware");
const { authenticate, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

// middleware: prevent unauthorized modification of `solde`
const stripSoldeUnlessAuthorized = (allowedRoles = []) => (req, res, next) => {
  if (req.body && Object.prototype.hasOwnProperty.call(req.body, "solde")) {
    const userRole = req.user && req.user.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      delete req.body.solde;
    }
  }
  return next();
};

router.get("/", listerClients);
router.get("/:id", obtenirClient);
// Protect create/update/delete: only authenticated users with roles can perform these actions
// Allow roles to create/update clients, but only specific roles may set `solde`
router.post(
  "/",
  authenticate,
  authorizeRoles("SUPER_ADMIN", "ADMIN", "GESTIONNAIRE"),
  stripSoldeUnlessAuthorized(["SUPER_ADMIN", "ADMIN", "COMPTABLE"]),
  validateBody(clientSchema),
  creerClient
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("SUPER_ADMIN", "ADMIN", "GESTIONNAIRE"),
  stripSoldeUnlessAuthorized(["SUPER_ADMIN", "ADMIN", "COMPTABLE"]),
  validateBody(clientSchema),
  modifierClient
);
router.delete("/:id", authenticate, authorizeRoles("SUPER_ADMIN", "ADMIN", "GESTIONNAIRE"), supprimerClient);

module.exports = router;

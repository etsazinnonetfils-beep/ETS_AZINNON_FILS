const express = require("express");
const {
  listerClients,
  obtenirClient,
  creerClient,
  modifierClient,
  supprimerClient,
} = require("../controllers/clients.controller");
const { clientSchema, validateBody } = require("../middleware/validation.middleware");

const router = express.Router();

router.get("/", listerClients);
router.get("/:id", obtenirClient);
router.post("/", validateBody(clientSchema), creerClient);
router.put("/:id", validateBody(clientSchema), modifierClient);
router.delete("/:id", supprimerClient);

module.exports = router;

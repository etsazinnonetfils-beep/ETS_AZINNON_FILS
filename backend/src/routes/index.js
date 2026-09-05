const express = require("express");
const motosRoutes = require("./motos.routes");
const clientsRoutes = require("./clients.routes");
const ventesRoutes = require("./ventes.routes");
const authRoutes = require("./auth.routes");
const utilisateursRoutes = require("./utilisateurs.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/utilisateurs", utilisateursRoutes);
router.use("/motos", motosRoutes);
router.use("/clients", clientsRoutes);
router.use("/ventes", ventesRoutes);

module.exports = router;

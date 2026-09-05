const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const apiRoutes = require("./routes");
const notFound = require("./middleware/notFound.middleware");
const errorHandler = require("./middleware/error.middleware");

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "ETS AZINNON & FILS API",
    version: "1.0.0",
    description: "API REST pour la gestion d'entreprise ETS AZINNON & FILS",
  },
  servers: [{ url: process.env.API_URL || "http://localhost:3000/api" }],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("Service ETS AZINNON & FILS en ligne.");
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;

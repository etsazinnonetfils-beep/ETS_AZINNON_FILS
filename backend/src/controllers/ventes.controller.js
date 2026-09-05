const venteService = require("../services/ventes.service");

const formatError = (error) => {
  console.error(error);
  return {
    status: error.status || 500,
    body: { message: error.message || "Erreur interne du serveur" },
  };
};

exports.listerVentes = async (req, res) => {
  try {
    const ventes = await venteService.listVentes();
    return res.status(200).json(ventes);
  } catch (error) {
    const response = formatError(error);
    return res.status(response.status).json(response.body);
  }
};

exports.obtenirVente = async (req, res) => {
  try {
    const vente = await venteService.getVenteById(Number(req.params.id));
    if (!vente) {
      return res.status(404).json({ message: "Vente introuvable" });
    }
    return res.status(200).json(vente);
  } catch (error) {
    const response = formatError(error);
    return res.status(response.status).json(response.body);
  }
};

exports.creerVente = async (req, res) => {
  try {
    const vente = await venteService.createVente(req.body);
    return res.status(201).json(vente);
  } catch (error) {
    const response = formatError(error);
    return res.status(response.status).json(response.body);
  }
};

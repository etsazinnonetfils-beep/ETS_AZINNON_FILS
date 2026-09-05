const motoService = require("../services/motos.service");

const formatError = (error) => {
  console.error(error);
  return {
    status: error.status || 500,
    body: { message: error.message || "Erreur interne du serveur" },
  };
};

exports.listerMotos = async (req, res) => {
  try {
    const result = await motoService.listMotos(req.query);
    return res.status(200).json(result);
  } catch (error) {
    const response = formatError(error);
    return res.status(response.status).json(response.body);
  }
};

exports.obtenirMoto = async (req, res) => {
  try {
    const moto = await motoService.getMotoById(Number(req.params.id));
    if (!moto) {
      return res.status(404).json({ message: "Moto introuvable" });
    }
    return res.status(200).json(moto);
  } catch (error) {
    const response = formatError(error);
    return res.status(response.status).json(response.body);
  }
};

exports.creerMoto = async (req, res) => {
  try {
    const moto = await motoService.createMoto(req.body);
    return res.status(201).json(moto);
  } catch (error) {
    const response = formatError(error);
    return res.status(response.status).json(response.body);
  }
};

exports.modifierMoto = async (req, res) => {
  try {
    const moto = await motoService.updateMoto(Number(req.params.id), req.body);
    return res.status(200).json(moto);
  } catch (error) {
    const response = formatError(error);
    return res.status(response.status).json(response.body);
  }
};

exports.supprimerMoto = async (req, res) => {
  try {
    await motoService.deleteMoto(Number(req.params.id));
    return res.status(200).json({ message: "Moto supprimée avec succès" });
  } catch (error) {
    const response = formatError(error);
    return res.status(response.status).json(response.body);
  }
};

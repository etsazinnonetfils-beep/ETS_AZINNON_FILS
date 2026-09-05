const utilisateurService = require("../services/utilisateurs.service");

const formatError = (error) => {
  console.error(error);
  return { status: error.status || 500, body: { message: error.message || "Erreur interne du serveur" } };
};

exports.listerUtilisateurs = async (req, res) => {
  try {
    const { page, limit, search, role, statut, actif } = req.query;
    const result = await utilisateurService.listUsers({ page, limit, search, role, statut, actif });
    return res.status(200).json(result);
  } catch (error) {
    const response = formatError(error);
    return res.status(response.status).json(response.body);
  }
};

exports.obtenirUtilisateur = async (req, res) => {
  try {
    const utilisateur = await utilisateurService.getUserById(Number(req.params.id));
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    return res.status(200).json(utilisateur);
  } catch (error) {
    const response = formatError(error);
    return res.status(response.status).json(response.body);
  }
};

exports.creerUtilisateur = async (req, res) => {
  try {
    const utilisateur = await utilisateurService.createUser(req.body);
    return res.status(201).json(utilisateur);
  } catch (error) {
    const response = formatError(error);
    return res.status(response.status).json(response.body);
  }
};

exports.modifierUtilisateur = async (req, res) => {
  try {
    const utilisateur = await utilisateurService.updateUser(Number(req.params.id), req.body);
    return res.status(200).json(utilisateur);
  } catch (error) {
    const response = formatError(error);
    return res.status(response.status).json(response.body);
  }
};

exports.desactiverUtilisateur = async (req, res) => {
  try {
    const utilisateur = await utilisateurService.deactivateUser(Number(req.params.id));
    return res.status(200).json(utilisateur);
  } catch (error) {
    const response = formatError(error);
    return res.status(response.status).json(response.body);
  }
};

exports.reactiverUtilisateur = async (req, res) => {
  try {
    const utilisateur = await utilisateurService.reactivateUser(Number(req.params.id));
    return res.status(200).json(utilisateur);
  } catch (error) {
    const response = formatError(error);
    return res.status(response.status).json(response.body);
  }
};

exports.supprimerUtilisateur = async (req, res) => {
  try {
    await utilisateurService.softDeleteUser(Number(req.params.id));
    return res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    const response = formatError(error);
    return res.status(response.status).json(response.body);
  }
};

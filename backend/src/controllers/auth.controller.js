const authService = require("../services/auth.service");

exports.login = async (req, res) => {
  try {
    const { identifier, motDePasse } = req.body;
    const { accessToken, refreshToken, utilisateur } = await authService.login(identifier, motDePasse);
    return res.status(200).json({ accessToken, refreshToken, utilisateur });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message || "Erreur interne du serveur" });
  }
};

exports.logout = async (req, res) => {
  try {
    await authService.logout(req.user.userId);
    return res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message || "Erreur interne du serveur" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    await authService.changePassword(req.user.userId, req.body.currentPassword, req.body.newPassword);
    return res.status(200).json({ message: "Mot de passe modifié avec succès" });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message || "Erreur interne du serveur" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    await authService.forgotPassword(req.body.identifier);
    return res.status(200).json({ message: "Si cet utilisateur existe, un lien de réinitialisation a été envoyé." });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message || "Erreur interne du serveur" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(req.body.token, req.body.newPassword);
    return res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message || "Erreur interne du serveur" });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { accessToken, refreshToken } = await authService.refreshToken(req.body.refreshToken);
    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({ message: error.message || "Erreur interne du serveur" });
  }
};

const clientService = require("../services/clients.service");

const formatError = (error) => {
  console.error(error);
  return {
    status: 500,
    body: { message: "Erreur interne du serveur" },
  };
};

exports.listerClients = async (req, res) => {
  try {
    const clients = await clientService.getAllClients();
    return res.status(200).json(clients);
  } catch (error) {
    const response = formatError(error);
    return res.status(response.status).json(response.body);
  }
};

exports.obtenirClient = async (req, res) => {
  try {
    const client = await clientService.getClientById(Number(req.params.id));
    if (!client) {
      return res.status(404).json({ message: "Client introuvable" });
    }
    return res.status(200).json(client);
  } catch (error) {
    const response = formatError(error);
    return res.status(response.status).json(response.body);
  }
};

exports.creerClient = async (req, res) => {
  try {
    const data = {
      ...req.body,
      solde: req.body.solde !== undefined ? Number(req.body.solde) : undefined,
    };
    const client = await clientService.createClient(data);
    return res.status(201).json(client);
  } catch (error) {
    const response = formatError(error);
    return res.status(response.status).json(response.body);
  }
};

exports.modifierClient = async (req, res) => {
  try {
    const client = await clientService.updateClient(Number(req.params.id), {
      ...req.body,
      solde: req.body.solde !== undefined ? Number(req.body.solde) : undefined,
    });
    return res.status(200).json(client);
  } catch (error) {
    const response = formatError(error);
    return res.status(response.status).json(response.body);
  }
};

exports.supprimerClient = async (req, res) => {
  try {
    await clientService.deleteClient(Number(req.params.id));
    return res.status(200).json({ message: "Client supprimé avec succès" });
  } catch (error) {
    const response = formatError(error);
    return res.status(response.status).json(response.body);
  }
};

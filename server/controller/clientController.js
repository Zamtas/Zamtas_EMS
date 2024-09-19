const Client = require('../models/clientModel');

// Add client
async function addClientController(req, res) {
    try {
        const newClient = new Client(req.body);
        await newClient.save();
        res.status(201).json({
            message: "Client added successfully",
            data: newClient,
            success: true,
            error: false
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || 'Server Error',
            error: true,
            success: false
        });
    }
}

// Get all clients
async function getClientsController(req, res) {
    try {
        const clients = await Client.find({}, 'clientName clientContact clientAddress clientEmail clientContactPerson');
        res.status(200).json({
            message: "Clients fetched successfully",
            data: clients,
            success: true,
            error: false
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || 'Server Error',
            error: true,
            success: false
        });
    }
}

// Get a single client by ID
async function getClientByIdController(req, res) {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: "Client not found", error: true, success: false });
        }
        res.status(200).json({ data: client, success: true, error: false });
    } catch (err) {
        res.status(500).json({ message: err.message || 'Server Error', error: true, success: false });
    }
}

// Update client
async function updateClientController(req, res) {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!client) {
            return res.status(404).json({ message: "Client not found", error: true, success: false });
        }
        res.status(200).json({ message: "Client updated successfully", data: client, success: true, error: false });
    } catch (err) {
        res.status(500).json({ message: err.message || 'Server Error', error: true, success: false });
    }
}

module.exports = {
    addClientController,
    getClientsController,
    getClientByIdController,
    updateClientController
};

const mongoose = require('mongoose');

const projectManagerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String, required: true }
});

module.exports = mongoose.model('ProjectManager', projectManagerSchema);

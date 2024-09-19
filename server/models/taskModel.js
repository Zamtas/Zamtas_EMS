const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    projectManager: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectManager', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    endTime: { type: String, required: true }, // Time in 'HH:mm' format (24-hour) for the task deadline
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    teamLead: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Assigned', 'Delayed', 'Done', 'In Progress'], default: 'Assigned' },
    startImage: { type: String },
    completeImage: { type: String }
});

module.exports = mongoose.model('Task', taskSchema);
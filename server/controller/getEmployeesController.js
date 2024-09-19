const userModel = require('../models/userModel');

async function getEmployeesController(req, res) {
    try {
        const employees = await userModel.find({}, 'name email designation department role');
        res.status(200).json({
            message: "Employees fetched successfully",
            data: employees,
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

module.exports = getEmployeesController;

const userModel = require('../models/userModel');

async function deleteEmployeeController(req, res) {
    const { id } = req.params;

    try {
        const employee = await userModel.findByIdAndDelete(id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found",
                error: true,
                success: false
            });
        }

        res.status(200).json({
            message: "Employee deleted successfully",
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

async function getUserDetailsController(req, res) {
    const { id } = req.params;

    try {
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        res.status(200).json({
            message: "User details fetched successfully",
            success: true,
            error: false,
            data: user
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || 'Server Error',
            error: true,
            success: false
        });
    }
}

async function updateRoleController(req, res) {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const employee = await userModel.findByIdAndUpdate(id, { role }, { new: true });

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found",
                error: true,
                success: false
            });
        }

        res.status(200).json({
            message: "Role updated successfully",
            success: true,
            error: false,
            data: employee
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || 'Server Error',
            error: true,
            success: false
        });
    }
}

async function updateUserDetailsController(req, res) {
    const { id } = req.params;
    const updateData = req.body;

    // Log incoming request data
    console.log('Incoming update data:', updateData);

    try {
        // Handle file upload
        if (req.file) {
            updateData.profilePicture = req.file.path;
        }

        // Find the user by ID and update only the fields provided
        const user = await userModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        res.status(200).json({
            message: "User details updated successfully",
            success: true,
            error: false,
            data: user
        });
    } catch (err) {
        console.error('Error updating user details:', err);
        res.status(500).json({
            message: err.message || 'Server Error',
            error: true,
            success: false
        });
    }
}


module.exports = {
    deleteEmployeeController,
    updateRoleController,
    getUserDetailsController,
    updateUserDetailsController
};


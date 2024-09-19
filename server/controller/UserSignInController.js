const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

async function userSignInController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password', success: false, error: true });
        }

        // Use lean() to optimize the user query
        const user = await userModel.findOne({ email }).lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false, error: true });
        }

        // Optimize bcrypt password check
        const checkPassword = await bcrypt.compare(password, user.password);

        if (checkPassword) {
            const tokenData = {
                _id: user._id,
                email: user.email,
                role: user.role,
            };

            // Generate JWT
            const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: '8h' });

            const tokenOption = {
                httpOnly: true,
                sameSite: 'None'
            };

            res.cookie("token", token, tokenOption).status(200).json({
                message: 'Login successful',
                data: {
                    token,
                    role: user.role,
                },
                success: true,
                error: false
            });
        } else {
            return res.status(400).json({ message: 'Invalid credentials', success: false, error: true });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: err.message || 'Server error',
            success: false,
            error: true,
        });
    }
}

module.exports = userSignInController;

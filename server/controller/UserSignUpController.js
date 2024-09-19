const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer');

// Validation functions
const validation = {
    password: (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password),
    alphabetic: (value) => /^[a-zA-Z\s]+$/.test(value),
    numeric: (value) => /^\d+$/.test(value),
    email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    alphanumeric: (value) => /^[a-zA-Z0-9\s]+$/.test(value),
};

async function userSignUpController(req, res) {
    // Use multer middleware for file upload
    upload.single('profilePicture')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message, error: true, success: false });
        }

        try {
            const { email, password, name, designation, department, dob, mobileNo, address, cnic } = req.body;
            const profilePicture = req.file ? req.file.path : undefined;

            // Validate input
            const validations = [
                [!email || !password || !name || !designation || !department, "Missing required fields!"],
                [!validation.email(email), "Invalid email format."],
                [!validation.password(password), "Password must be at least 8 characters long, including one uppercase letter, one lowercase letter, one number, and one special character."],
                [!validation.alphabetic(name) || !validation.alphabetic(designation) || !validation.alphabetic(department), "Name, designation, and department should contain only alphabetic characters."],
                [mobileNo && !validation.numeric(mobileNo), "Mobile number should contain only numeric characters."],
                [cnic && !validation.numeric(cnic), "CNIC should contain only numeric characters."],
                [address && !validation.alphanumeric(address), "Address should contain only alphanumeric characters."]
            ];

            for (const [condition, errorMessage] of validations) {
                if (condition) {
                    return res.status(400).json({ message: errorMessage, error: true, success: false });
                }
            }

            // Check if the user already exists
            const userExists = await userModel.exists({ email });
            if (userExists) {
                return res.status(400).json({ message: "User already exists with this email.", error: true, success: false });
            }

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            // Create user payload
            const payload = {
                email,
                password: hashPassword,
                name,
                designation,
                department,
                dob: dob ? new Date(dob) : undefined,
                mobileNo,
                address,
                cnic,
                role: "GENERAL",
                profilePicture,
            };

            // Save the new user
            const newUser = new userModel(payload);
            const savedUser = await newUser.save();

            res.status(201).json({
                data: savedUser,
                success: true,
                error: false,
                message: "User created successfully!",
            });
        } catch (err) {
            res.status(500).json({
                message: err.message || "An error occurred.",
                error: true,
                success: false,
            });
        }
    });
}

module.exports = userSignUpController;

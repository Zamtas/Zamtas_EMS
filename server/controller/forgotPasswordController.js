const userModel = require('../models/userModel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

async function sendForgotPasswordOTP(req, res) {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found!", error: true, success: false });
        }

        // Generate OTP and expiration time
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = otpExpiry;
        await user.save();

        // Configure nodemailer
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // or another email service
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send OTP email
        await transporter.sendMail({
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Your Password Reset OTP',
            text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
        });

        res.status(200).json({ message: "OTP sent to your email.", success: true, error: false });

    } catch (error) {
        res.status(500).json({ message: error.message, error: true, success: false });
    }
}

async function verifyOTP(req, res) {
    try {
        const { email, otp } = req.body;

        const user = await userModel.findOne({ email });
        if (!user || user.resetPasswordOTP !== otp || Date.now() > user.resetPasswordExpires) {
            return res.status(400).json({ message: "Invalid or expired OTP.", error: true, success: false });
        }

        // OTP is valid
        res.status(200).json({ message: "OTP verified successfully.", success: true, error: false });

    } catch (error) {
        res.status(500).json({ message: error.message, error: true, success: false });
    }
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

async function resetPassword(req, res) {
    try {
        const { email, newPassword } = req.body;

        // Validate password
        if (!validatePassword(newPassword)) {
            return res.status(400).json({ message: "Password must be at least 8 characters long, including one uppercase letter, one lowercase letter, one number, and one special character.", error: true, success: false });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found!", error: true, success: false });
        }

        // Hash the new password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(newPassword, salt);

        user.password = hashPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Send confirmation email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset Successful',
            text: 'Your password has been successfully reset. Now you can log in with your new password!',
        });

        res.status(200).json({ message: "Password reset successfully.", success: true, error: false });

    } catch (error) {
        res.status(500).json({ message: error.message, error: true, success: false });
    }
}


module.exports = { sendForgotPasswordOTP, verifyOTP, resetPassword };


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: false
    },
    mobileNo: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    cnic: {
        type: String,
        required: false
    },
    profilePicture: {
        type: String,
        required: false
    },
    resetPasswordOTP: {
        type: String,
        required: false
    },
    resetPasswordExpires: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;

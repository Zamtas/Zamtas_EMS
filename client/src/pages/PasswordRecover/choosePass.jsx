import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Api from '../../common';
import { AiOutlineLock } from 'react-icons/ai';
import { FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';

const ChoosePass = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const emailFromLocation = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(Api.resetPass.url, { email: emailFromLocation, newPassword });
            if (response.data.error) {
                setMessage(response.data.message);
            } else {
                setMessage(response.data.message);
                navigate('/');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage(error.response.data.message || "An error occurred while resetting the password. Please try again.");
            } else {
                setMessage("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full transform transition-all duration-300 hover:scale-105">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center sm:text-xl">Reset Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4 relative">
                    <div className="relative flex items-center border-b border-gray-300 py-2">
                        <AiOutlineLock className="text-gray-500 mr-3 text-xl sm:text-lg" />
                        <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                            className="w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none sm:text-base text-sm"
                        />
                        <div
                            className="absolute inset-y-0 right-0 top-1/2 transform -translate-y-1/2 pr-3 flex items-center cursor-pointer"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <FaEye size={24} className="text-gray-600" /> : <FaEyeSlash size={24} className="text-gray-600" />}
                        </div>
                    </div>
                    <div className="relative flex items-center border-b border-gray-300 py-2">
                        <FaKey className="text-gray-500 mr-3 text-xl sm:text-lg" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            required
                            className="w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none sm:text-base text-sm"
                        />
                        <div
                            className="absolute inset-y-0 right-0 top-1/2 transform -translate-y-1/2 pr-3 flex items-center cursor-pointer"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEye size={24} className="text-gray-600" /> : <FaEyeSlash size={24} className="text-gray-600" />}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="flex items-center justify-center w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 sm:text-base text-sm"
                    >
                        <FaKey className="mr-2" /> Reset Password
                    </button>
                </form>
                {loading && <div className="spinner mt-4"></div>}
                {message && <p className="mt-4 text-red-500 text-center text-sm sm:text-base">{message}</p>}
            </div>
        </div>

    );
};

export default ChoosePass;

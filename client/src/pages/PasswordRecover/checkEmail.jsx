import { useState } from 'react';
import axios from 'axios';
import Api from '../../common';
import { AiOutlineLock } from 'react-icons/ai';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const CheckEmail = () => {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setMessage("Email is missing. Please try again.");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(Api.verifyOTP.url, { email, otp });
            setMessage(response.data.message);
            navigate('/choose-password', { state: { email } }); // Pass email to next page
        } catch (error) {
            setMessage(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full transform transition-all duration-300 hover:scale-105">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center sm:text-xl">Enter OTP</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center border-b border-gray-300 py-2">
                        <AiOutlineLock className="text-gray-500 mr-3 text-xl sm:text-lg" />
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            required
                            className="w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none sm:text-base text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="flex items-center justify-center w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 sm:text-base text-sm"
                    >
                        <FaCheckCircle className="mr-2" /> Verify OTP
                    </button>
                </form>
                {loading && <div className="spinner mt-4"></div>}
                {message && <p className="mt-4 text-red-500 text-center text-sm sm:text-base">{message}</p>}
            </div>
        </div>

    );
};

export default CheckEmail;

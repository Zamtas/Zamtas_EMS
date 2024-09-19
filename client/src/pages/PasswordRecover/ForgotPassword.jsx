import { useState } from 'react';
import axios from 'axios';
import Api from '../../common';
import { AiOutlineMail } from 'react-icons/ai';
import { FaPaperPlane } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(Api.forgotPass.url, { email });
            setMessage(response.data.message);
            navigate('/check-email', { state: { email } });
        } catch (error) {
            setMessage(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full transform transition-all duration-300 hover:scale-105">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Forgot Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center border-b border-gray-300 py-2">
                        <AiOutlineMail className="text-gray-500 mr-3 text-xl" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none sm:text-base text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="flex items-center justify-center w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 sm:text-base text-sm"
                    >
                        <FaPaperPlane className="mr-2" /> Send OTP
                    </button>
                </form>
                {loading && <div className="spinner mt-4"></div>}
                {message && <p className="mt-4 text-red-500 text-center text-sm sm:text-base">{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Api from '../common/index';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(Api.signIn.url, { email, password }, { withCredentials: true });
            if (response.data.success) {
                const { token, role } = response.data.data;
                localStorage.setItem('token', token);  // Save token to localStorage
                if (role === 'ADMIN') {
                    navigate('/home');
                } else {
                    navigate('/user-home');
                }
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Something went wrong');
        }
    };



    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-6 sm:py-12">
            <div className="text-center mb-8 px-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-blue-700">Welcome to Zamtas-EMS</h1>
                <p className="text-lg sm:text-2xl text-gray-900 mt-2">&quot;Empowering Your Success&quot;</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl sm:text-3xl font-semibold text-center text-blue-600 mb-6">Sign In</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                        <div
                            className="absolute inset-y-0 right-0 top-3 pr-3 flex items-center justify-center h-full cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEye size={24} className="text-gray-600" /> : <FaEyeSlash size={24} className="text-gray-600" />}
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    >
                        Sign In
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link to="/forgot-password" className="text-blue-600 hover:underline">
                        Forgot Password?
                    </Link>
                </div>
            </div>
        </div>

    );
};

export default SignIn;

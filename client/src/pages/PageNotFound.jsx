import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6 sm:py-12">
            <div className="text-center mb-8">
                <h1 className="text-6xl font-bold text-red-600">404</h1>
                <p className="text-2xl font-semibold text-gray-800 mt-4">Page Not Found</p>
                <p className="text-lg text-gray-600 mt-2">
                    The page you are looking for does not exist or has been moved
                </p>
            </div>
            <div className="p-8 w-full max-w-md text-center">
                <button
                    onClick={handleGoHome}
                    className="py-2 px-4 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                >
                    Go to Home
                </button>
            </div>
        </div>
    );
};

export default PageNotFound;

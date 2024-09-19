import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Employees from '../components/Team/Employees';
import Tasks from '../components/Task/Tasks';
import { TbLogout2 } from "react-icons/tb";
import Projects from '../components/Projects/Projects';
import Client from '../components/Client/Client';
import ProjectManager from '../components/Project Manager/ProjectManager';
import Inventory from '../components/Inventory/Inventory';

const Home = () => {
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const renderContent = () => {
        switch (activeMenu) {
            case 'dashboard':
                return <Dashboard />;
            case 'customer':
                return <Client />;
            case 'projects':
                return <Projects />;
            case 'project Manager':
                return <ProjectManager />;
            case 'Team':
                return <Employees />;
            case 'tasks':
                return <Tasks />;
            case 'inventory':
                return <Inventory />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white p-6 fixed h-full">
                <h2 className="text-2xl font-semibold mb-6">Admin Panel</h2>
                <nav>
                    <ul>
                        <li className="mb-4">
                            <button
                                className={`w-full text-left py-2 px-4 rounded ${activeMenu === 'dashboard' ? 'bg-gray-700' : ''}`}
                                onClick={() => setActiveMenu('dashboard')}
                            >
                                Dashboard
                            </button>
                        </li>
                        <li className="mb-4">
                            <button
                                className={`w-full text-left py-2 px-4 rounded ${activeMenu === 'customer' ? 'bg-gray-700' : ''}`}
                                onClick={() => setActiveMenu('customer')}
                            >
                                Customer
                            </button>
                        </li>
                        <li className="mb-4">
                            <button
                                className={`w-full text-left py-2 px-4 rounded ${activeMenu === 'projects' ? 'bg-gray-700' : ''}`}
                                onClick={() => setActiveMenu('projects')}
                            >
                                Projects
                            </button>
                        </li>
                        <li className="mb-4">
                            <button
                                className={`w-full text-left py-2 px-4 rounded ${activeMenu === 'project Manager' ? 'bg-gray-700' : ''}`}
                                onClick={() => setActiveMenu('project Manager')}
                            >
                                Project Managers
                            </button>
                        </li>

                        <li className="mb-4">
                            <button
                                className={`w-full text-left py-2 px-4 rounded ${activeMenu === 'Team' ? 'bg-gray-700' : ''}`}
                                onClick={() => setActiveMenu('Team')}
                            >
                                Teams
                            </button>
                        </li>
                        <li className="mb-4">
                            <button
                                className={`w-full text-left py-2 px-4 rounded ${activeMenu === 'tasks' ? 'bg-gray-700' : ''}`}
                                onClick={() => setActiveMenu('tasks')}
                            >
                                Tasks
                            </button>
                        </li>
                        <li className="mb-4">
                            <button
                                className={`w-full text-left py-2 px-4 rounded ${activeMenu === 'inventory' ? 'bg-gray-700' : ''}`}
                                onClick={() => setActiveMenu('inventory')}
                            >
                                Inventory Management
                            </button>
                        </li>
                    </ul>
                </nav>
                <button
                    className="mt-32 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
                    onClick={handleLogout}
                >
                    <TbLogout2 size={25} />
                    <span>Logout</span>
                </button>
            </div>

            {/* Main content */}
            <div className="flex-1 ml-64 p-10">
                <h1 className="text-3xl font-semibold mb-6">
                    {activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)}
                </h1>
                {renderContent()}
            </div>
        </div>

    );
};

export default Home;
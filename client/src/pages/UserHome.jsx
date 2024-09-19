import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaTasks, FaInfoCircle, FaTimes, FaUpload, FaCheck } from 'react-icons/fa';
import { FaList, FaPlay, FaHourglassHalf, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import Api from '../common/index';
import Modal from 'react-modal';
import Spinner from '../components/Spinner';
import moment from 'moment';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

Modal.setAppElement('#root');

function UserHome() {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startImage, setStartImage] = useState(null);
    const [completeImage, setCompleteImage] = useState(null);
    const [startImagePreview, setStartImagePreview] = useState(null);
    const [completeImagePreview, setCompleteImagePreview] = useState(null);
    const [showCompleteSection, setShowCompleteSection] = useState(false);
    const [taskStatus, setTaskStatus] = useState('');
    const [modalError, setModalError] = useState('');
    const [loadingImage, setLoadingImage] = useState(false); // Added state for image upload loading
    const [activeTab, setActiveTab] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Assigned':
                return 'text-yellow-400 font-medium';
            case 'In Progress':
                return 'text-pink-800 font-medium';
            case 'Delayed':
                return 'text-red-800 font-medium';
            case 'Done':
                return 'text-green-800 font-medium';
            default:
                return '';
        }
    };

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authorized, please log in again.');
            }

            const response = await axios.get(Api.getUserTasks.url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.data.length === 0) {
                setTasks([]);
            } else {
                setTasks(response.data.data);
            }
            setLoading(false);
        } catch (error) {
            setError(error.message || 'An error occurred.');
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const openModal = (task) => {
        setSelectedTask(task);
        setStartImage(null);
        setCompleteImage(null);
        setStartImagePreview(null);
        setCompleteImagePreview(null);
        setTaskStatus(task.status);
        setModalError('');
        setLoadingImage(false); // Reset loading state on opening

        if (task.status === 'In Progress') {
            setShowCompleteSection(true);
        } else if (task.status === 'Done') {
            setShowCompleteSection(false);
        } else {
            setShowCompleteSection(false);
        }
    };

    const closeModal = () => {
        setSelectedTask(null);
        setStartImage(null);
        setCompleteImage(null);
        setStartImagePreview(null);
        setCompleteImagePreview(null);
        setTaskStatus('');
        setShowCompleteSection(false);
        setModalError('');
        setLoadingImage(false); // Reset loading state on closing
    };

    const handleImageUpload = (event, type) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'start') {
                    setStartImage(file);
                    setStartImagePreview(reader.result);
                } else {
                    setCompleteImage(file);
                    setCompleteImagePreview(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleStartTask = async () => {
        if (!startImage) {
            setModalError('Please upload an image to start the task.');
            return;
        }

        setLoadingImage(true); // Set loading state to true

        const formData = new FormData();
        formData.append('taskId', selectedTask._id);
        formData.append('startImage', startImage);

        try {
            const token = localStorage.getItem('token');
            await axios.post(Api.startTask.url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchTasks();
            setShowCompleteSection(true);
            setTaskStatus('In Progress');
            setModalError('');
        } catch (error) {
            setModalError(error.response?.data?.message || 'Error starting task');
        } finally {
            setLoadingImage(false); // Reset loading state
        }
    };

    const handleCompleteTask = async () => {
        if (!completeImage) {
            setModalError('Please upload an image to complete the task.');
            return;
        }

        setLoadingImage(true); // Set loading state to true

        const formData = new FormData();
        formData.append('taskId', selectedTask._id);
        formData.append('completeImage', completeImage);

        try {
            const token = localStorage.getItem('token');
            await axios.post(Api.submitTask.url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchTasks();
            setTaskStatus('Done');
            setModalError('');
        } catch (error) {
            setModalError(error.response?.data?.message || 'Error completing task');
        } finally {
            setLoadingImage(false); // Reset loading state
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center mt-8">
                <Spinner />
            </div>
        );
    }
    if (error) return <p>Error loading tasks: {error}</p>;

    const getTaskCountByStatus = (status) => {
        return tasks.filter(task => task.status === status).length;
    };

    const pendingTasksCount = tasks.filter(task => task.status !== 'Done').length;

    const filteredTasks = tasks.filter(task => {
        switch (activeTab) {
            case 0: return true; // All
            case 1: return task.status === 'Assigned';
            case 2: return task.status === 'In Progress';
            case 3: return task.status === 'Done';
            case 4: return task.status === 'Delayed';
            default: return true;
        }
    });


    return (
        <div className="min-h-screen bg-gray-50">
            <header className="flex flex-wrap items-center justify-between px-6 py-4 bg-white shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FaTasks className="mr-2" /> Your Tasks
                </h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-red-600 transition duration-300"
                >
                    <FaSignOutAlt className="mr-2" /> Logout
                </button>
            </header>
            <main className="p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        Total Pending Tasks: {pendingTasksCount}
                    </h2>
                </div>
                <Tabs selectedIndex={activeTab} onSelect={(index) => setActiveTab(index)}>
                    <TabList className="flex flex-wrap justify-center space-x-4 mb-6 border-b border-gray-300">
                        <Tab className="py-2 px-3 cursor-pointer flex items-center border-b-2 hover:text-blue-600 transition duration-300 text-sm sm:text-base">
                            <FaList className="mr-2" /> All ({tasks.length})
                        </Tab>
                        <Tab className="py-2 px-3 cursor-pointer flex items-center border-b-2 hover:text-yellow-600 transition duration-300 text-sm sm:text-base">
                            <FaPlay className="mr-2" /> Assigned ({getTaskCountByStatus('Assigned')})
                        </Tab>
                        <Tab className="py-2 px-3 cursor-pointer flex items-center border-b-2 hover:text-pink-600 transition duration-300 text-sm sm:text-base">
                            <FaHourglassHalf className="mr-2" /> In Progress ({getTaskCountByStatus('In Progress')})
                        </Tab>
                        <Tab className="py-2 px-3 cursor-pointer flex items-center border-b-2 hover:text-green-600 transition duration-300 text-sm sm:text-base">
                            <FaCheckCircle className="mr-2" /> Done ({getTaskCountByStatus('Done')})
                        </Tab>
                        <Tab className="py-2 px-3 cursor-pointer flex items-center border-b-2 hover:text-red-600 transition duration-300 text-sm sm:text-base">
                            <FaExclamationCircle className="mr-2" /> Delayed ({getTaskCountByStatus('Delayed')})
                        </Tab>
                    </TabList>
                    <div className="space-y-6">
                        <TabPanel>
                            {filteredTasks.length > 0 ? (
                                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                    {filteredTasks.map((task) => (
                                        <div
                                            key={task._id}
                                            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col p-4"
                                        >
                                            <div className="flex-grow">
                                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                                                    {task.title}
                                                </h3>
                                                <p className="text-gray-600">
                                                    Assigned By: {task.projectManager.name}
                                                </p>
                                                <p className={`text-gray-600 ${getStatusColor(task.status)}`}>
                                                    Status: {task.status}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => openModal(task)}
                                                className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center mt-4"
                                            >
                                                <FaInfoCircle className="mr-2" /> View Details
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className='text-center text-2xl font-semibold'>No tasks available yet</p>
                            )}
                        </TabPanel>
                        <TabPanel>
                            {filteredTasks.filter((task) => task.status === 'Assigned').length > 0 ? (
                                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                    {filteredTasks
                                        .filter((task) => task.status === 'Assigned')
                                        .map((task) => (
                                            <div
                                                key={task._id}
                                                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col p-4"
                                            >
                                                <div className="flex-grow">
                                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                                                        {task.title}
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        Assigned By: {task.projectManager.name}
                                                    </p>
                                                    <p className={`text-gray-600 ${getStatusColor(task.status)}`}>
                                                        Status: {task.status}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => openModal(task)}
                                                    className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center mt-4"
                                                >
                                                    <FaInfoCircle className="mr-2" /> View Details
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className='text-center text-2xl font-semibold'>No tasks Assigned yet</p>
                            )}
                        </TabPanel>
                        <TabPanel>
                            {filteredTasks.filter((task) => task.status === 'In Progress').length > 0 ? (
                                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                    {filteredTasks
                                        .filter((task) => task.status === 'In Progress')
                                        .map((task) => (
                                            <div
                                                key={task._id}
                                                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col p-4"
                                            >
                                                <div className="flex-grow">
                                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                                                        {task.title}
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        Assigned By: {task.projectManager.name}
                                                    </p>
                                                    <p className={`text-gray-600 ${getStatusColor(task.status)}`}>
                                                        Status: {task.status}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => openModal(task)}
                                                    className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center mt-4"
                                                >
                                                    <FaInfoCircle className="mr-2" /> View Details
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className='text-center text-2xl font-semibold'>No tasks in progress yet</p>
                            )}
                        </TabPanel>
                        <TabPanel>
                            {filteredTasks.filter((task) => task.status === 'Done').length > 0 ? (
                                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                    {filteredTasks
                                        .filter((task) => task.status === 'Done')
                                        .map((task) => (
                                            <div
                                                key={task._id}
                                                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col p-4"
                                            >
                                                <div className="flex-grow">
                                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                                                        {task.title}
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        Assigned By: {task.projectManager.name}
                                                    </p>
                                                    <p className={`text-gray-600 ${getStatusColor(task.status)}`}>
                                                        Status: {task.status}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => openModal(task)}
                                                    className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center mt-4"
                                                >
                                                    <FaInfoCircle className="mr-2" /> View Details
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className='text-center text-2xl font-semibold'>No tasks done yet</p>
                            )}
                        </TabPanel>
                        <TabPanel>
                            {filteredTasks.filter((task) => task.status === 'Delayed').length > 0 ? (
                                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                    {filteredTasks
                                        .filter((task) => task.status === 'Delayed')
                                        .map((task) => (
                                            <div
                                                key={task._id}
                                                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col p-4"
                                            >
                                                <div className="flex-grow">
                                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                                                        {task.title}
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        Assigned By: {task.projectManager.name}
                                                    </p>
                                                    <p className={`text-gray-600 ${getStatusColor(task.status)}`}>
                                                        Status: {task.status}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => openModal(task)}
                                                    className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center mt-4"
                                                >
                                                    <FaInfoCircle className="mr-2" /> View Details
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className='text-center text-2xl font-semibold'>No delayed tasks yet</p>
                            )}
                        </TabPanel>
                    </div>
                </Tabs>

            </main>
            {selectedTask && (
                <Modal
                    isOpen={!!selectedTask}
                    onRequestClose={closeModal}
                    contentLabel="Task Details"
                    className="modal max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg relative"
                    overlayClassName="overlay fixed inset-0 bg-black bg-opacity-50"
                >
                    <button onClick={closeModal} className="absolute top-4 right-4 text-red-600 text-2xl z-10">
                        <FaTimes />
                    </button>
                    <h2 className="text-2xl font-bold mb-4">Task Details</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border border-gray-300 p-4 rounded-lg shadow-sm">
                                <p className="text-lg font-base mb-2"><strong>Title:</strong> {selectedTask.title}</p>
                                <p className="text-lg font-base mb-2"><strong>Category:</strong> {selectedTask.category}</p>
                                <p className="text-lg font-base mb-2"><strong>Location:</strong> {selectedTask.project.location}</p>
                            </div>
                            <div className="border border-gray-300 p-4 rounded-lg shadow-sm">
                                <p className="text-lg font-base mb-2"><strong>Assigned By:</strong> {selectedTask.projectManager.name}</p>
                                <p className="text-lg font-base mb-2"><strong>End Date:</strong> {moment(selectedTask.endDate).format('LL')}</p>
                                <p className="text-lg font-base mb-2">
                                    <strong>End Time:</strong> {selectedTask.endTime ? moment(selectedTask.endTime, 'HH:mm').format('h:mm A') : 'N/A'}
                                </p>
                                <p className={`text-lg font-base mb-2 ${getStatusColor(selectedTask.status)}`}>
                                    <strong>Status:</strong> {selectedTask.status}
                                </p>
                            </div>
                        </div>
                        {!showCompleteSection && taskStatus !== 'Done' && (
                            <div className="mt-4 border border-gray-300 p-4 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-2">Start Task</h3>
                                <div className="flex items-center space-x-4">
                                    <label className="flex flex-col items-center px-4 py-2 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
                                        <FaUpload className="w-8 h-8" />
                                        <span className="mt-2 text-base leading-normal">Select Start Image</span>
                                        <input type='file' className="hidden" onChange={(e) => handleImageUpload(e, 'start')} />
                                    </label>
                                    {startImagePreview && (
                                        <div className="w-24 h-24 relative">
                                            <img src={startImagePreview} alt="Start Preview" className="w-full h-full object-cover border border-gray-300 rounded-lg" />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleStartTask}
                                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 flex items-center"
                                    disabled={loadingImage}
                                >
                                    {loadingImage ? <Spinner /> : <FaUpload className="mr-2" />} Start Task
                                </button>
                            </div>
                        )}

                        {showCompleteSection && (
                            <div className="mt-4 border border-gray-300 p-4 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold mb-2">Complete Task</h3>
                                <div className="flex items-center space-x-4">
                                    <label className="flex flex-col items-center px-4 py-2 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
                                        <FaUpload className="w-8 h-8" />
                                        <span className="mt-2 text-base leading-normal">Select Complete Image</span>
                                        <input type='file' className="hidden" onChange={(e) => handleImageUpload(e, 'complete')} />
                                    </label>
                                    {completeImagePreview && (
                                        <div className="w-24 h-24 relative">
                                            <img src={completeImagePreview} alt="Complete Preview" className="w-full h-full object-cover border border-gray-300 rounded-lg" />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleCompleteTask}
                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center"
                                    disabled={loadingImage}
                                >
                                    {loadingImage ? <Spinner /> : <FaCheck className="mr-2" />} Complete Task
                                </button>
                            </div>
                        )}

                        {taskStatus === 'Done' && (
                            <div className="mt-4 text-center text-green-500 border border-gray-300 p-4 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold">Task Completed</h3>
                                <p>Your task is marked as completed.</p>
                            </div>
                        )}
                    </div>
                    {modalError && (
                        <p className="text-red-500 mt-4">{modalError}</p> // Display error message in modal
                    )}
                </Modal>
            )}



        </div>
    );
}

export default UserHome;

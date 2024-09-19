import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import PropTypes from 'prop-types';
import Api from '../../common/index';
import ROLE from '../../common/role';
import Select from 'react-select';
import moment from 'moment'

const TaskModal = ({ isOpen, onClose, taskDetails, onAdd, isViewOnly }) => {
    const [task, setTask] = useState({
        title: '',
        category: 'Installation',
        project: '',
        projectManager: '',
        startDate: '',
        endDate: '',
        endTime: '', // New endTime field
        assignedTo: [],
        teamLead: '',
        status: 'Assigned',
        startImage: '',
        completeImage: ''
    });
    const [projects, setProjects] = useState([]);
    const [projectManagers, setProjectManagers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && !isViewOnly) {
            setLoading(true);
            Promise.all([
                axios.get(Api.getProject.url),
                axios.get(Api.getProjectManager.url),
                axios.get(Api.getEmployee.url)
            ]).then(([projectsRes, managersRes, employeesRes]) => {
                setProjects(projectsRes.data.data || []);
                setProjectManagers(managersRes.data.data || []);
                const filteredEmployees = employeesRes.data.data.filter(emp => emp.role === ROLE.GENERAL);
                setEmployees(filteredEmployees);
            }).catch(err => console.error(err))
                .finally(() => setLoading(false));
        } else if (taskDetails) {
            setTask(taskDetails);
        }
    }, [isOpen, taskDetails, isViewOnly]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask(prev => ({ ...prev, [name]: value }));
    };

    const handleProjectChange = (e) => {
        const projectId = e.target.value;
        axios.get(`${Api.getProjectDetail.url.replace(':projectId', projectId)}`)
            .then(res => {
                const { projectManager, startDate, endDate } = res.data.data;
                setTask(prev => ({
                    ...prev,
                    project: projectId,
                    projectManager: projectManager?._id || '',
                    startDate: formatDate(startDate),
                    endDate: formatDate(endDate)
                }));
            })
            .catch(err => console.error(err));
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const formattedEndTime = task.endTime ? moment(task.endTime, 'HH:mm').format('h:mm A') : '';

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios.post(Api.addTask.url, task)
            .then(res => {
                onAdd(res.data);
                onClose();
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Assigned':
                return 'text-yellow-400 font-medium';
            case 'In Progress':
                return 'text-brown-400 font-medium';
            case 'Delayed':
                return 'text-red-800 font-medium';
            case 'Done':
                return 'text-green-800 font-medium';
            default:
                return '';
        }
    };

    if (!isOpen) return null;

    const employeeOptions = employees.map(emp => ({
        value: emp._id,
        label: emp.name
    }));

    const handleAssignedToChange = (selectedOptions) => {
        setTask(prev => ({
            ...prev,
            assignedTo: selectedOptions.map(option => option.value)
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[80vw] max-w-screen-lg max-h-[90vh] overflow-auto landscape-orientation">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{isViewOnly ? 'View Task' : 'Add Task'}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FaTimes size={24} />
                    </button>
                </div>
                {loading && <div className="spinner mx-auto mb-4"></div>}
                {isViewOnly ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-xl shadow-2xl max-w-screen-lg mx-auto">
                        {/* Task Information */}
                        <div className="space-y-6 bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-300 pb-3 mb-6">Task Information</h3>

                            <div className="flex items-center justify-between text-lg">
                                <span className="text-gray-700 font-bold">Title:</span>
                                <span className="text-gray-900 font-medium">{task.title}</span>
                            </div>

                            <div className="flex items-center justify-between text-lg">
                                <span className="text-gray-700 font-bold">Category:</span>
                                <span className="text-gray-900 font-medium">{task.category}</span>
                            </div>

                            <div className="flex items-center text-lg">
                                <span className="text-gray-700 font-bold flex-shrink-0 w-32">Project:</span>
                                <div className="flex-grow ml-4 overflow-hidden">
                                    <span className="text-gray-900 font-medium">{task.project?.projectName}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-lg">
                                <span className="text-gray-700 font-bold">Project Manager:</span>
                                <span className="text-gray-900 font-medium">{task.projectManager?.name || 'N/A'}</span>
                            </div>

                            <div className="flex items-center justify-between text-lg">
                                <span className="text-gray-700 font-bold">Start Date:</span>
                                <span className="text-gray-900 font-medium">{moment(task.startDate).format('LL')}</span>
                            </div>

                            <div className="flex items-center justify-between text-lg">
                                <span className="text-gray-700 font-bold">Due Date:</span>
                                <span className="text-gray-900 font-medium">{moment(task.endDate).format('LL')}</span>
                            </div>
                            <div className="flex items-center justify-between text-lg">
                                <span className="text-gray-700 font-bold">Due Time:</span>
                                <span className="text-gray-900 font-medium">{formattedEndTime}</span>
                            </div>

                            <div className="flex items-center justify-between text-lg">
                                <span className="text-gray-700 font-bold">Team Lead:</span>
                                <span className="text-gray-900 font-medium">{task.teamLead?.name || 'N/A'}</span>
                            </div>

                            <div className={`font-bold ${getStatusColor(task.status)} flex items-center justify-between text-lg`}>
                                <span className="text-gray-700">Status:</span>
                                <span className="uppercase tracking-wider">{task.status}</span>
                            </div>
                        </div>

                        {/* Assigned Members */}
                        <div className="space-y-6 bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-semibold text-gray-800 border-b-2 border-green-300 pb-3 mb-6">Assigned Team Members</h3>
                            <ul className="space-y-3 bg-white p-4 rounded-lg shadow-md">
                                {task.assignedTo.map(user => (
                                    <li key={user._id} className="text-gray-700 font-medium flex items-center space-x-3 hover:bg-green-100 p-2 rounded-md transition duration-300 ease-in-out">
                                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                                        <span>{user.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Conditional Display of Start and Complete Images */}
                        {task.status === 'Done' && (
                            <div className="mt-4 flex flex-wrap gap-6 justify-center">
                                {task.startImage && (
                                    <div className="flex flex-col items-center border-2 border-gray-300 rounded-lg shadow-md p-2 bg-white">
                                        <img
                                            src={task.startImage}
                                            alt="Start"
                                            className="w-40 h-40 object-cover rounded-lg border border-gray-200 shadow-sm"
                                        />
                                        <span className="mt-2 text-gray-800 font-semibold">Start Image</span>
                                    </div>
                                )}
                                {task.completeImage && (
                                    <div className="flex flex-col items-center border-2 border-gray-300 rounded-lg shadow-md p-2 bg-white">
                                        <img
                                            src={task.completeImage}
                                            alt="Complete"
                                            className="w-40 h-40 object-cover rounded-lg border border-gray-200 shadow-sm"
                                        />
                                        <span className="mt-2 text-gray-800 font-semibold">Complete Image</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="text-gray-700 font-medium mb-1 block">Title</span>
                                    <input
                                        type="text"
                                        name="title"
                                        value={task.title}
                                        onChange={handleChange}
                                        className="form-input mt-1 block w-full border-2 border-gray-500 focus:border-blue-700 focus:ring focus:ring-blue-300 bg-gray-50 text-gray-800 rounded-md shadow-md px-4 py-2 transition duration-150 ease-in-out hover:shadow-lg"
                                        required
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-gray-700 font-medium mb-1 block">Category</span>
                                    <select
                                        name="category"
                                        value={task.category}
                                        onChange={handleChange}
                                        className="form-input mt-1 block w-full border-2 border-gray-500 focus:border-blue-700 focus:ring focus:ring-blue-300 bg-gray-50 text-gray-800 rounded-md shadow-md px-4 py-2 transition duration-150 ease-in-out hover:shadow-lg"
                                    >
                                        <option value="Installation">Installation</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Repair">Repair</option>
                                    </select>
                                </label>

                                <label className="block">
                                    <span className="text-gray-700 font-medium mb-1 block">Project</span>
                                    <select
                                        name="project"
                                        value={task.project}
                                        onChange={handleProjectChange}
                                        className="form-input mt-1 block w-full border-2 border-gray-500 focus:border-blue-700 focus:ring focus:ring-blue-300 bg-gray-50 text-gray-800 rounded-md shadow-md px-4 py-2 transition duration-150 ease-in-out hover:shadow-lg"

                                        required
                                    >
                                        <option value="">Select a project</option>
                                        {projects.map(project => (
                                            <option key={project._id} value={project._id}>
                                                {project.projectName}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="block">
                                    <span className="text-gray-700 font-medium mb-1 block">Start Date</span>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={task.startDate}
                                        onChange={handleChange}
                                        className="form-input mt-1 block w-full border-2 border-gray-500 focus:border-blue-700 focus:ring focus:ring-blue-300 bg-gray-50 text-gray-800 rounded-md shadow-md px-4 py-2 transition duration-150 ease-in-out hover:shadow-lg"
                                        required
                                    />
                                </label>
                            </div>

                            <div className="space-y-4">
                                <label className="block">
                                    <span className="text-gray-700 font-medium mb-1 block">Due Date</span>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={task.endDate}
                                        onChange={handleChange}
                                        className="form-input mt-1 block w-full border-2 border-gray-500 focus:border-blue-700 focus:ring focus:ring-blue-300 bg-gray-50 text-gray-800 rounded-md shadow-md px-4 py-2 transition duration-150 ease-in-out hover:shadow-lg"
                                        required
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-gray-700 font-medium mb-1 block">Due Time</span>
                                    <input
                                        type="time"
                                        name="endTime" // New time input
                                        value={task.endTime}
                                        onChange={handleChange}
                                        className="form-input mt-1 block w-full"
                                        required
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-gray-700 font-medium mb-1 block">Team Lead</span>
                                    <select
                                        name="teamLead"
                                        value={task.teamLead}
                                        onChange={handleChange}
                                        className="form-input mt-1 block w-full border-2 border-gray-500 focus:border-blue-700 focus:ring focus:ring-blue-300 bg-gray-50 text-gray-800 rounded-md shadow-md px-4 py-2 transition duration-150 ease-in-out hover:shadow-lg"
                                    >
                                        <option value="">Select Team Lead</option>
                                        {employees.map(employee => (
                                            <option key={employee._id} value={employee._id}>
                                                {employee.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="block">
                                    <span className="text-gray-700 font-medium mb-1 block">Assigned To</span>
                                    <Select
                                        isMulti
                                        name="assignedTo"
                                        options={employeeOptions}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        value={task.assignedTo.map(id => ({
                                            value: id,
                                            label: employees.find(emp => emp._id === id)?.name || ''
                                        }))}
                                        onChange={handleAssignedToChange}
                                        styles={{
                                            control: (provided, state) => ({
                                                ...provided,
                                                borderWidth: '2px',
                                                borderColor: state.isFocused ? '#1D4ED8' : '#6B7280', // Gray when idle, blue when focused
                                                backgroundColor: '#F9FAFB', // Equivalent to bg-gray-50
                                                boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.3)' : 'none', // Blue ring on focus
                                                padding: '0.5rem', // Equivalent to px-4 py-2
                                                transition: 'box-shadow 150ms ease-in-out, border-color 150ms ease-in-out', // Smooth transition
                                                '&:hover': {
                                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Hover shadow (hover:shadow-lg)
                                                }
                                            }),
                                            option: (provided, state) => ({
                                                ...provided,
                                                backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#DBEAFE' : 'white',
                                                color: state.isSelected ? 'white' : '#374151',
                                            }),
                                            multiValue: (provided) => ({
                                                ...provided,
                                                backgroundColor: '#E5E7EB', // Light gray for selected items
                                                color: '#111827',
                                            }),
                                            multiValueLabel: (provided) => ({
                                                ...provided,
                                                color: '#374151', // Text color for selected item labels
                                            }),
                                            multiValueRemove: (provided) => ({
                                                ...provided,
                                                color: '#6B7280', // Close button color
                                                '&:hover': {
                                                    backgroundColor: '#EF4444', // Red background on hover
                                                    color: 'white',
                                                },
                                            }),
                                        }}
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-gray-700 font-medium mb-1 block">Status</span>
                                    <select
                                        name="status"
                                        value={task.status}
                                        onChange={handleChange}
                                        className="form-input mt-1 block w-full border-2 border-gray-500 focus:border-blue-700 focus:ring focus:ring-blue-300 bg-gray-50 text-gray-800 rounded-md shadow-md px-4 py-2 transition duration-150 ease-in-out hover:shadow-lg"
                                    >
                                        <option value="Assigned">Assigned</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Delayed">Delayed</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-150 ease-in-out"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-150 ease-in-out"
                            >
                                Add Task
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

TaskModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    taskDetails: PropTypes.object,
    onAdd: PropTypes.func,
    isViewOnly: PropTypes.bool
};

export default TaskModal;
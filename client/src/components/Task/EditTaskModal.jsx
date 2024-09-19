import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Select from 'react-select';
import Api from '../../common/index';

const EditTaskModal = ({ isOpen, onClose, task, onUpdate }) => {
    const [editedTask, setEditedTask] = useState({
        title: '',
        category: '',
        project: '',
        startDate: '',
        endDate: '',
        endTime: '',
        teamLead: '',
        assignedTo: [],
        status: 'Assigned'
    });
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            setEditedTask({
                title: task.title || '',
                category: task.category || '',
                project: task.project?._id || '',
                startDate: task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : '',
                endDate: task.endDate ? new Date(task.endDate).toISOString().split('T')[0] : '',
                endTime: task.endTime || '',
                teamLead: task.teamLead?._id || '',
                assignedTo: task.assignedTo?.map(user => user._id) || [],
                status: task.status || 'Assigned'
            });
        }
        fetchProjects();
        fetchEmployees();
    }, [task]);

    const fetchProjects = async () => {
        try {
            const response = await axios.get(Api.getProject.url);
            setProjects(response.data.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(Api.getEmployee.url);
            setEmployees(response.data.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedTask(prevTask => ({
            ...prevTask,
            [name]: value
        }));
    };

    const handleProjectChange = (e) => {
        const projectId = e.target.value;
        setEditedTask(prevTask => ({
            ...prevTask,
            project: projectId
        }));
    };

    const handleAssignedToChange = (selectedOptions) => {
        setEditedTask(prevTask => ({
            ...prevTask,
            assignedTo: selectedOptions.map(option => option.value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!task) return;
        setLoading(true); // Show spinner when the task update starts
        try {
            const response = await axios.put(`${Api.updateTask.url.replace(':taskId', task._id)}`, editedTask);
            if (response.data.success) {
                onUpdate(response.data.data);
                onClose();
            }
        } catch (error) {
            console.error('Error updating task:', error);
        } finally {
            setLoading(false); // Hide spinner once the update is complete
        }
    };

    if (!isOpen) return null;

    const employeeOptions = employees.map(employee => ({
        value: employee._id,
        label: employee.name
    }));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl mx-4">
                <h2 className="text-2xl font-bold mb-6">Edit Task</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="block">
                                <span className="text-gray-700 font-medium">Title</span>
                                <input
                                    type="text"
                                    name="title"
                                    value={editedTask.title}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full border-2 border-gray-500 focus:border-blue-700 focus:ring focus:ring-blue-300 bg-gray-50 text-gray-800 rounded-md shadow-md px-4 py-2 transition duration-150 ease-in-out hover:shadow-lg"
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="text-gray-700 font-medium">Category</span>
                                <select
                                    name="category"
                                    value={editedTask.category}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full border-2 border-gray-500 focus:border-blue-700 focus:ring focus:ring-blue-300 bg-gray-50 text-gray-800 rounded-md shadow-md px-4 py-2 transition duration-150 ease-in-out hover:shadow-lg"
                                >
                                    <option value="Installation">Installation</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Repair">Repair</option>
                                </select>
                            </label>

                            <label className="block">
                                <span className="text-gray-700 font-medium">Project</span>
                                <select
                                    name="project"
                                    value={editedTask.project}
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
                                <span className="text-gray-700 font-medium">Start Date</span>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={editedTask.startDate}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full border-2 border-gray-500 focus:border-blue-700 focus:ring focus:ring-blue-300 bg-gray-50 text-gray-800 rounded-md shadow-md px-4 py-2 transition duration-150 ease-in-out hover:shadow-lg"
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="text-gray-700 font-medium">Due Date</span>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={editedTask.endDate}
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
                                    value={editedTask.endTime}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full border-2 border-gray-500 focus:border-blue-700 focus:ring focus:ring-blue-300 bg-gray-50 text-gray-800 rounded-md shadow-md px-4 py-2 transition duration-150 ease-in-out hover:shadow-lg"
                                    required
                                />
                            </label>
                        </div>

                        <div className="space-y-4">
                            <label className="block">
                                <span className="text-gray-700 font-medium">Team Lead</span>
                                <select
                                    name="teamLead"
                                    value={editedTask.teamLead}
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
                                <span className="text-gray-700 font-medium">Assigned To</span>
                                <Select
                                    isMulti
                                    name="assignedTo"
                                    options={employeeOptions}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    value={editedTask.assignedTo.map(id => ({
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
                                <span className="text-gray-700 font-medium">Status</span>
                                <select
                                    name="status"
                                    value={editedTask.status}
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
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            disabled={loading} // Disable button when loading
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
                            disabled={loading} // Disable button when loading
                        >
                            {loading && (
                                <div className="spinner mr-2 h-5 w-5"></div>
                            )}
                            {loading ? 'Updating...' : 'Update Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

EditTaskModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    task: PropTypes.object,
    onUpdate: PropTypes.func.isRequired
};

export default EditTaskModal;

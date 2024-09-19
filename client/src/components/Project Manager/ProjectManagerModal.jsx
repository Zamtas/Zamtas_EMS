import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const ProjectManagerModal = ({ isOpen, onClose, onAdd, onSave, manager, mode }) => {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        email: '',
        department: ''
    });

    useEffect(() => {
        if (mode === 'edit' || mode === 'view') {
            setFormData({
                name: manager?.name || '',
                contact: manager?.contact || '',
                email: manager?.email || '',
                department: manager?.department || ''
            });
        } else {
            // Clear form data for 'add' mode
            setFormData({
                name: '',
                contact: '',
                email: '',
                department: ''
            });
        }
    }, [manager, mode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        if (mode === 'edit') {
            onSave(manager._id, formData);
        } else if (mode === 'add') {
            onAdd(formData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg w-11/12 md:w-3/4 lg:w-1/2 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">
                        {mode === 'edit' ? 'Edit Project Manager' : mode === 'view' ? 'View Project Manager' : 'Add Project Manager'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-700 hover:text-gray-900 text-3xl font-bold"
                    >
                        <FaTimes />
                    </button>
                </div>
                <form className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            readOnly={mode === 'view'}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Contact</label>
                        <input
                            type="text"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            readOnly={mode === 'view'}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            readOnly={mode === 'view'}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Department</label>
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            readOnly={mode === 'view'}
                        />
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        {mode === 'view' ? (
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
                            >
                                Close
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
                                >
                                    {mode === 'add' ? 'Add Project Manager' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

ProjectManagerModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    manager: PropTypes.object,
    mode: PropTypes.oneOf(['view', 'edit', 'add']).isRequired // Add 'add' mode
};

export default ProjectManagerModal;

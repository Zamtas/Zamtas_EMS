import { useState, useEffect } from 'react';
import axios from 'axios';
import Api from '../../common/index';
import { FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

const ProjectModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        projectName: '',
        projectId: '',
        clientId: '',
        clientContact: '',
        startDate: '',
        endDate: '',
        projectManagerId: '',
        location: '',
        budget: '', // Budget is optional
        productId: '',
        quantity: '',
        category: '',
        subcategory: '',
        model: ''
    });
    const [error, setError] = useState('');
    const [clients, setClients] = useState([]);
    const [projectManagers, setProjectManagers] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (isOpen) {
            const fetchClientsManagersAndProducts = async () => {
                try {
                    const [clientsResponse, managersResponse, productsResponse] = await Promise.all([
                        axios.get(Api.getClient.url),
                        axios.get(Api.getProjectManager.url),
                        axios.get(Api.getProduct.url)
                    ]);
                    setClients(clientsResponse.data.data);
                    setProjectManagers(managersResponse.data.data);
                    setProducts(productsResponse.data.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setError('Failed to load data. Please try again.');
                }
            };

            fetchClientsManagersAndProducts();
        } else {
            resetForm();
        }
    }, [isOpen]);

    const resetForm = () => {
        setFormData({
            projectName: '',
            projectId: '',
            clientId: '',
            clientContact: '',
            startDate: '',
            endDate: '',
            projectManagerId: '',
            location: '',
            budget: '', // Reset budget field to empty
            productId: '',
            quantity: '',
            category: '',
            subcategory: '',
            model: ''
        });
        setError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'projectId') {
            checkProjectIdExists(value);
        }
        if (name === 'productId') {
            const selectedProduct = products.find(product => product._id === value);
            if (selectedProduct) {
                setFormData(prev => ({
                    ...prev,
                    productId: selectedProduct._id,
                    quantity: selectedProduct.quantity || '',
                    category: selectedProduct.category || '',
                    subcategory: selectedProduct.subcategory || '',
                    model: selectedProduct.model || ''
                }));
            }
        }
    };

    const checkProjectIdExists = async (projectId) => {
        try {
            const response = await axios.get(`${Api.checkProjectId.url.replace(':projectId', projectId)}`);
            if (response.data.exists) {
                setError('A project with this ID already exists. Please use a different Project ID.');
            } else {
                setError('');
            }
        } catch (error) {
            console.error('Error checking project ID:', error);
        }
    };

    const handleClientChange = (e) => {
        const selectedClientId = e.target.value;
        const selectedClient = clients.find(client => client._id === selectedClientId);

        if (selectedClient) {
            setFormData(prev => ({
                ...prev,
                clientId: selectedClient._id,
                clientContact: selectedClient.clientContact,
                budget: selectedClient.clientBudget || '' // Optional budget
            }));
        }
    };

    const handleProjectManagerChange = (e) => {
        setFormData(prev => ({
            ...prev,
            projectManagerId: e.target.value
        }));
    };

    const validateForm = () => {
        const { projectName, projectId, clientId, clientContact, startDate, endDate } = formData;

        if (!/^[A-Za-z\s]+$/.test(projectName)) return "Project Name should only contain alphabets and spaces.";
        if (!/^[A-Za-z0-9]+$/.test(projectId)) return "Project ID should be alphanumeric.";
        if (!clientId) return "Please select a client.";
        if (!/^[0-9]+$/.test(clientContact)) return "Client Contact should only contain numbers.";
        if (isNaN(Date.parse(startDate))) return "Invalid Start Date.";
        if (isNaN(Date.parse(endDate))) return "Invalid End Date.";
        if (new Date(startDate) >= new Date(endDate)) return "Start Date must be before End Date.";
        if (!formData.projectManagerId) return "Please select a Project Manager.";

        return ''; // No error if all validations pass
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        if (error) {
            return;
        }

        const formattedData = {
            ...formData,
            startDate: new Date(formData.startDate).toISOString(),
            endDate: new Date(formData.endDate).toISOString(),
            budget: formData.budget ? Number(formData.budget) : undefined, // Make budget optional
            quantity: Number(formData.quantity),
        };

        try {
            const response = await axios.post(Api.addProject.url, formattedData);
            onAdd(response.data.data);
            onClose();
        } catch (error) {
            console.error('Error adding project:', error.response ? error.response.data : error.message);
            setError(error.response?.data?.message || 'Error adding project. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl mx-4 my-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Add Project</h2>
                    <button onClick={() => { onClose(); resetForm(); }} className="text-gray-500 hover:text-gray-700">
                        <FaTimes size={24} />
                    </button>
                </div>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                    {/* Existing form fields */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Project Name:
                        </label>
                        <input
                            type="text"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-md shadow-sm p-3 w-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Project ID:
                        </label>
                        <input
                            type="text"
                            name="projectId"
                            value={formData.projectId}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-md shadow-sm p-3 w-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Client Name:
                        </label>
                        <select
                            name="clientId"
                            value={formData.clientId}
                            onChange={handleClientChange}
                            required
                            className="border border-gray-300 rounded-md shadow-sm p-3 w-full"
                        >
                            <option value="">Select Client</option>
                            {clients.map(client => (
                                <option key={client._id} value={client._id}>
                                    {client.clientName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Client Contact:
                        </label>
                        <input
                            type="text"
                            name="clientContact"
                            value={formData.clientContact}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-md shadow-sm p-3 w-full"
                            readOnly
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Start Date:
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-md shadow-sm p-3 w-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            End Date:
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-md shadow-sm p-3 w-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Project Manager:
                        </label>
                        <select
                            name="projectManagerId"
                            value={formData.projectManagerId}
                            onChange={handleProjectManagerChange}
                            required
                            className="border border-gray-300 rounded-md shadow-sm p-3 w-full"
                        >
                            <option value="">Select Project Manager</option>
                            {projectManagers.map(manager => (
                                <option key={manager._id} value={manager._id}>
                                    {manager.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Location:
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md shadow-sm p-3 w-full"
                        />
                    </div>
                    {/* Product-related fields */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Product:
                        </label>
                        <select
                            name="productId"
                            value={formData.productId}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md shadow-sm p-3 w-full"
                        >
                            <option value="">Select Product</option>
                            {products.map(product => (
                                <option key={product._id} value={product._id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Quantity:
                        </label>
                        <input
                            type="text"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md shadow-sm p-3 w-full"
                            readOnly
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Category:
                        </label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md shadow-sm p-3 w-full"
                            readOnly
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Subcategory:
                        </label>
                        <input
                            type="text"
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md shadow-sm p-3 w-full"
                            readOnly
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Model:
                        </label>
                        <input
                            type="text"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md shadow-sm p-3 w-full"
                            readOnly
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Budget (Optional):
                        </label>
                        <input
                            type="number"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md shadow-sm p-3 w-full"
                            placeholder="Enter budget (optional)"
                        />
                    </div>
                    {/* Submit button */}
                    <div className="col-span-2 flex justify-end mt-4">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
                        >
                            Add Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

ProjectModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired
};

export default ProjectModal;

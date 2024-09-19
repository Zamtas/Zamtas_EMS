import { useState, useEffect } from 'react';
import axios from 'axios';
import Api from '../../common/index';
import { FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

const ClientModal = ({ isOpen, onClose, onSave, onUpdate, clientData, modalType }) => {
    const [formData, setFormData] = useState({
        clientName: '',
        clientContact: '',
        clientAddress: '',
        clientEmail: '',
        clientContactPerson: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (clientData) {
            const { _id, __v, ...filteredData } = clientData;
            setFormData(filteredData);
        }
    }, [clientData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const { clientName, clientContact, clientAddress, clientEmail, clientContactPerson } = formData;
        const errors = {
            clientName: !/^[A-Za-z\s]+$/.test(clientName) ? "should only contain alphabets and spaces." : '',
            clientContact: !/^[0-9]+$/.test(clientContact) ? "should only contain numbers." : '',
            clientAddress: !/^[A-Za-z\s]+$/.test(clientAddress) ? "should only contain alphabets and spaces." : '',
            clientEmail: !/^\S+@\S+\.\S+$/.test(clientEmail) ? "Invalid email format." : '',
            clientContactPerson: !/^[A-Za-z\s]+$/.test(clientContactPerson) ? "should only contain alphabets and spaces." : '',
        };

        const errorMessage = Object.values(errors).find(msg => msg) || '';
        return errorMessage;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (modalType === 'view') return;

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            let response;
            if (modalType === 'edit') {
                response = await axios.put(Api.updateClient.url.replace(':id', clientData._id), formData);
                onUpdate(response.data.data);
            } else {
                response = await axios.post(Api.addClient.url, formData);
                onSave(response.data.data);
            }
            onClose();
        } catch (error) {
            console.error('Error saving client:', error.response ? error.response.data : error.message);
            setError(error.response?.data?.message || 'Error saving client. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl mx-4 my-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {modalType === 'add' ? 'Add Client' : modalType === 'edit' ? 'Edit Client' : 'View Client'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors duration-300">
                        <FaTimes size={24} />
                    </button>
                </div>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                    {Object.entries(formData).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1 capitalize" htmlFor={key}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </label>
                            <input
                                id={key}
                                name={key}
                                type="text"
                                value={value}
                                onChange={handleChange}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                required
                                readOnly={modalType === 'view'}
                            />
                        </div>
                    ))}
                    {modalType !== 'view' && (
                        <div className="col-span-2 flex justify-end mt-6">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                            >
                                {modalType === 'edit' ? 'Update Client' : 'Add Client'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

ClientModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onUpdate: PropTypes.func,
    clientData: PropTypes.object,
    modalType: PropTypes.oneOf(['add', 'edit', 'view']).isRequired,
};

export default ClientModal;
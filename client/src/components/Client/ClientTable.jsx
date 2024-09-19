import PropTypes from 'prop-types';
import { FaEye, FaEdit } from 'react-icons/fa';

const ClientTable = ({ clients, onView, onEdit }) => {

    const truncateText = (text) => {
        if (typeof text !== 'string') return '';
        return text.split(' ').length > 1 ? `${text.split(' ')[0]}...` : text;
    };

    return (
        <div className="overflow-x-auto mt-6">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 uppercase text-sm font-semibold">
                    <tr>
                        {['Client Name', 'Email', 'Contact Person', 'Contact', 'Address', 'Actions'].map(header => (
                            <th key={header} className="py-2 px-3 border-b border-gray-300">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                    {clients.map((client, index) => (
                        <tr key={client._id} className={`transition-all duration-300 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}>
                            <td className="py-3 px-6 border-b border-gray-300 text-center">{truncateText(client.clientName)}</td>
                            <td className="py-3 px-6 border-b border-gray-300 text-center">{client.clientEmail}</td>
                            <td className="py-3 px-6 border-b border-gray-300 text-center">{truncateText(client.clientContactPerson)}</td>
                            <td className="py-3 px-6 border-b border-gray-300 text-center">{client.clientContact}</td>
                            <td className="py-3 px-6 border-b border-gray-300 text-center">{truncateText(client.clientAddress)}</td>
                            <td className="py-3 px-6 border-b border-gray-300 text-center">
                                <button
                                    onClick={() => onView(client._id)}
                                    className="mr-2 text-blue-600 hover:text-blue-800 transition-colors duration-300"
                                    title="View Client"
                                >
                                    <FaEye size={20} />
                                </button>
                                <button
                                    onClick={() => onEdit(client)}
                                    className="text-green-600 hover:text-green-800 transition-colors duration-300"
                                    title="Edit Client"
                                >
                                    <FaEdit size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

ClientTable.propTypes = {
    clients: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        clientName: PropTypes.string.isRequired,
        clientEmail: PropTypes.string.isRequired,
        clientContactPerson: PropTypes.string.isRequired,
        clientContact: PropTypes.string.isRequired,
        clientAddress: PropTypes.string.isRequired,
    })).isRequired,
    onView: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
};

export default ClientTable;
import PropTypes from 'prop-types';
import { FaEye, FaEdit } from 'react-icons/fa';

const ProjectManagerTable = ({ managers, onEdit, onView }) => {
    const truncateText = (text) => {
        if (typeof text !== 'string') return '';
        const words = text.split(' ');
        if (words.length > 1) {
            return `${words[0]}...`;
        }
        return text;
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                <thead className="bg-gray-200 text-gray-800 uppercase text-sm font-semibold">
                    <tr>
                        <th className="py-2 px-3 border-b border-gray-300">Name</th>
                        <th className="py-2 px-3 border-b border-gray-300">Contact</th>
                        <th className="py-2 px-3 border-b border-gray-300">Email</th>
                        <th className="py-2 px-3 border-b border-gray-300">Department</th>
                        <th className="py-2 px-3 border-b border-gray-300">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {managers.map((manager, index) => (
                        <tr key={manager._id} className={`transition-colors duration-150 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}>
                            <td className="py-3 px-6 border-b border-gray-300 text-center text-base">
                                {truncateText(manager.name)}
                            </td>
                            <td className="py-3 px-6 border-b border-gray-300 text-center text-base">
                                {manager.contact}
                            </td>
                            <td className="py-3 px-6 border-b border-gray-300 text-center text-base">
                                {manager.email}
                            </td>
                            <td className="py-3 px-6 border-b border-gray-300 text-center text-base">
                                {manager.department}
                            </td>
                            <td className="py-3 px-6 border-b border-gray-300 text-center">
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={() => onView(manager)}
                                        className="text-blue-500 hover:text-blue-700"
                                        title="View Details"
                                    >
                                        <FaEye size={20} />
                                    </button>
                                    <button
                                        onClick={() => onEdit(manager)}
                                        className="text-green-500 hover:text-green-700"
                                        title="Edit Manager"
                                    >
                                        <FaEdit size={20} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

ProjectManagerTable.propTypes = {
    managers: PropTypes.array.isRequired,
    onEdit: PropTypes.func.isRequired,
    onView: PropTypes.func.isRequired,
};

export default ProjectManagerTable;

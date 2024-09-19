import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import PropTypes from 'prop-types';

const EmployeeTable = ({ employees, handleEditClick, handleDeleteClick, fetchUserDetails }) => {
    return (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
            <thead className='bg-gray-200 text-gray-800 uppercase text-sm font-semibold'>
                <tr>
                    <th className="py-2 px-3 border-b border-gray-300">Name</th>
                    <th className="py-2 px-3 border-b border-gray-300">Email</th>
                    <th className="py-2 px-3 border-b border-gray-300">Designation</th>
                    <th className="py-2 px-3 border-b border-gray-300">Department</th>
                    <th className="py-2 px-3 border-b border-gray-300">Role</th>
                    <th className="py-2 px-3 border-b border-gray-300">Action</th>
                </tr>
            </thead>
            <tbody>
                {employees.map((employee, index) => (
                    <tr key={employee._id} className={`transition-colors duration-150 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}>
                        <td className="py-3 px-6 border-b border-gray-300 text-center text-base">{employee.name}</td>
                        <td className="py-3 px-6 border-b border-gray-300 text-center text-base">{employee.email}</td>
                        <td className="py-3 px-6 border-b border-gray-300 text-center text-base">{employee.designation || 'N/A'}</td>
                        <td className="py-3 px-6 border-b border-gray-300 text-center text-base">{employee.department || 'N/A'}</td>
                        <td className="py-3 px-6 border-b border-gray-300 text-center text-base">{employee.role}</td>
                        <td className="py-3 px-6 border-b border-gray-300 text-center text-base">
                            <button className="text-blue-500 hover:text-blue-700 mr-2" onClick={() => handleEditClick(employee)}>
                                <FaEdit size={20} />
                            </button>
                            <button
                                className="text-red-500 hover:text-red-700 mr-2"
                                onClick={() => handleDeleteClick(employee._id)}
                            >
                                <FaTrash size={20} />
                            </button>
                            <button
                                className="text-green-500 hover:text-green-700"
                                onClick={() => fetchUserDetails(employee._id)}
                            >
                                <FaEye size={20} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

EmployeeTable.propTypes = {
    employees: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        designation: PropTypes.string,
        department: PropTypes.string,
        role: PropTypes.string.isRequired
    })).isRequired,
    handleEditClick: PropTypes.func.isRequired,
    handleDeleteClick: PropTypes.func.isRequired,
    fetchUserDetails: PropTypes.func.isRequired
};

export default EmployeeTable;
import { useState, useEffect } from 'react';
import axios from 'axios';
import Api from '../../common/index';
import { FaTimes, FaUserPlus } from 'react-icons/fa';
import Spinner from '../Spinner';
import EmployeeModal from './EmployeeModal';
import EmployeeTable from './EmployeeTable';
import Pagination from '../Pagination';
import ROLE from '../../common/role';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [userDetails, setUserDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [editRole, setEditRole] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [roles] = useState(Object.values(ROLE));
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(10);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(Api.getEmployee.url);
            if (response.data.success) {
                setEmployees(response.data.data);
            } else {
                setError("Failed to fetch employees.");
            }
        } catch (error) {
            setError("Error fetching employees: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserDetails = async (id) => {
        try {
            const response = await axios.get(Api.EmployeeDetails.url.replace(':id', id));
            if (response.data.success) {
                setUserDetails(response.data.data);
                setShowDetailsModal(true);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError("Error fetching user details: " + error.message);
        }
    };

    const handleEditClick = (employee) => {
        setEditRole(employee);
        setNewRole(employee.role);
        setError('');
    };

    const handleRoleChange = (e) => {
        setNewRole(e.target.value);
    };

    const handleRoleSubmit = async () => {
        try {
            const response = await axios.put(Api.updateRole.url.replace(':id', editRole._id), { role: newRole });
            if (response.data.success) {
                setEditRole(null);
                setNewRole('');
                fetchEmployees();
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError("Error updating role: " + error.message);
        }
    };

    const cancelEdit = () => {
        setEditRole(null);
        setNewRole('');
    };

    const handleDeleteClick = (employeeId) => {
        setEmployeeToDelete(employeeId);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await axios.delete(`${Api.getEmployee.url}/${employeeToDelete}`);
            if (response.data.success) {
                fetchEmployees();
                setShowConfirm(false);
                setEmployeeToDelete(null);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError("Error deleting employee: " + error.message);
        }
    };

    const cancelDelete = () => {
        setShowConfirm(false);
        setEmployeeToDelete(null);
    };

    // Pagination logic
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);
    const totalPages = Math.ceil(employees.length / employeesPerPage);

    // Handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md space-y-4">
            <p className="mb-4">Here you can manage your Team, add new Members, or update/delete existing records.</p>
            <button
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-sm transition-transform transform hover:scale-105 flex items-center"
                onClick={() => setShowForm(true)}
            >
                <FaUserPlus className="mr-2" /> Add New Team Member
            </button>

            <EmployeeModal
                showForm={showForm}
                setShowForm={setShowForm}
                fetchEmployees={fetchEmployees}
                userDetails={userDetails}
                setUserDetails={setUserDetails}
                showDetailsModal={showDetailsModal}
                setShowDetailsModal={setShowDetailsModal}
            />

            {showConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="confirm-modal">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Deletion</h3>
                            <p>Are you sure you want to delete this Team Member?</p>
                            <div className="mt-4">
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 ml-4"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <EmployeeTable
                        employees={currentEmployees}
                        handleEditClick={handleEditClick}
                        handleDeleteClick={handleDeleteClick}
                        fetchUserDetails={fetchUserDetails}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={paginate}
                    />
                </>
            )}

            {editRole && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="edit-modal">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Role</h3>
                            {error && (
                                <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-300 rounded">
                                    {error}
                                </div>
                            )}
                            <div className="mt-2 text-left">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Select new Role</label>
                                <select
                                    value={newRole}
                                    onChange={handleRoleChange}
                                    className="mb-2 p-2 border rounded w-full"
                                >
                                    {roles.map(role => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={handleRoleSubmit}
                                    className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                                >
                                    Update Role
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={cancelEdit}
                            className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-800"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;


//OLD CODE WRITTEN IN ONE FILE
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import Api from '../../common/index';
// import { FaEdit, FaTrash, FaUserPlus, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
// import ROLE from '../../common/role';
// import Spinner from '../Spinner';

// const Employees = () => {
//     const [employees, setEmployees] = useState([]);
//     const [userDetails, setUserDetails] = useState(null);
//     const [showPassword, setShowPassword] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [showDetailsModal, setShowDetailsModal] = useState(false);
//     const [error, setError] = useState('');
//     const [showForm, setShowForm] = useState(false);
//     const [showConfirm, setShowConfirm] = useState(false);
//     const [employeeToDelete, setEmployeeToDelete] = useState(null);
//     const [editRole, setEditRole] = useState(null);
//     const [newRole, setNewRole] = useState('');
//     const [roles] = useState(Object.values(ROLE));
//     const [newEmployee, setNewEmployee] = useState({
//         name: '',
//         email: '',
//         password: '',
//         designation: '',
//         department: '',
//         dob: '',
//         mobileNo: '',
//         address: '',
//         cnic: '',
//         profilePicture: null
//     });
//     const [previewPicture, setPreviewPicture] = useState('');

//     useEffect(() => {
//         fetchEmployees();
//     }, []);

//     const fetchEmployees = async () => {
//         try {
//             const response = await axios.get(Api.getEmployee.url);
//             if (response.data.success) {
//                 setEmployees(response.data.data);
//             } else {
//                 setError("Failed to fetch employees.");
//             }
//         } catch (error) {
//             setError("Error fetching employees: " + error.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const fetchUserDetails = async (id) => {
//         try {
//             const response = await axios.get(Api.EmployeeDetails.url.replace(':id', id));
//             if (response.data.success) {
//                 setUserDetails(response.data.data);
//                 setShowDetailsModal(true);
//             } else {
//                 setError(response.data.message);
//             }
//         } catch (error) {
//             setError("Error fetching user details: " + error.message);
//         }
//     };


//     const handleUpdate = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();

//         Object.keys(userDetails).forEach(key => {
//             if (key === 'profilePicture' && userDetails[key] instanceof File) {
//                 formData.append('profilePicture', userDetails[key]);
//             } else if (key !== 'profilePicture' && userDetails[key] !== "" && userDetails[key] !== undefined) {
//                 formData.append(key, userDetails[key]);
//             }
//         });

//         try {
//             const response = await axios.put(Api.updateEmployee.url.replace(':id', userDetails._id), formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });
//             if (response.data.success) {
//                 setShowDetailsModal(false);

//                 // Update the employees list with the new data
//                 setEmployees(prevEmployees =>
//                     prevEmployees.map(emp =>
//                         emp._id === userDetails._id ? { ...emp, ...response.data.data } : emp
//                     )
//                 );

//                 setError('');
//             } else {
//                 setError(response.data.message);
//             }
//         } catch (error) {
//             console.error("Error updating user details:", error);
//             setError("Error updating user details: " + (error.response?.data?.message || error.message));
//         }
//     };





//     const handleInputChange = (e) => {
//         setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
//     };

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         setNewEmployee({ ...newEmployee, profilePicture: file });

//         const reader = new FileReader();
//         reader.onloadend = () => {
//             setPreviewPicture(reader.result);
//         };
//         if (file) {
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const formData = new FormData();
//         Object.keys(newEmployee).forEach(key => {
//             formData.append(key, newEmployee[key]);
//         });

//         try {
//             const response = await axios.post(Api.signUp.url, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });
//             if (response.data.success) {
//                 setShowForm(false);
//                 setNewEmployee({
//                     name: '',
//                     email: '',
//                     password: '',
//                     designation: '',
//                     department: '',
//                     dob: '',
//                     mobileNo: '',
//                     address: '',
//                     cnic: '',
//                     profilePicture: null
//                 });
//                 setPreviewPicture('');
//                 fetchEmployees();
//             } else {
//                 setError(response.data.message);
//             }
//         } catch (error) {
//             setError("Error adding employee: " + (error.response?.data?.message || error.message));
//         }
//     };

//     const formatDate = (dateString) => {
//         if (!dateString) return '';
//         const date = new Date(dateString);
//         return date.toISOString().split('T')[0];
//     };

//     const closeModal = () => {
//         setShowForm(false);
//         setError('');
//         setNewEmployee({
//             name: '',
//             email: '',
//             password: '',
//             designation: '',
//             department: '',
//             dob: '',
//             mobileNo: '',
//             address: '',
//             cnic: '',
//             profilePicture: null
//         });
//         setPreviewPicture(''); // Clear the preview picture
//     };

//     const handleEditClick = (employee) => {
//         setEditRole(employee);
//         setNewRole(employee.role);
//         setError('');
//     };

//     const handleRoleChange = (e) => {
//         setNewRole(e.target.value);
//     };

//     const handleRoleSubmit = async () => {
//         try {
//             const response = await axios.put(Api.updateRole.url.replace(':id', editRole._id), { role: newRole });
//             if (response.data.success) {
//                 setEditRole(null);
//                 setNewRole('');
//                 fetchEmployees();
//             } else {
//                 setError(response.data.message);
//             }
//         } catch (error) {
//             setError("Error updating role: " + error.message);
//         }
//     };

//     const cancelEdit = () => {
//         setEditRole(null);
//         setNewRole('');
//     };

//     const handleDeleteClick = (employeeId) => {
//         setEmployeeToDelete(employeeId);
//         setShowConfirm(true);
//     };

//     const confirmDelete = async () => {
//         try {
//             const response = await axios.delete(`${Api.getEmployee.url}/${employeeToDelete}`);
//             if (response.data.success) {
//                 fetchEmployees();
//                 setShowConfirm(false);
//                 setEmployeeToDelete(null);
//             } else {
//                 setError(response.data.message);
//             }
//         } catch (error) {
//             setError("Error deleting employee: " + error.message);
//         }
//     };

//     const cancelDelete = () => {
//         setShowConfirm(false);
//         setEmployeeToDelete(null);
//     };

//     return (
//         <div className="p-6 bg-gray-50 rounded-lg shadow-md space-y-4">
//             <p className="mb-4">Here you can manage your Team, add new Memebrs, or update/delete existing records.</p>
//             <button
//                 className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-sm transition-transform transform hover:scale-105 flex items-center"
//                 onClick={() => setShowForm(true)}
//             >
//                 <FaUserPlus className="mr-2" /> Add New Team Member
//             </button>
//             {showForm && (
//                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full mb-5" id="my-modal">
//                     <div className="relative top-20 mx-auto p-6 border w-3/4 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
//                         <div className="text-center mb-4">
//                             <h3 className="text-xl leading-6 font-medium text-gray-900">Add New Member</h3>
//                             {error && (
//                                 <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-300 rounded">
//                                     {error}
//                                 </div>
//                             )}
//                         </div>
//                         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div className="col-span-2 text-center">
//                                 <div className="mb-4">
//                                     <div className="relative w-32 h-32 mx-auto">
//                                         <label
//                                             htmlFor="profile-picture-upload"
//                                             className="flex items-center justify-center w-full h-full bg-gray-200 rounded-full cursor-pointer overflow-hidden"
//                                         >
//                                             {previewPicture ? (
//                                                 <img
//                                                     src={previewPicture}
//                                                     alt="Profile Preview"
//                                                     className="object-cover w-full h-full"
//                                                 />
//                                             ) : (
//                                                 <span className="text-gray-600">Add Profile Picture</span>
//                                             )}
//                                             <input
//                                                 type="file"
//                                                 id="profile-picture-upload"
//                                                 accept="image/*"
//                                                 onChange={handleFileChange}
//                                                 className="hidden"
//                                             />
//                                         </label>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="col-span-1">
//                                 <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     value={newEmployee.name}
//                                     onChange={handleInputChange}
//                                     placeholder="John Doe"
//                                     className="mb-2 p-3 border rounded w-full"
//                                     required
//                                 />
//                             </div>
//                             <div className="col-span-1">
//                                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     value={newEmployee.email}
//                                     onChange={handleInputChange}
//                                     placeholder="example@domain.com"
//                                     className="mb-2 p-3 border rounded w-full"
//                                     required
//                                 />
//                             </div>
//                             <div className="relative">
//                                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
//                                 <input
//                                     type={showPassword ? "text" : "password"}
//                                     name="password"
//                                     value={newEmployee.password}
//                                     onChange={handleInputChange}
//                                     placeholder="*****"
//                                     className="mb-2 p-3 border rounded w-full pr-12"
//                                     required
//                                 />
//                                 <div
//                                     className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center cursor-pointer"
//                                     onClick={() => setShowPassword(!showPassword)}
//                                 >
//                                     {showPassword ? (
//                                         <FaEye size={24} className="text-gray-600" />
//                                     ) : (
//                                         <FaEyeSlash size={24} className="text-gray-600" />
//                                     )}
//                                 </div>
//                             </div>
//                             <div className="col-span-1">
//                                 <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Designation</label>
//                                 <input
//                                     type="text"
//                                     name="designation"
//                                     value={newEmployee.designation}
//                                     onChange={handleInputChange}
//                                     placeholder="Team Member's Designation"
//                                     className="mb-2 p-3 border rounded w-full"
//                                     required
//                                 />
//                             </div>
//                             <div className="col-span-1">
//                                 <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
//                                 <input
//                                     type="text"
//                                     name="department"
//                                     value={newEmployee.department}
//                                     onChange={handleInputChange}
//                                     placeholder="Team Member's Department"
//                                     className="mb-2 p-3 border rounded w-full"
//                                     required
//                                 />
//                             </div>
//                             <div className="col-span-1">
//                                 <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
//                                 <input
//                                     type="date"
//                                     name="dob"
//                                     value={newEmployee.dob}
//                                     onChange={handleInputChange}
//                                     placeholder="Date of Birth"
//                                     className="mb-2 p-3 border rounded w-full"
//                                 />
//                             </div>
//                             <div className="col-span-1">
//                                 <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700">Contact No.</label>
//                                 <input
//                                     type="tel"
//                                     name="mobileNo"
//                                     value={newEmployee.mobileNo}
//                                     onChange={handleInputChange}
//                                     placeholder="Mobile Number"
//                                     className="mb-2 p-3 border rounded w-full"
//                                 />
//                             </div>
//                             <div className="col-span-1">
//                                 <label htmlFor="cnic" className="block text-sm font-medium text-gray-700">CNIC</label>
//                                 <input
//                                     type="text"
//                                     name="cnic"
//                                     value={newEmployee.cnic}
//                                     onChange={handleInputChange}
//                                     placeholder="Team Member's CNIC"
//                                     className="mb-2 p-3 border rounded w-full"
//                                 />
//                             </div>
//                             <div className="col-span-2">
//                                 <label htmlFor="address" className="block text-sm font-medium text-gray-700">Team Member Address</label>
//                                 <input
//                                     type="text"
//                                     name="address"
//                                     value={newEmployee.address}
//                                     onChange={handleInputChange}
//                                     placeholder="Address"
//                                     className="mb-2 p-3 border rounded w-full"
//                                 />
//                             </div>
//                             <div className="col-span-2 text-center">
//                                 <button
//                                     type="submit"
//                                     className="px-6 py-3 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
//                                 >
//                                     Add Member
//                                 </button>
//                             </div>
//                         </form>
//                         <button
//                             onClick={closeModal}
//                             className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
//                         >
//                             <FaTimes size={24} />
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {showConfirm && (
//                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="confirm-modal">
//                     <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//                         <div className="mt-3 text-center">
//                             <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Deletion</h3>
//                             <p>Are you sure you want to delete this Team Member?</p>
//                             <div className="mt-4">
//                                 <button
//                                     onClick={confirmDelete}
//                                     className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
//                                 >
//                                     Delete
//                                 </button>
//                                 <button
//                                     onClick={cancelDelete}
//                                     className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 ml-4"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                         <button
//                             onClick={cancelDelete}
//                             className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-800"
//                         >
//                             <FaTimes size={24} />
//                         </button>
//                     </div>
//                 </div>
//             )}
//             {isLoading ? (
//                 <Spinner />
//             ) : (
//                 <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
//                     <thead className='bg-gray-200 text-gray-800 uppercase text-sm font-semibold'>
//                         <tr>
//                             <th className="py-2 px-3 border-b border-gray-300">Name</th>
//                             <th className="py-2 px-3 border-b border-gray-300">Email</th>
//                             <th className="py-2 px-3 border-b border-gray-300">Designation</th>
//                             <th className="py-2 px-3 border-b border-gray-300">Department</th>
//                             <th className="py-2 px-3 border-b border-gray-300">Role</th>
//                             <th className="py-2 px-3 border-b border-gray-300">Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {employees.map((employee, index) => (
//                             <tr key={employee._id} className={`transition-colors duration-150 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}>
//                                 <td className="py-3 px-6 border-b border-gray-300 text-center text-base">{employee.name}</td>
//                                 <td className="py-3 px-6 border-b border-gray-300 text-center text-base">{employee.email}</td>
//                                 <td className="py-3 px-6 border-b border-gray-300 text-center text-base">{employee.designation || 'N/A'}</td>
//                                 <td className="py-3 px-6 border-b border-gray-300 text-center text-base">{employee.department || 'N/A'}</td>
//                                 <td className="py-3 px-6 border-b border-gray-300 text-center text-base">{employee.role}</td>
//                                 <td className="py-3 px-6 border-b border-gray-300 text-center text-base">
//                                     <button className="text-blue-500 hover:text-blue-700 mr-2" onClick={() => handleEditClick(employee)}>
//                                         <FaEdit size={20} />
//                                     </button>
//                                     <button
//                                         className="text-red-500 hover:text-red-700 mr-2"
//                                         onClick={() => handleDeleteClick(employee._id)}
//                                     >
//                                         <FaTrash size={20} />
//                                     </button>
//                                     <button
//                                         className="text-green-500 hover:text-green-700"
//                                         onClick={() => fetchUserDetails(employee._id)}
//                                     >
//                                         <FaEye size={20} />
//                                     </button>

//                                     {showDetailsModal && userDetails && (
//                                         <div className="fixed inset-0 bg-gray-600 bg-opacity-20 overflow-y-auto h-full w-full" id="details-modal">
//                                             <div className="relative top-20 mx-auto p-6 border w-3/4 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
//                                                 <div className="text-center mb-4">
//                                                     <h3 className="text-xl leading-6 font-medium text-gray-900">User Details</h3>
//                                                     {error && (
//                                                         <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-300 rounded">
//                                                             {error}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                                 <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                     <div className="col-span-2 text-center">
//                                                         <div className="mb-4">
//                                                             <div className="relative w-32 h-32 mx-auto">
//                                                                 <label
//                                                                     htmlFor="profile-picture-upload"
//                                                                     className="flex items-center justify-center w-full h-full bg-gray-200 rounded-full cursor-pointer overflow-hidden"
//                                                                 >
//                                                                     {userDetails.profilePicture ? (
//                                                                         <img
//                                                                             src={userDetails.profilePicture}
//                                                                             alt="Profile Preview"
//                                                                             className="object-cover w-full h-full"
//                                                                         />
//                                                                     ) : (
//                                                                         <span className="text-gray-600">Add Profile Picture</span>
//                                                                     )}
//                                                                     <input
//                                                                         type="file"
//                                                                         id="profile-picture-upload"
//                                                                         accept="image/*"
//                                                                         onChange={e => setUserDetails({ ...userDetails, profilePicture: e.target.files[0] })}
//                                                                         className="hidden"
//                                                                     />
//                                                                 </label>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     <div className="col-span-1 text-left">
//                                                         <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
//                                                         <input
//                                                             type="text"
//                                                             name="name"
//                                                             value={userDetails.name}
//                                                             onChange={e => setUserDetails({ ...userDetails, name: e.target.value })}
//                                                             placeholder="Full Name"
//                                                             className="mb-2 p-3 border rounded w-full"
//                                                             required
//                                                         />
//                                                     </div>

//                                                     <div className="col-span-1 text-left">
//                                                         <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
//                                                         <input
//                                                             type="email"
//                                                             name="email"
//                                                             value={userDetails.email}
//                                                             onChange={e => setUserDetails({ ...userDetails, email: e.target.value })}
//                                                             placeholder="Email"
//                                                             className="mb-2 p-3 border rounded w-full"
//                                                             required
//                                                         />
//                                                     </div>
//                                                     <div className="col-span-1 text-left">
//                                                         <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Designation</label>
//                                                         <input
//                                                             type="text"
//                                                             name="designation"
//                                                             value={userDetails.designation}
//                                                             onChange={e => setUserDetails({ ...userDetails, designation: e.target.value })}
//                                                             placeholder="Designation"
//                                                             className="mb-2 p-3 border rounded w-full"
//                                                             required
//                                                         />
//                                                     </div>
//                                                     <div className="col-span-1 text-left">
//                                                         <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
//                                                         <input
//                                                             type="text"
//                                                             name="department"
//                                                             value={userDetails.department}
//                                                             onChange={e => setUserDetails({ ...userDetails, department: e.target.value })}
//                                                             placeholder="Department"
//                                                             className="mb-2 p-3 border rounded w-full"
//                                                             required
//                                                         />
//                                                     </div>
//                                                     <div className="col-span-1 text-left">
//                                                         <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
//                                                         <input
//                                                             type="date"
//                                                             name="dob"
//                                                             value={formatDate(userDetails.dob)}
//                                                             onChange={e => setUserDetails({ ...userDetails, dob: e.target.value })}
//                                                             className="mb-2 p-3 border rounded w-full"
//                                                         />
//                                                     </div>
//                                                     <div className="col-span-1 text-left">
//                                                         <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700">Mobile Number</label>
//                                                         <input
//                                                             type="tel"
//                                                             name="mobileNo"
//                                                             value={userDetails.mobileNo}
//                                                             onChange={e => setUserDetails({ ...userDetails, mobileNo: e.target.value })}
//                                                             placeholder="Mobile Number"
//                                                             className="mb-2 p-3 border rounded w-full"
//                                                         />
//                                                     </div>
//                                                     <div className="col-span-1 text-left">
//                                                         <label htmlFor="cnic" className="block text-sm font-medium text-gray-700">CNIC</label>
//                                                         <input
//                                                             type="text"
//                                                             name="cnic"
//                                                             value={userDetails.cnic}
//                                                             onChange={e => setUserDetails({ ...userDetails, cnic: e.target.value })}
//                                                             placeholder="CNIC"
//                                                             className="mb-2 p-3 border rounded w-full"
//                                                         />
//                                                     </div>
//                                                     <div className="col-span-2 text-left">
//                                                         <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
//                                                         <input
//                                                             type="text"
//                                                             name="address"
//                                                             value={userDetails.address}
//                                                             onChange={e => setUserDetails({ ...userDetails, address: e.target.value })}
//                                                             placeholder="Address"
//                                                             className="mb-2 p-3 border rounded w-full"
//                                                         />
//                                                     </div>
//                                                     <div className="col-span-2 text-center">
//                                                         <button
//                                                             type="submit"
//                                                             className="px-6 py-3 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
//                                                         >
//                                                             Update Details
//                                                         </button>
//                                                     </div>
//                                                 </form>
//                                                 <button
//                                                     onClick={() => setShowDetailsModal(false)}
//                                                     className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
//                                                 >
//                                                     <FaTimes size={24} />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     )}


//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}

//             {editRole && (
//                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="edit-modal">
//                     <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//                         <div className="mt-3 text-center">
//                             <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Role</h3>
//                             {error && (
//                                 <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-300 rounded">
//                                     {error}
//                                 </div>
//                             )}
//                             <div className="mt-2 text-left">
//                                 <label className="block mb-2 text-sm font-medium text-gray-700">Select new Role</label>
//                                 <select
//                                     value={newRole}
//                                     onChange={handleRoleChange}
//                                     className="mb-2 p-2 border rounded w-full"
//                                 >
//                                     {roles.map(role => (
//                                         <option key={role} value={role}>
//                                             {role}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div className="items-center px-4 py-3">
//                                 <button
//                                     onClick={handleRoleSubmit}
//                                     className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
//                                 >
//                                     Update Role
//                                 </button>
//                             </div>
//                         </div>
//                         <button
//                             onClick={cancelEdit}
//                             className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-800"
//                         >
//                             <FaTimes size={24} />
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Employees;
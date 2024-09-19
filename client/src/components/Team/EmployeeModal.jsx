import { useState } from 'react';
import axios from 'axios';
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import Api from '../../common/index';
import PropTypes from 'prop-types';

const EmployeeModal = ({ showForm, setShowForm, fetchEmployees, userDetails, setUserDetails, showDetailsModal, setShowDetailsModal }) => {
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        name: '',
        email: '',
        password: '',
        designation: '',
        department: '',
        dob: '',
        mobileNo: '',
        address: '',
        cnic: '',
        profilePicture: null
    });
    const [previewPicture, setPreviewPicture] = useState('');

    const handleInputChange = (e) => {
        setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNewEmployee({ ...newEmployee, profilePicture: file });

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewPicture(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(newEmployee).forEach(key => {
            formData.append(key, newEmployee[key]);
        });

        try {
            const response = await axios.post(Api.signUp.url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                setShowForm(false);
                setNewEmployee({
                    name: '',
                    email: '',
                    password: '',
                    designation: '',
                    department: '',
                    dob: '',
                    mobileNo: '',
                    address: '',
                    cnic: '',
                    profilePicture: null
                });
                setPreviewPicture('');
                fetchEmployees();
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError("Error adding employee: " + (error.response?.data?.message || error.message));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.keys(userDetails).forEach(key => {
            if (key === 'profilePicture' && userDetails[key] instanceof File) {
                formData.append('profilePicture', userDetails[key]);
            } else if (key !== 'profilePicture' && userDetails[key] !== "" && userDetails[key] !== undefined) {
                formData.append(key, userDetails[key]);
            }
        });

        try {
            const response = await axios.put(Api.updateEmployee.url.replace(':id', userDetails._id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                setShowDetailsModal(false);
                fetchEmployees();
                setError('');
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error("Error updating user details:", error);
            setError("Error updating user details: " + (error.response?.data?.message || error.message));
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const closeModal = () => {
        setShowForm(false);
        setError('');
        setNewEmployee({
            name: '',
            email: '',
            password: '',
            designation: '',
            department: '',
            dob: '',
            mobileNo: '',
            address: '',
            cnic: '',
            profilePicture: null
        });
        setPreviewPicture('');
    };

    return (
        <>
            {showForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full mb-5" id="my-modal">
                    <div className="relative top-20 mx-auto p-6 border w-3/4 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="text-center mb-4">
                            <h3 className="text-xl leading-6 font-medium text-gray-900">Add New Member</h3>
                            {error && (
                                <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-300 rounded">
                                    {error}
                                </div>
                            )}
                        </div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 z-10">
                            <div className="col-span-2 text-center">
                                <div className="mb-4">
                                    <div className="relative w-32 h-32 mx-auto">
                                        <label
                                            htmlFor="profile-picture-upload"
                                            className="flex items-center justify-center w-full h-full bg-gray-200 rounded-full cursor-pointer overflow-hidden"
                                        >
                                            {previewPicture ? (
                                                <img
                                                    src={previewPicture}
                                                    alt="Profile Preview"
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <span className="text-gray-600">Add Profile Picture</span>
                                            )}
                                            <input
                                                type="file"
                                                id="profile-picture-upload"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newEmployee.name}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    className="mb-2 p-3 border rounded w-full"
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={newEmployee.email}
                                    onChange={handleInputChange}
                                    placeholder="example@domain.com"
                                    className="mb-2 p-3 border rounded w-full"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={newEmployee.password}
                                    onChange={handleInputChange}
                                    placeholder="*****"
                                    className="mb-2 p-3 border rounded w-full pr-12"
                                    required
                                />
                                <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <FaEye size={24} className="text-gray-600" />
                                    ) : (
                                        <FaEyeSlash size={24} className="text-gray-600" />
                                    )}
                                </div>
                            </div>
                            <div className="col-span-1">
                                <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Designation</label>
                                <input
                                    type="text"
                                    name="designation"
                                    value={newEmployee.designation}
                                    onChange={handleInputChange}
                                    placeholder="Team Member's Designation"
                                    className="mb-2 p-3 border rounded w-full"
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={newEmployee.department}
                                    onChange={handleInputChange}
                                    placeholder="Team Member's Department"
                                    className="mb-2 p-3 border rounded w-full"
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={newEmployee.dob}
                                    onChange={handleInputChange}
                                    placeholder="Date of Birth"
                                    className="mb-2 p-3 border rounded w-full"
                                />
                            </div>
                            <div className="col-span-1">
                                <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700">Contact No.</label>
                                <input
                                    type="tel"
                                    name="mobileNo"
                                    value={newEmployee.mobileNo}
                                    onChange={handleInputChange}
                                    placeholder="Mobile Number"
                                    className="mb-2 p-3 border rounded w-full"
                                />
                            </div>
                            <div className="col-span-1">
                                <label htmlFor="cnic" className="block text-sm font-medium text-gray-700">CNIC</label>
                                <input
                                    type="text"
                                    name="cnic"
                                    value={newEmployee.cnic}
                                    onChange={handleInputChange}
                                    placeholder="Team Member's CNIC"
                                    className="mb-2 p-3 border rounded w-full"
                                />
                            </div>
                            <div className="col-span-2">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Team Member Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={newEmployee.address}
                                    onChange={handleInputChange}
                                    placeholder="Address"
                                    className="mb-2 p-3 border rounded w-full"
                                />
                            </div>
                            <div className="col-span-2 text-center">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                                >
                                    Add Member
                                </button>
                            </div>
                        </form>
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>
                </div>
            )}

            {showDetailsModal && userDetails && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-20 overflow-y-auto h-full w-full z-10" id="details-modal">
                    <div className="relative top-20 mx-auto p-6 border w-3/4 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="text-center mb-4">
                            <h3 className="text-xl leading-6 font-medium text-gray-900">User Details</h3>
                            {error && (
                                <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-300 rounded">
                                    {error}
                                </div>
                            )}
                        </div>
                        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2 text-center">
                                <div className="mb-4">
                                    <div className="relative w-32 h-32 mx-auto">
                                        <label
                                            htmlFor="profile-picture-upload"
                                            className="flex items-center justify-center w-full h-full bg-gray-200 rounded-full cursor-pointer overflow-hidden"
                                        >
                                            {userDetails.profilePicture ? (
                                                <img
                                                    src={userDetails.profilePicture}
                                                    alt="Profile Preview"
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <span className="text-gray-600">Add Profile Picture</span>
                                            )}
                                            <input
                                                type="file"
                                                id="profile-picture-upload"
                                                accept="image/*"
                                                onChange={e => setUserDetails({ ...userDetails, profilePicture: e.target.files[0] })}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-1 text-left">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={userDetails.name}
                                    onChange={e => setUserDetails({ ...userDetails, name: e.target.value })}
                                    placeholder="Full Name"
                                    className="mb-2 p-3 border rounded w-full"
                                    required
                                />
                            </div>

                            <div className="col-span-1 text-left">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userDetails.email}
                                    onChange={e => setUserDetails({ ...userDetails, email: e.target.value })}
                                    placeholder="Email"
                                    className="mb-2 p-3 border rounded w-full"
                                    required
                                />
                            </div>
                            <div className="col-span-1 text-left">
                                <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Designation</label>
                                <input
                                    type="text"
                                    name="designation"
                                    value={userDetails.designation}
                                    onChange={e => setUserDetails({ ...userDetails, designation: e.target.value })}
                                    placeholder="Designation"
                                    className="mb-2 p-3 border rounded w-full"
                                    required
                                />
                            </div>
                            <div className="col-span-1 text-left">
                                <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={userDetails.department}
                                    onChange={e => setUserDetails({ ...userDetails, department: e.target.value })}
                                    placeholder="Department"
                                    className="mb-2 p-3 border rounded w-full"
                                    required
                                />
                            </div>
                            <div className="col-span-1 text-left">
                                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formatDate(userDetails.dob)}
                                    onChange={e => setUserDetails({ ...userDetails, dob: e.target.value })}
                                    className="mb-2 p-3 border rounded w-full"
                                />
                            </div>
                            <div className="col-span-1 text-left">
                                <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobileNo"
                                    value={userDetails.mobileNo}
                                    onChange={e => setUserDetails({ ...userDetails, mobileNo: e.target.value })}
                                    placeholder="Mobile Number"
                                    className="mb-2 p-3 border rounded w-full"
                                />
                            </div>
                            <div className="col-span-1 text-left">
                                <label htmlFor="cnic" className="block text-sm font-medium text-gray-700">CNIC</label>
                                <input
                                    type="text"
                                    name="cnic"
                                    value={userDetails.cnic}
                                    onChange={e => setUserDetails({ ...userDetails, cnic: e.target.value })}
                                    placeholder="CNIC"
                                    className="mb-2 p-3 border rounded w-full"
                                />
                            </div>
                            <div className="col-span-2 text-left">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={userDetails.address}
                                    onChange={e => setUserDetails({ ...userDetails, address: e.target.value })}
                                    placeholder="Address"
                                    className="mb-2 p-3 border rounded w-full"
                                />
                            </div>
                            <div className="col-span-2 text-center">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                                >
                                    Update Details
                                </button>
                            </div>
                        </form>
                        <button
                            onClick={() => setShowDetailsModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

EmployeeModal.propTypes = {
    showForm: PropTypes.bool.isRequired,
    setShowForm: PropTypes.func.isRequired,
    fetchEmployees: PropTypes.func.isRequired,
    userDetails: PropTypes.object,
    setUserDetails: PropTypes.func.isRequired,
    showDetailsModal: PropTypes.bool.isRequired,
    setShowDetailsModal: PropTypes.func.isRequired
};

export default EmployeeModal;
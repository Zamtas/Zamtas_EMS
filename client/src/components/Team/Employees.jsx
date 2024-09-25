import { useState, useEffect } from "react";
import axios from "axios";
import Api from "../../common/index";
import { FaTimes, FaUserPlus } from "react-icons/fa";
import Spinner from "../Spinner";
import EmployeeModal from "./EmployeeModal";
import EmployeeTable from "./EmployeeTable";
import Pagination from "../Pagination";
import ROLE from "../../common/role";
import TableFilter from "../TableFilter";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [editRole, setEditRole] = useState(null);
  const [newRole, setNewRole] = useState("");
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
        setFilteredEmployees(response.data.data); // Initially, filtered employees are all employees
      } else {
        setError("Failed to fetch employees.");
      }
    } catch (error) {
      setError("Error fetching employees: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = employees.filter((employee) =>
      employee.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredEmployees(filtered);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  const handleSort = (order) => {
    const sorted = [...filteredEmployees].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return order === "asc"
        ? nameA < nameB
          ? -1
          : 1
        : nameA > nameB
        ? -1
        : 1;
    });
    setFilteredEmployees(sorted);
    setCurrentPage(1); // Reset to the first page after sorting
  };

  const fetchUserDetails = async (id) => {
    try {
      const response = await axios.get(
        Api.EmployeeDetails.url.replace(":id", id)
      );
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
    setError("");
  };

  const handleRoleChange = (e) => {
    setNewRole(e.target.value);
  };

  const handleRoleSubmit = async () => {
    try {
      const response = await axios.put(
        Api.updateRole.url.replace(":id", editRole._id),
        { role: newRole }
      );
      if (response.data.success) {
        setEditRole(null);
        setNewRole("");
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
    setNewRole("");
  };

  const handleDeleteClick = (employeeId) => {
    setEmployeeToDelete(employeeId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${Api.getEmployee.url}/${employeeToDelete}`
      );
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
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md space-y-4">
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
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="confirm-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Confirm Deletion
              </h3>
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
      <TableFilter onSearch={handleSearch} onSort={handleSort} />

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
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="edit-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Edit Role
              </h3>
              {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-300 rounded">
                  {error}
                </div>
              )}
              <div className="mt-2 text-left">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Select new Role
                </label>
                <select
                  value={newRole}
                  onChange={handleRoleChange}
                  className="mb-2 p-2 border rounded w-full"
                >
                  {roles.map((role) => (
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

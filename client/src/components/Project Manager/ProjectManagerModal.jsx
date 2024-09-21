import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaTimes,
  FaUser,
} from "react-icons/fa";

const ProjectManagerModal = ({
  isOpen,
  onClose,
  onAdd,
  onSave,
  manager,
  mode,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    department: "",
  });

  useEffect(() => {
    if (mode === "edit" || mode === "view") {
      setFormData({
        name: manager?.name || "",
        contact: manager?.contact || "",
        email: manager?.email || "",
        department: manager?.department || "",
      });
    } else {
      // Clear form data for 'add' mode
      setFormData({
        name: "",
        contact: "",
        email: "",
        department: "",
      });
    }
  }, [manager, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (mode === "edit") {
      onSave(manager._id, formData);
    } else if (mode === "add") {
      onAdd(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
      <div
        className={`bg-white rounded-xl shadow-2xl w-11/12 md:w-3/4 lg:w-1/2 p-8 transform transition-transform duration-300 ease-out ${
          mode === "view" ? "border-t-8 border-blue-500" : ""
        } scale-100 hover:scale-105`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2
            className={`text-3xl font-extrabold ${
              mode === "view" ? "text-blue-600" : "text-gray-700"
            } tracking-wide`}
          >
            {mode === "edit"
              ? "Edit Project Manager"
              : mode === "view"
              ? "View Project Manager"
              : "Add Project Manager"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-700 hover:text-gray-900 text-3xl font-bold transition-colors duration-300"
          >
            <FaTimes />
          </button>
        </div>

        {/* View Mode Specific Styles */}
        {mode === "view" ? (
          <div className="space-y-8">
            {/* Name Section */}
            <div className="p-4 rounded-lg shadow-lg border border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-2">
                <FaUser className="text-gray-500" />
                <p className="font-medium text-gray-500">Name</p>
              </div>
              <p className="text-xl font-semibold text-blue-600 mt-1">
                {formData.name || "N/A"}
              </p>
            </div>

            {/* Contact Section */}
            <div className="p-4 rounded-lg shadow-lg border border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-2">
                <FaPhone className="text-gray-500" />
                <p className="font-medium text-gray-500">Contact</p>
              </div>
              <p className="text-xl font-semibold text-blue-600 mt-1">
                {formData.contact || "N/A"}
              </p>
            </div>

            {/* Email Section */}
            <div className="p-4 rounded-lg shadow-lg border border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-gray-500" />
                <p className="font-medium text-gray-500">Email</p>
              </div>
              <p className="text-xl font-semibold text-blue-600 mt-1">
                {formData.email || "N/A"}
              </p>
            </div>

            {/* Department Section */}
            <div className="p-4 rounded-lg shadow-lg border border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-2">
                <FaBuilding className="text-gray-500" />
                <p className="font-medium text-gray-500">Department</p>
              </div>
              <p className="text-xl font-semibold text-blue-600 mt-1">
                {formData.department || "N/A"}
              </p>
            </div>
          </div>
        ) : (
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                readOnly={mode === "view"}
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
                readOnly={mode === "view"}
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
                readOnly={mode === "view"}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                readOnly={mode === "view"}
              />
            </div>
          </form>
        )}

        {/* Footer Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          {mode === "view" ? (
            <button
              type="button"
              onClick={onClose}
              className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-sm hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Close
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-sm hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                {mode === "add" ? "Add Project Manager" : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-6 py-3 rounded-md shadow-sm hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
              >
                Cancel
              </button>
            </>
          )}
        </div>
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
  mode: PropTypes.oneOf(["view", "edit", "add"]).isRequired, // Add 'add' mode
};

export default ProjectManagerModal;

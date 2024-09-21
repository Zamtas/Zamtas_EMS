import { FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";
import moment from "moment";

const ProjectDetailsModal = ({ project, onClose }) => {
  if (!project) return null;

  const product = project.productId || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-8 m-4 max-h-[90vh] overflow-y-auto transform transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-extrabold text-indigo-600">
            Project Overview
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 text-2xl transition-colors duration-300"
          >
            <FaTimes />
          </button>
        </div>

        {/* Project Details Section */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-700 mb-4 border-b-2 border-indigo-600 pb-2">
            Project Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-lg font-semibold text-gray-800">
                Project Name
              </p>
              <p className="text-xl text-gray-600">
                {project.projectName || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">Project ID</p>
              <p className="text-xl text-gray-600">
                {project.projectId || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">Start Date</p>
              <p className="text-xl text-gray-600">
                {project.startDate
                  ? moment(project.startDate).format("LL")
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">End Date</p>
              <p className="text-xl text-gray-600">
                {project.endDate ? moment(project.endDate).format("LL") : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">
                Project Manager
              </p>
              <p className="text-xl text-gray-600">
                {project.projectManager?.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">Location</p>
              <p className="text-xl text-gray-600">
                {project.location || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">Budget</p>
              <p className="text-xl text-gray-600">{project.budget || "N/A"}</p>
            </div>
          </div>
        </section>

        {/* Client Details Section */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-700 mb-4 border-b-2 border-indigo-600 pb-2">
            Client Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-lg font-semibold text-gray-800">Client Name</p>
              <p className="text-xl text-gray-600">
                {project.clientId?.clientName || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">
                Client Contact
              </p>
              <p className="text-xl text-gray-600">
                {project.clientContact || "N/A"}
              </p>
            </div>
          </div>
        </section>

        {/* Product Details Section */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-700 mb-4 border-b-2 border-indigo-600 pb-2">
            Product Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-lg font-semibold text-gray-800">
                Product Name
              </p>
              <p className="text-xl text-gray-600">{product.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">
                Product Quantity
              </p>
              <p className="text-xl text-gray-600">
                {project.quantity || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">
                Product Model
              </p>
              <p className="text-xl text-gray-600">{product.model || "N/A"}</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">
                Product Category
              </p>
              <p className="text-xl text-gray-600">
                {product.category || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">
                Product Subcategory
              </p>
              <p className="text-xl text-gray-600">
                {product.subcategory || "N/A"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

ProjectDetailsModal.propTypes = {
  project: PropTypes.shape({
    projectName: PropTypes.string,
    projectId: PropTypes.string,
    clientId: PropTypes.shape({
      clientName: PropTypes.string,
    }),
    clientContact: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    projectManager: PropTypes.shape({
      name: PropTypes.string,
    }),
    location: PropTypes.string,
    budget: PropTypes.number,
    productId: PropTypes.shape({
      name: PropTypes.string,
      quantity: PropTypes.number,
      model: PropTypes.string,
      category: PropTypes.string,
      subcategory: PropTypes.string,
    }),
    quantity: PropTypes.number,
  }),
  onClose: PropTypes.func.isRequired,
};

export default ProjectDetailsModal;

import { FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';
import moment from 'moment';

const ProjectDetailsModal = ({ project, onClose }) => {
    if (!project) return null;

    const product = project.productId || {};

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg w-full max-w-4xl p-8 m-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">Project Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-700 hover:text-gray-900 text-2xl"
                    >
                        <FaTimes />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Existing project fields */}
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700">Project Name</label>
                        <div className="border border-gray-300 rounded-md p-2">{project.projectName}</div>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700">Project ID</label>
                        <div className="border border-gray-300 rounded-md p-2">{project.projectId}</div>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700">Client Name</label>
                        <div className="border border-gray-300 rounded-md p-2">{project.clientId?.clientName}</div>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700">Client Contact</label>
                        <div className="border border-gray-300 rounded-md p-2">{project.clientContact}</div>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700">Start Date</label>
                        <div className="border border-gray-300 rounded-md p-2">{moment(project.startDate).format('LL')}</div>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700">End Date</label>
                        <div className="border border-gray-300 rounded-md p-2">{moment(project.endDate).format('LL')}</div>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700">Project Manager</label>
                        <div className="border border-gray-300 rounded-md p-2">{project.projectManager?.name}</div>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700">Location</label>
                        <div className="border border-gray-300 rounded-md p-2">{project.location}</div>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700">Budget</label>
                        <div className="border border-gray-300 rounded-md p-2">{project.budget}</div>
                    </div>

                    {/* Product details */}
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700">Product Name</label>
                        <div className="border border-gray-300 rounded-md p-2">{product.name || 'N/A'}</div>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700">Product Quantity</label>
                        <div className="border border-gray-300 rounded-md p-2">{project.quantity || 'N/A'}</div>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700">Product Model</label>
                        <div className="border border-gray-300 rounded-md p-2">{product.model || 'N/A'}</div>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700">Product Category</label>
                        <div className="border border-gray-300 rounded-md p-2">{product.category || 'N/A'}</div>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700">Product Subcategory</label>
                        <div className="border border-gray-300 rounded-md p-2">{product.subcategory || 'N/A'}</div>
                    </div>
                </div>
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
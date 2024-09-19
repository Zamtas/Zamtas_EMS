import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import ProductDetails from './ProductDetails';
import logo from '../../assets/logo.png';

const ProductionSheet = () => {
    const { state } = useLocation();
    const project = state?.project;

    if (!project) {
        return <div>No project data available</div>;
    }

    // Safely access nested properties with fallbacks for undefined values
    const clientName = project?.clientId?.clientName || 'N/A';
    const clientContact = project?.clientContact || 'N/A';
    const projectName = project?.projectName || 'N/A';
    const location = project?.location || 'N/A';
    const projectManagerName = project?.projectManager?.name || 'N/A';
    const startDate = project?.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A';
    const endDate = project?.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A';

    // Product details
    const product = project?.productId || {};
    const productName = product?.name || 'N/A';
    const productModel = product?.model || 'N/A';
    const productCategory = product?.category || 'N/A';
    const productSubcategory = product?.subcategory || 'N/A';
    const productQuantity = project?.quantity || 'N/A';
    const projectId = project?._id || 'N/A';
    const projectID = project?.projectId || 'N/A';

    return (
        <div className="p-10 bg-gray-100">
            <img
                src={logo}
                alt="Logo"
                className="absolute top-4 left-4 w-32 h-auto mix-blend-multiply"
            />
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">
                ZAMTAS Product Sheet
            </h2>

            <div className='text-gray-900 text-right'>
                Last Updated By: admin
            </div>

            <div className="border border-gray-300 mb-4">
                {/* Client Information */}
                <div className="flex">
                    <div className="w-1/2 p-4 border-r border-b border-gray-300">
                        <label className="font-bold">Client Name</label>
                        <input
                            type="text"
                            value={clientName}
                            className="border-b border-gray-300 w-full p-2"
                            readOnly
                        />
                    </div>
                    <div className="w-1/2 p-4 border-b border-gray-300">
                        <label className="font-bold">Client Contact</label>
                        <input
                            type="text"
                            value={clientContact}
                            className="border-b border-gray-300 w-full p-2"
                            readOnly
                        />
                    </div>
                </div>

                {/* Project Information */}
                <div className="flex">
                    <div className="w-full p-4 border-r border-b border-gray-300">
                        <label className="font-bold">Project Name</label>
                        <input
                            type="text"
                            value={projectName || ''}
                            className="border-b border-gray-300 w-full p-2"
                            readOnly
                        />
                    </div>
                </div>

                <div className="flex">
                    <div className="w-full p-4 border-b border-gray-300">
                        <label className="font-bold">Project Location</label>
                        <input
                            type="text"
                            value={location || ''}
                            className="border-b border-gray-300 w-full p-2"
                            readOnly
                        />
                    </div>
                </div>

                <div className="flex">
                    <div className="w-full p-4 border-b border-gray-300">
                        <label className="font-bold">Project Manager</label>
                        <input
                            type="text"
                            value={projectManagerName}
                            className="border-b border-gray-300 w-full p-2"
                            readOnly
                        />
                    </div>
                </div>

                <div className="flex">
                    <div className="w-1/3 p-4 border-r border-gray-300">
                        <label className="font-bold">Start Date</label>
                        <input
                            type="text"
                            value={startDate}
                            className="border-b border-gray-300 w-full p-2"
                            readOnly
                        />
                    </div>
                    <div className="w-1/3 p-4 border-r border-gray-300">
                        <label className="font-bold">End Date</label>
                        <input
                            type="text"
                            value={endDate}
                            className="border-b border-gray-300 w-full p-2"
                            readOnly
                        />
                    </div>
                    <div className="w-1/3 p-4">
                        <label className="font-bold">Project ID</label>
                        <input
                            type="text"
                            value={projectID}
                            className="border-b border-gray-300 w-full p-2"
                            readOnly
                        />
                    </div>
                </div>

                {/* Product Information */}
                <div className="flex">
                    <div className="w-1/3 p-4 border-r border-gray-300">
                        <label className="font-bold">Product</label>
                        <input
                            type="text"
                            value={productName}
                            className="border-b border-gray-300 w-full p-2"
                            readOnly
                        />
                    </div>
                    <div className="w-1/3 p-4 border-r border-gray-300">
                        <label className="font-bold">QTY</label>
                        <input
                            type="text"
                            value={productQuantity}
                            className="border-b border-gray-300 w-full p-2"
                            readOnly
                        />
                    </div>
                    <div className="w-1/3 p-4">
                        <label className="font-bold">Model</label>
                        <input
                            type="text"
                            value={productModel}
                            className="border-b border-gray-300 w-full p-2"
                            readOnly
                        />
                    </div>
                </div>

                <div className="flex">
                    <div className="w-1/2 p-4 border-r border-gray-300">
                        <label className="font-bold">Product Category</label>
                        <input
                            type="text"
                            value={productCategory}
                            className="border-b border-gray-300 w-full p-2"
                            readOnly
                        />
                    </div>
                    <div className="w-1/2 p-4">
                        <label className="font-bold">Product Subcategory</label>
                        <input
                            type="text"
                            value={productSubcategory}
                            className="border-b border-gray-300 w-full p-2"
                            readOnly
                        />
                    </div>
                </div>
                <ProductDetails projectId={projectId} />

            </div>
        </div>
    );
};

ProductionSheet.propTypes = {
    project: PropTypes.object,
};

export default ProductionSheet;

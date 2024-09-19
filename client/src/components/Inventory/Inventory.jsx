import { useState } from 'react';
import ProductForm from './ProductForm';
import ProductList from './ProductList';

const Inventory = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);

    const handleAddClick = () => {
        setSelectedProduct(null);
        setShowAddModal(true);
    };

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setShowEditModal(true);
    };

    const handleViewClick = (product) => {
        setSelectedProduct(product);
        setShowViewModal(true);
    };

    const handleSave = () => {
        setShowAddModal(false);
        setShowEditModal(false);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowViewModal(false);
    };

    return (
        <div className="container mx-auto p-4">
            <button
                className="bg-blue-500 text-white py-2 px-4 rounded mb-4 hover:bg-blue-600 transition"
                onClick={handleAddClick}
            >
                Add Product
            </button>
            <ProductList
                onEditClick={handleEditClick}
                onDelete={handleSave}
                onViewClick={handleViewClick}
            />
            {showAddModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <ProductForm
                            product={null}
                            onSave={handleSave}
                            onClose={handleCloseModal}
                        />
                    </div>
                </div>
            )}
            {showEditModal && selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <ProductForm
                            product={selectedProduct}
                            onSave={handleSave}
                            onClose={handleCloseModal}
                        />
                    </div>
                </div>
            )}
            {showViewModal && selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-lg w-full">
                        <div className="bg-blue-500 p-4">
                            <h1 className="text-xl font-bold text-white">Product Details</h1>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center space-x-4">
                                <span className="font-semibold text-gray-600">Name:</span>
                                <span className="text-gray-800">{selectedProduct.name}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="font-semibold text-gray-600">Quantity:</span>
                                <span className="text-gray-800">{selectedProduct.quantity}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="font-semibold text-gray-600">Model:</span>
                                <span className="text-gray-800">{selectedProduct.model}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="font-semibold text-gray-600">Category:</span>
                                <span className="text-gray-800">{selectedProduct.category}</span>
                            </div>
                            <div className="flex items-start space-x-4">
                                <span className="font-semibold text-gray-600">Sub Category:</span>
                                <span className="text-gray-800">{selectedProduct.subcategory || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="bg-gray-100 px-6 py-4 flex justify-end">
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                                onClick={handleCloseModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Inventory;

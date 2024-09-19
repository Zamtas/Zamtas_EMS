import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Api from '../../common/index';

const ProductForm = ({ product, onSave, onClose }) => {
    const [name, setName] = useState(product ? product.name : '');
    const [quantity, setQuantity] = useState(product ? product.quantity : 0);
    const [model, setModel] = useState(product ? product.model : '');
    const [category, setCategory] = useState(product ? product.category : '');
    const [subcategory, setSubcategory] = useState(product ? product.subcategory : '');
    const [showAddSubcategory, setShowAddSubcategory] = useState(false); // For toggling subcategory input
    const [error, setError] = useState('');

    const categories = {
        "Automatic Doors": [
            "Automatic Sliding Doors",
            "Automatic Swing Doors",
            "Automatic Door Sensors"
        ],
        "Automatic Industrial Doors": [
            "Industrial Doors",
            "Motor Kits, Sensors and Parts",
            "Industrial Air Showers"
        ],
        "Automatic Gate Motors": [
            "Sliding Gate Operators",
            "Swing Gate Operators"
        ],
        "Automatic Traffic Barriers": [
            "Traffic Boom Barriers",
            "Traffic Bollards and Blockers"
        ],
        "Fire Rated Doors": [],
        "Auto Garage Doors": [
            "Sectional Garage Doors"
        ],
        "Pedestrian Entry Control": [],
        "Traffic Products and Solutions": [
            "Traffic Signals",
            "Traffic Signals Controller",
            "Road Safety",
            "Urban Lighting"
        ],
        "Water Heating": []
    };

    useEffect(() => {
        if (product) {
            setName(product.name);
            setQuantity(product.quantity);
            setModel(product.model);
            setCategory(product.category);
            setSubcategory(product.subcategory);
        }
    }, [product]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (quantity < 0) {
            setError('Quantity cannot be negative');
            return;
        }

        const url = product ? Api.updateProduct.url.replace(':id', product._id) : Api.addProduct.url;
        const method = product ? Api.updateProduct.method : Api.addProduct.method;

        axios({ method, url, data: { name, quantity, model, category, subcategory } })
            .then(() => {
                onSave();
                onClose();
            })
            .catch(error => console.error(error));
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value >= 0) {
            setQuantity(value);
            setError('');
        } else {
            setError('Quantity cannot be negative');
        }
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setCategory(selectedCategory);
        setSubcategory(''); // Reset subcategory when category changes
        setShowAddSubcategory(false); // Hide subcategory input if new category has predefined subcategories
    };

    const handleAddSubcategory = () => {
        setShowAddSubcategory(true); // Show input field for adding subcategory
    };

    const handleSubcategoryChange = (e) => {
        setSubcategory(e.target.value);
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-semibold mb-4">{product ? 'Edit Product' : 'Add Product'}</h1>

            {error && <p className="text-red-500">{error}</p>}

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Quantity</label>
                <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="p-2 border border-gray-300 rounded w-full"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Category</label>
                <select
                    value={category}
                    onChange={handleCategoryChange}
                    className="p-2 border border-gray-300 rounded w-full"
                    required
                >
                    <option value="">Select Category</option>
                    {Object.keys(categories).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Subcategory dropdown or option to add subcategory */}
            {category && (
                categories[category].length > 0 ? (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Subcategory</label>
                        <select
                            value={subcategory}
                            onChange={handleSubcategoryChange}
                            className="p-2 border border-gray-300 rounded w-full"
                        >
                            <option value="">Select Subcategory</option>
                            {categories[category].map((subcat) => (
                                <option key={subcat} value={subcat}>{subcat}</option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div className="mb-4">
                        {showAddSubcategory ? (
                            <>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Subcategory</label>
                                <input
                                    type="text"
                                    value={subcategory}
                                    onChange={handleSubcategoryChange}
                                    className="p-2 border border-gray-300 rounded w-full"
                                    placeholder="Enter subcategory"
                                    required
                                />
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={handleAddSubcategory}
                                className="bg-blue-500 text-white py-2 px-4 rounded"
                            >
                                Add Subcategory
                            </button>
                        )}
                    </div>
                )
            )}

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Model</label>
                <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                    required
                />
            </div>

            <div className="flex justify-end space-x-2">
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                    {product ? 'Update' : 'Add'}
                </button>
                <button type="button" className="bg-gray-300 text-black py-2 px-4 rounded" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

ProductForm.propTypes = {
    product: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        quantity: PropTypes.number,
        model: PropTypes.string,
        category: PropTypes.string,
        subcategory: PropTypes.string,
    }),
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ProductForm;

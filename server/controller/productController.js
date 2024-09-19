const Product = require('../models/productModel');

// Add a new product
async function addProductController(req, res) {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({
            message: 'Product added successfully',
            data: product,
            success: true,
            error: false
        });
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).json({
            message: err.message || 'Server Error',
            error: true,
            success: false
        });
    }
}

// Get all products
async function getProductsController(req, res) {
    try {
        const products = await Product.find();
        res.status(200).json({
            data: products,
            success: true,
            error: false
        });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({
            message: err.message || 'Server Error',
            error: true,
            success: false
        });
    }
}

// Update a product
async function updateProductController(req, res) {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({
                message: 'Product not found',
                error: true,
                success: false
            });
        }
        res.status(200).json({
            message: 'Product updated successfully',
            data: product,
            success: true,
            error: false
        });
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({
            message: err.message || 'Server Error',
            error: true,
            success: false
        });
    }
}

// Delete a product
async function deleteProductController(req, res) {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({
                message: 'Product not found',
                error: true,
                success: false
            });
        }
        res.status(204).json({
            message: 'Product deleted successfully',
            success: true,
            error: false
        });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({
            message: err.message || 'Server Error',
            error: true,
            success: false
        });
    }
}

module.exports = {
    addProductController,
    getProductsController,
    updateProductController,
    deleteProductController
};

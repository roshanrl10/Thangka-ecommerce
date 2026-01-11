import mongoose from "mongoose";

import Product from "../model/Product.model.js";
export const getProduct = async (req, res) => {
    try {
        const products = await Product.find({}).populate('artist', 'name email avatar profileImage');
        res.status(200).json({ success: true, data: products })
    } catch (error) {
        console.log("error while fetching the dat", error.message)
        res.status(500).json({ success: false, message: "server error" })

    }
}


export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[DEBUG] getProductById called with ID: '${id}'`); // LOGGING

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log(`[DEBUG] ID is INVALID`);
            return res.status(404).json({ success: false, message: "Product not found (Invalid ID)" });
        }

        const product = await Product.findById(id).populate('artist', 'name email profileImage avatar isVerified');

        console.log(`[DEBUG] Product found:`, product ? product._id : 'NULL');

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found (DB returned null)" });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error("Error fetching product:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const createProduct = async (req, res) => {
    try {
        const { title, description, price, images, category, size, material, paintingDuration, spiritualMeaning, stock } = req.body;

        if (!title || !description || !price || !images || !category) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        // Auto-verify if admin or verified artist
        let isVerified = false;
        if (req.user.role === 'admin') {
            isVerified = true;
        } else if (req.user.role === 'artist') {
            // Check if the artist user is verified (you might want to check the User model's verification status, 
            // but here we might just trust the role or check a property on req.user if populated)
            // Ideally: isVerified = req.user.isVerifiedArtist;
            // But existing code logic seems to check artistApplicationStatus in the User controller, 
            // let's assume req.user has been populated or we check typical logic.
            // For now, let's look at the User object or assume false if not explicitly set.
            // EDIT: usage of isVerifiedArtist on the product model suggests we stamp it at creation.
            isVerified = req.user.isVerifiedArtist || false;
        }

        const newProduct = new Product({
            title,
            description,
            price,
            images,
            category,
            size,
            material,
            paintingDuration,
            spiritualMeaning,
            artist: req.user._id,
            isVerifiedArtist: isVerified,
            stock: stock || 1, // Default to 1 if not provided
            inStock: (stock === undefined || stock > 0)
        })

        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct })
    } catch (error) {
        console.log("error in create product", error.message)
        res.status(500).json({ success: false, message: "Server error" })
    }
}

export const getArtistProducts = async (req, res) => {
    try {
        console.log(`[DEBUG] getArtistProducts called for User: ${req.user?._id}`);
        const products = await Product.find({ artist: req.user._id });
        console.log(`[DEBUG] Found ${products.length} products for artist.`);
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error("Error fetching artist products:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const productData = req.body;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Authorization Check
        if (req.user.role !== 'admin' && product.artist.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized: You can only update your own products" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Authorization Check
        if (req.user.role !== 'admin' && product.artist.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized: You can only delete your own products" });
        }

        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product deleted successfully" });

    } catch (error) {
        console.error("Error deleting product:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}
import Product from '../model/Product.model.js';
import Order from '../model/Order.model.js';
import Artist from '../model/Artist.model.js';

// Get Artist Stats (Revenue, Sales, Products)
export const getArtistStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find Artist Profile
        const artist = await Artist.findOne({ userId });

        if (!artist) {
            // Return empty stats if profile doesn't exist yet (e.g. just approved or manual role change)
            return res.status(200).json({
                totalProducts: await Product.countDocuments({ artist: userId }),
                totalSales: 0,
                totalRevenue: 0,
                rating: 0
            });
        }

        const totalProducts = await Product.countDocuments({ artist: userId });

        res.status(200).json({
            totalProducts,
            totalSales: artist.totalSales || 0,
            totalRevenue: (artist.totalSales || 0) * 150, // Mock avg price calculation
            rating: artist.rating || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get My Products
export const getMyProducts = async (req, res) => {
    try {
        const userId = req.user._id;
        const products = await Product.find({ artist: userId });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create Product
export const createproduct = async (req, res) => {
    try {
        const userId = req.user._id;
        const productData = req.body;

        const newProduct = new Product({
            ...productData,
            artist: userId,
            isVerifiedArtist: true
        });

        await newProduct.save();

        // Update Artist Count
        await Artist.findOneAndUpdate({ userId }, { $inc: { totalArtworks: 1 } });

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const product = await Product.findOneAndDelete({ _id: id, artist: userId });

        if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });

        await Artist.findOneAndUpdate({ userId }, { $inc: { totalArtworks: -1 } });

        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

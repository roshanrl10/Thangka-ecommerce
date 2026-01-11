import Artist from '../model/Artist.model.js';
import User from '../model/User.model.js';

import Order from '../model/Order.model.js';
import Product from '../model/Product.model.js';

// Get orders for artist
export const getArtistOrders = async (req, res) => {
    try {
        const artistUserId = req.user._id;

        // 1. Find all products created by this artist
        const products = await Product.find({ artist: artistUserId }).select('_id');
        const productIds = products.map(p => p._id);

        if (productIds.length === 0) {
            return res.status(200).json([]);
        }

        // 2. Find orders that contain any of these products
        // We use $in operator on items.productId
        const orders = await Order.find({
            'items.productId': { $in: productIds }
        })
            .populate('userId', 'name email')
            .populate('items.productId')
            .sort({ createdAt: -1 });

        // 3. Filter items within the orders? 
        // The user might want to see the WHOLE order, or just their items. 
        // For simplicity, we return the whole order but the Frontend highlights their items.
        // Actually, allowing Artist to change status of WHOLE order if they only provided 1 item is risky 
        // if multiple artists are involved. But for single-vendor or simple multi-vendor, it's okay for now.

        res.status(200).json(orders);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Apply to become an artist
export const applyArtist = async (req, res) => {
    try {
        const { userId, biography, nationality, yearsOfExperience, artLineage, thangkaTypes } = req.body;

        // Check if user already has an application
        const existingArtist = await Artist.findOne({ userId });
        if (existingArtist) {
            return res.status(400).json({ message: 'Application already exists' });
        }

        const newArtist = new Artist({
            userId,
            biography,
            nationality,
            yearsOfExperience,
            artLineage,
            thangkaTypes,
            status: 'pending' // Default status
        });

        await newArtist.save();

        // Update User status to pending
        await User.findByIdAndUpdate(userId, { artistApplicationStatus: 'pending' });

        res.status(201).json({ message: 'Application submitted successfully', artist: newArtist });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get public profile of an artist
export const getArtistProfile = async (req, res) => {
    try {
        const { id } = req.params;

        // Try finding by Artist ID first, then by User ID
        // Note: We need to be careful if IDs are ObjectIds. 
        // findOne with $or might encounter casting errors if we don't handle it, 
        // but since both are ObectIds, Mongoose usually handles string->ObjectId casting okay for queries if properly formed.

        let artist = await Artist.findById(id).populate('userId', 'name email');

        if (!artist) {
            // If not found by Artist ID, try User ID
            artist = await Artist.findOne({ userId: id }).populate('userId', 'name email');
        }

        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }
        res.status(200).json(artist);
    } catch (error) {
        // If it's a cast error (invalid ID format), return 404 instead of 500
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Artist not found' });
        }
        res.status(500).json({ message: error.message });
    }
};

// Get all approved artists (public)
export const getAllArtists = async (req, res) => {
    try {
        const artists = await Artist.find({ status: 'approved' }).populate('userId', 'name avatar');
        res.status(200).json(artists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Artist Profile (Protected)
export const updateArtistProfile = async (req, res) => {
    try {
        const { biography, location, nationality, yearsOfExperience, artLineage, thangkaTypes, profileImage, bannerImage } = req.body;

        // Find artist associated with logged in user
        let artist = await Artist.findOne({ userId: req.user._id });

        if (!artist) {
            return res.status(404).json({ message: "Artist profile not found" });
        }

        // Update fields
        artist.biography = biography || artist.biography;
        artist.location = location || artist.location;
        artist.nationality = nationality || artist.nationality;
        artist.yearsOfExperience = yearsOfExperience || artist.yearsOfExperience;
        artist.artLineage = artLineage || artist.artLineage;
        artist.thangkaTypes = thangkaTypes || artist.thangkaTypes;

        if (profileImage) artist.profileImage = profileImage;
        if (bannerImage) artist.bannerImage = bannerImage;

        await artist.save();

        res.status(200).json({ success: true, message: "Profile updated", data: artist });
    } catch (error) {
        console.error("Error updating artist profile:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

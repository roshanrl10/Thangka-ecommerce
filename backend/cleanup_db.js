
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Artist from './model/Artist.model.js';
import User from './model/User.model.js';
import Product from './model/Product.model.js';

dotenv.config();

const cleanup = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // 1. Remove Artists with invalid userId
        const artists = await Artist.find({});
        console.log(`Checking ${artists.length} artists...`);
        let removedArtists = 0;
        for (const artist of artists) {
            const user = await User.findById(artist.userId);
            if (!user) {
                await Artist.findByIdAndDelete(artist._id);
                removedArtists++;
            }
        }
        console.log(`Removed ${removedArtists} orphaned artists.`);

        // 2. Remove Products with invalid artist (User ID)
        const products = await Product.find({});
        console.log(`Checking ${products.length} products...`);
        let removedProducts = 0;
        for (const product of products) {
            // product.artist is the User ID
            const user = await User.findById(product.artist);
            if (!user) {
                await Product.findByIdAndDelete(product._id);
                removedProducts++;
            }
        }
        console.log(`Removed ${removedProducts} orphaned products.`);

        process.exit(0);
    } catch (error) {
        console.error("Cleanup Error:", error);
        process.exit(1);
    }
};

cleanup();

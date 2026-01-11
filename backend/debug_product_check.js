import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './model/Product.model.js';

dotenv.config();

const debugProduct = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const targetId = '695cd04a5f6a101961a7006a'; // The ID from the screenshot

        console.log(`Checking for Product ID: ${targetId}`);

        // Check Validity
        const isValid = mongoose.Types.ObjectId.isValid(targetId);
        console.log(`Is Valid ObjectId: ${isValid}`);

        if (isValid) {
            const product = await Product.findById(targetId);
            console.log("Product found via findById:", product);

            // Try searching by string _id just in case
            const productByString = await Product.findOne({ _id: targetId });
            console.log("Product found via findOne:", productByString);
        }

        // Dump all product IDs
        const allProducts = await Product.find({}, '_id title');
        console.log("\nAll Products in DB:");
        allProducts.forEach(p => console.log(`${p._id} - ${p.title}`));

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

debugProduct();

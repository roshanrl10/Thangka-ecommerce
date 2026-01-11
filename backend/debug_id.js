import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './model/Product.model.js';

dotenv.config();

const targetId = '695cd04a5f6a101961a7006a';

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected");

        const isValid = mongoose.Types.ObjectId.isValid(targetId);
        console.log(`ID '${targetId}' is valid ObjectId: ${isValid}`);

        const product = await Product.findById(targetId);
        console.log("Result findById:", product);

        const all = await Product.find({});
        console.log(`Total products: ${all.length}`);
        const match = all.find(p => p._id.toString() === targetId);
        console.log("Result manual find:", match);

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

check();

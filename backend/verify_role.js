
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './model/User.model.js';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const verifyAdmin = async () => {
    // Check the user again
    const user = await User.findOne({ name: "Admin User" });
    if (user) {
        console.log(`User: ${user.name}, Role: ${user.role}, ID: ${user._id}`);
    } else {
        console.log("Admin User not found.");
    }

    // Also check for any other admins
    const admins = await User.find({ role: 'admin' });
    console.log(`Total Admins: ${admins.length}`);
    admins.forEach(a => console.log(`- ${a.name} (${a._id})`));
};

const run = async () => {
    await connectDB();
    await verifyAdmin();
    process.exit();
};

run();

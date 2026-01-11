
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

const fixAdminRole = async () => {
    try {
        // ID from previous debug log: 695c047a5b71ac802c00c5e9
        // Name: "Admin User"
        const userId = "695c047a5b71ac802c00c5e9";

        console.log(`Finding user with ID: ${userId}...`);
        const user = await User.findById(userId);

        if (!user) {
            console.log("User not found!");

            // Fallback: try to find by name "Admin User" if ID was dynamic/different in this run? 
            // The previous log showed "Admin User" with that ID.
            const userByName = await User.findOne({ name: "Admin User" });
            if (userByName) {
                console.log(`Found user by name: ${userByName.name} (${userByName._id})`);
                userByName.role = 'admin';
                await userByName.save();
                console.log(`Updated role to 'admin' for ${userByName.name}`);
            } else {
                console.log("Could not find user by name either.");
            }
            return;
        }

        console.log(`Found user: ${user.name}. Current Role: ${user.role}`);
        user.role = 'admin';
        await user.save();
        console.log(`SUCCESS: Updated ${user.name} role to 'admin'.`);

    } catch (error) {
        console.error(`Error updating user: ${error.message}`);
    }
};

const run = async () => {
    await connectDB();
    await fixAdminRole();
    process.exit();
};

run();

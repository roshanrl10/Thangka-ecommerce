
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './model/User.model.js';
import Artist from './model/Artist.model.js';
import { getPendingArtists, getAllUsers } from './controller/admin.controller.js';

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

const mockRes = {
    statusCode: 200,
    status: function (code) { this.statusCode = code; return this; },
    json: function (data) { console.log(`Response [${this.statusCode}]:`, JSON.stringify(data).substring(0, 100) + "..."); return this; }
};

const debugEndpoints = async () => {
    console.log("\n--- simulating getAllUsers ---");
    // Mock req
    const req = { user: { role: 'admin' } };
    await getAllUsers(req, mockRes);

    console.log("\n--- simulating getPendingArtists ---");
    await getPendingArtists(req, mockRes);
};

const run = async () => {
    await connectDB();
    await debugEndpoints();
    process.exit();
};

run();

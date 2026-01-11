
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Order from './model/Order.model.js';
import User from './model/User.model.js';
import Artist from './model/Artist.model.js';

dotenv.config();

const logFile = path.resolve('debug_stats_output.txt');
fs.writeFileSync(logFile, '');

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
};

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        log(`Error: ${error.message}`);
        process.exit(1);
    }
};

const debugStats = async () => {
    log('\n--- Debugging Dashboard Stats ---');

    try {
        const totalUsers = await User.countDocuments({ role: 'buyer' });
        log(`Total Buyers: ${totalUsers}`);

        const totalArtists = await User.countDocuments({ role: 'artist' });
        log(`Total Artists: ${totalArtists}`);

        const pendingArtists = await Artist.countDocuments({ status: 'pending' });
        log(`Pending Artists: ${pendingArtists}`);

        const totalOrders = await Order.countDocuments();
        log(`Total Orders: ${totalOrders}`);

        // Debug Orders Status
        const orderStatuses = await Order.distinct('status');
        log(`Order Statuses present in DB: ${JSON.stringify(orderStatuses)}`);

        // Dump a few orders to check structure
        const sampleOrders = await Order.find().limit(3);
        log(`Sample Orders: ${JSON.stringify(sampleOrders, null, 2)}`);

        // Calculate Total Revenue
        // Check filtering
        const header = await Order.aggregate([
            { $match: { status: { $in: ['Paid', 'Delivered'] } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = header.length > 0 ? header[0].total : 0;
        log(`Total Revenue (Paid/Delivered): ${totalRevenue}`);

        // Revenue Graph
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        log(`Fetching stats since: ${sixMonthsAgo.toISOString()}`);

        const revenueGraph = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo },
                    status: { $in: ['Paid', 'Delivered'] }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: "$totalPrice" }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        log(`Revenue Graph Data: ${JSON.stringify(revenueGraph, null, 2)}`);

    } catch (error) {
        log(`Stats Error: ${error.message}`);
    }
};

const run = async () => {
    await connectDB();
    await debugStats();
    process.exit();
};

run();

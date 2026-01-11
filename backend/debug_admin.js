
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Product from './model/Product.model.js';
import User from './model/User.model.js';
import Artist from './model/Artist.model.js';

dotenv.config();

const logFile = path.resolve('debug_output.txt');
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

const debugProductUpload = async () => {
    log('\n--- Debugging Product Upload ---');

    // Debug: List all users
    const allUsers = await User.find({});
    log(`Total Users in DB: ${allUsers.length}`);
    allUsers.forEach(u => log(`- User: ${u.name}, Role: ${u.role}, ID: ${u._id}`));

    // 1. Find an Admin User
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
        // If no admin, try to use the first user and pretend they are admin for the sake of script
        if (allUsers.length > 0) {
            log("No Admin user found. Using first user as mock admin.");
            // We can't actually change their role here safely without messing up DB, but we can use their ID.
            simulateUpload(allUsers[0]);
        } else {
            log("No users at all. Cannot simulate.");
        }
        return;
    }
    log(`Found Admin: ${admin.name} (${admin._id})`);
    simulateUpload(admin);
};

const simulateUpload = async (user) => {
    // 2. Simulate Product Data from Frontend
    const productPayload = {
        title: "Debug Thangka",
        description: "A test thangka created via debug script.",
        price: 15000,
        category: "buddha",
        material: "Cotton",
        paintingDuration: "2 weeks",
        size: { width: 50, height: 70, unit: 'cm' },
        spiritualMeaning: "Peace",
        images: ["https://example.com/debug.jpg"],
        artistId: user._id.toString()
    };

    try {
        const artistId = productPayload.artistId;

        log("Attempting to create product instance...");
        const newProduct = new Product({
            ...productPayload,
            artist: artistId,
            isVerifiedArtist: true
        });

        if (newProduct.isVerifiedArtist === undefined) {
            log("WARNING: isVerifiedArtist was stripped by schema (Strict Mode).");
        } else {
            log("isVerifiedArtist preserved on instance.");
        }

        log("Validating product...");
        await newProduct.validate();
        log("Validation successful.");

        log("Saving product...");
        await newProduct.save();
        log(`Product saved successfully: ${newProduct._id}`);

        // Clean up
        await Product.findByIdAndDelete(newProduct._id);
        log("Cleaned up debug product.");

    } catch (error) {
        log(`FAILED to create product: ${error.message}`);
        if (error.errors) {
            log(`Validation Errors: ${JSON.stringify(error.errors, null, 2)}`);
        }
    }
}

const debugArtistFetching = async () => {
    log('\n--- Debugging Artist Fetching ---');

    try {
        log("Fetching all approved artists...");
        // NOTE: artist.controller.js uses populate('userId', 'name profileImage')
        // We want to see if 'profileImage' exists on User or if it should be 'avatar'
        const artists = await Artist.find({ status: 'approved' }).populate('userId', 'name profileImage avatar email');
        log(`Found ${artists.length} approved artists.`);

        if (artists.length > 0) {
            log(`Sample Artist User Data: ${JSON.stringify(artists[0].userId, null, 2)}`);
        }

    } catch (error) {
        log(`FAILED to fetch artists: ${error.message}`);
    }
}

const run = async () => {
    await connectDB();
    await debugProductUpload();
    await debugArtistFetching();
    process.exit();
};

run();

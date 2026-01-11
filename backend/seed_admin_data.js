
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './model/User.model.js';
import Product from './model/Product.model.js';
import Order from './model/Order.model.js';
import Artist from './model/Artist.model.js';
import bcrypt from 'bcryptjs';

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

const seedData = async () => {
    console.log('\n--- Seeding Mock Data ---');

    try {
        // 1. Create Buyers
        console.log('Creating buyers...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const buyers = await User.insertMany([
            { name: "John Doe", email: "john@example.com", password: hashedPassword, role: 'buyer' },
            { name: "Jane Smith", email: "jane@example.com", password: hashedPassword, role: 'buyer' },
            { name: "Alice Johnson", email: "alice@example.com", password: hashedPassword, role: 'buyer' }
        ]);
        console.log(`Created ${buyers.length} buyers.`);

        // 2. Create Products (if needed, but assuming some exist or created now)
        // Find existing artist to assign to
        const artistUser = await User.findOne({ role: 'artist' });
        if (!artistUser) {
            console.log("No artist found. Creating one...");
            // Create dummy artist
        }

        const products = await Product.find({});
        let productIds = [];
        if (products.length === 0) {
            console.log("No products found. Creating dummy products...");
            const newProducts = await Product.insertMany([
                {
                    title: "Golden Mandala",
                    description: "Beautiful mandala",
                    price: 25000,
                    category: "mandala",
                    images: ["https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&q=80&w=1000"],
                    artist: artistUser ? artistUser._id : buyers[0]._id, // Fallback
                    isVerifiedArtist: true,
                    inStock: true
                },
                {
                    title: "Green Tara",
                    description: "Detailed Green Tara",
                    price: 18000,
                    category: "tara",
                    images: ["https://images.unsplash.com/photo-1599525790899-27a36c649987?auto=format&fit=crop&q=80&w=1000"],
                    artist: artistUser ? artistUser._id : buyers[0]._id,
                    isVerifiedArtist: true,
                    inStock: true
                }
            ]);
            productIds = newProducts.map(p => p._id);
        } else {
            productIds = products.map(p => p._id);
        }

        // 3. Create Orders (Spread over last 6 months)
        console.log('Creating orders...');
        const orders = [];
        const statuses = ['Paid', 'Delivered', 'Pending', 'Processing'];

        for (let i = 0; i < 20; i++) {
            const randomBuyer = buyers[Math.floor(Math.random() * buyers.length)];
            const randomProduct = productIds[Math.floor(Math.random() * productIds.length)];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

            // Random date in last 6 months
            const date = new Date();
            date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));
            date.setDate(Math.floor(Math.random() * 28) + 1);

            orders.push({
                userId: randomBuyer._id,
                items: [{ productId: randomProduct, quantity: 1, price: 20000 }], // Simplified
                totalPrice: 20000,
                status: randomStatus,
                paymentStatus: randomStatus === 'Paid' || randomStatus === 'Delivered' ? 'Completed' : 'Pending',
                paymentMethod: 'eSewa',
                shippingAddress: {
                    fullName: randomBuyer.name,
                    phone: "9800000000",
                    city: "Kathmandu",
                    address: "Thamel",
                },
                createdAt: date,
                updatedAt: date
            });
        }

        await Order.insertMany(orders);
        console.log(`Created ${orders.length} orders.`);

        // 4. Create Pending Artist Applications
        console.log('Creating pending artist applications...');
        const pendingUser = await User.create({
            name: "Aspiring Artist",
            email: "aspiring@example.com",
            password: hashedPassword,
            role: 'buyer',
            artistApplicationStatus: 'pending'
        });

        await Artist.create({
            userId: pendingUser._id,
            biography: "I want to join.",
            nationality: "Nepali",
            yearsOfExperience: 5,
            status: 'pending'
        });
        console.log("Created 1 pending artist application.");

        console.log("Seeding complete!");

    } catch (error) {
        console.error(`Seeding Error: ${error.message}`);
    }
};

const run = async () => {
    await connectDB();
    await seedData();
    process.exit();
};

run();

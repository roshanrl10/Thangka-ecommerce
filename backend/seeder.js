import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './model/User.model.js';
import Artist from './model/Artist.model.js';
import Product from './model/Product.model.js';
import Category from './model/Category.model.js';
import Order from './model/Order.model.js';

dotenv.config();

const categoriesData = [
    {
        id: 'buddha',
        name: 'Buddha Thangkas',
        description: 'Sacred depictions of the Buddha in various forms and mudras',
        image: 'https://th.bing.com/th/id/OIP.kzJb4Pr6kC9sqzoOs2pClgHaKD?w=197&h=268&c=7&r=0&o=7&cb=ucfimg2&dpr=1.1&pid=1.7&rm=3&ucfimg=1',
        productCount: 0,
    },
    {
        id: 'mandala',
        name: 'Mandala Art',
        description: 'Intricate geometric patterns representing the cosmos',
        image: 'https://th.bing.com/th/id/OIP.oUzpepgIB0EYi3hhSg0CeAHaH0?w=172&h=182&c=7&r=0&o=7&cb=ucfimg2&dpr=1.1&pid=1.7&rm=3&ucfimg=1',
        productCount: 0,
    },
    {
        id: 'deity',
        name: 'Deity Paintings',
        description: 'Wrathful and peaceful deities of Tibetan Buddhism',
        image: 'https://th.bing.com/th/id/OIP.xIpdRKipe3G3QfOL1qMNRQHaKk?w=197&h=281&c=7&r=0&o=7&cb=ucfimg2&dpr=1.1&pid=1.7&rm=3&ucfimg=1',
        productCount: 0,
    },
    {
        id: 'tara',
        name: 'Tara Collection',
        description: 'Green Tara, White Tara, and other manifestations',
        image: 'https://th.bing.com/th/id/OIP.WbPHt0MmjTHdwtOr08BxtgHaLH?w=197&h=296&c=7&r=0&o=7&cb=ucfimg2&dpr=1.1&pid=1.7&rm=3&ucfimg=1',
        productCount: 0,
    },
    {
        id: 'wheel',
        name: 'Wheel of Life',
        description: 'Bhavachakra depicting the cycle of existence',
        image: 'https://th.bing.com/th/id/OIP.57bk8HeJf9HUF3ZhXebFXAHaKV?w=197&h=275&c=7&r=0&o=7&cb=ucfimg2&dpr=1.1&pid=1.7&rm=3&ucfimg=1',
        productCount: 0,
    },
    {
        id: 'medicine',
        name: 'Medicine Buddha',
        description: 'Healing Buddha paintings for spiritual wellness',
        image: 'https://th.bing.com/th/id/OIP.G7OjRA8-h_ZUkPQQhw_GRwHaII?w=176&h=192&c=7&r=0&o=7&cb=ucfimg2&dpr=1.1&pid=1.7&rm=3&ucfimg=1',
        productCount: 0,
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing data
        await Product.deleteMany({});
        await Artist.deleteMany({});
        await User.deleteMany({});
        await Category.deleteMany({});
        await Order.deleteMany({});

        console.log('Cleared existing data');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // 1. Create Categories
        await Category.insertMany(categoriesData);
        console.log('Categories seeded');

        // 2. Create Admin User
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@thangka.com',
            password: hashedPassword,
            role: 'admin',
        });
        console.log('Admin user created: admin@thangka.com / password123');

        // 3. Create One Test Artist
        const artistUser = await User.create({
            name: 'Test Artist',
            email: 'artist@thangka.com',
            password: hashedPassword,
            role: 'artist',
            isVerifiedArtist: true
        });

        const artistProfile = await Artist.create({
            userId: artistUser._id,
            biography: 'A verified test artist.',
            nationality: 'Nepali',
            location: 'Kathmandu',
            yearsOfExperience: 10,
            artLineage: 'Traditional',
            thangkaTypes: ['Buddha'],
            status: 'approved',
            rating: 5,
            totalArtworks: 0,
            totalSales: 0
        });

        artistUser.artistProfileId = artistProfile._id;
        await artistUser.save();
        console.log('Artist user created: artist@thangka.com / password123');

        console.log('Database seeded successfully');
        process.exit();

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDB();

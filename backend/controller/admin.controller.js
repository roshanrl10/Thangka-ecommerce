import Artist from '../model/Artist.model.js';
import User from '../model/User.model.js';
import Order from '../model/Order.model.js';

// Get all pending artist applications
export const getPendingArtists = async (req, res) => {
    try {
        const pendingArtists = await Artist.find({ status: 'pending' }).populate('userId', 'name email avatar');
        res.status(200).json(pendingArtists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Approve an artist
export const approveArtist = async (req, res) => {
    try {
        const { artistId } = req.body;

        const artist = await Artist.findById(artistId);
        if (!artist) {
            return res.status(404).json({ message: 'Artist application not found' });
        }

        artist.status = 'approved';
        await artist.save();

        // Update User role and status
        await User.findByIdAndUpdate(artist.userId, {
            role: 'artist',
            artistProfileId: artist._id,
            artistApplicationStatus: 'approved'
        });

        res.status(200).json({ message: 'Artist approved successfully', artist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reject an artist
export const rejectArtist = async (req, res) => {
    try {
        const { artistId } = req.body;

        const artist = await Artist.findById(artistId);
        if (!artist) {
            return res.status(404).json({ message: 'Artist application not found' });
        }

        artist.status = 'rejected';
        await artist.save();

        await User.findByIdAndUpdate(artist.userId, { artistApplicationStatus: 'rejected' });

        res.status(200).json({ message: 'Artist application rejected', artist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Dashboard Stats
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'buyer' });
        const totalArtists = await User.countDocuments({ role: 'artist' });
        const pendingArtists = await Artist.countDocuments({ status: 'pending' });
        const totalOrders = await Order.countDocuments();

        // Calculate Total Revenue (only from paid orders if status usage is consistent, otherwise all for now if testing)
        // Assuming 'Paid' or 'Delivered' means revenue generated.
        const header = await Order.aggregate([
            { $match: { status: { $in: ['Paid', 'Delivered'] } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = header.length > 0 ? header[0].total : 0;

        // Recent Orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'name email');

        // Revenue Graph Data (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

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

        res.status(200).json({
            totalUsers,
            totalArtists,
            totalOrders,
            totalRevenue,
            pendingArtists,
            recentOrders,
            revenueGraph
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('userId', 'name email')
            .populate('items.productId', 'title price images')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

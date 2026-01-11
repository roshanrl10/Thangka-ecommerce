import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    biography: {
        type: String,
        required: true,
    },
    nationality: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    yearsOfExperience: {
        type: Number,
        required: true,
    },
    artLineage: {
        type: String,
    },
    thangkaTypes: [{
        type: String,
    }],
    portfolio: [{
        type: String, // URLs to images
    }],
    bannerImage: {
        type: String,
    },
    profileImage: {
        type: String, // Separate from User avatar
    },
    idProof: {
        type: String, // URL to ID proof
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    rating: {
        type: Number,
        default: 0
    },
    totalArtworks: {
        type: Number,
        default: 0
    },
    totalSales: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Artist = mongoose.model('Artist', artistSchema);
export default Artist;

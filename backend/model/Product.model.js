import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    originalPrice: {
        type: Number,
    },
    images: [{
        type: String,
        required: true,
    }],
    category: {
        type: String, // referring to Category ID string (e.g., 'buddha') for simplicity, or ObjectId
        required: true,
    },
    size: {
        width: Number,
        height: Number,
        unit: String,
    },
    material: String,
    paintingDuration: String,
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Linking to User (who is an artist)
        required: true,
    },
    spiritualMeaning: String,
    inStock: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        default: 1
    },
    isVerifiedArtist: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
const Product = mongoose.model('Product', productSchema);

export default Product;
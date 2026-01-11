import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function () { return !this.googleId; }, // Password required only if not Google login
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    avatar: {
        type: String,
    },
    role: {
        type: String,
        enum: ['buyer', 'admin', 'artist'],
        default: 'buyer',
    },
    artistApplicationStatus: {
        type: String,
        enum: ['none', 'pending', 'approved', 'rejected'],
        default: 'none',
    },
    artistProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    cart: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 }
        }
    ]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;

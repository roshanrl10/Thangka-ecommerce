import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // e.g., 'buddha'
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    productCount: { type: Number, default: 0 },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;

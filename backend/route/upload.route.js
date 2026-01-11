import express from 'express';
import { upload, cloudinary } from '../lib/cloudinary.js';

const router = express.Router();

// Upload Single Image
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file provided' });
        }

        // Upload to Cloudinary
        // Since we are using memory storage, we need to convert buffer to base64 or stream
        // Simplified: Use a temporary write or stream. 
        // Easier way with buffer:
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'thangka-ecommerce',
        });

        res.json({ url: result.secure_url });
    } catch (error) {
        console.error('Upload failed:', error);
        res.status(500).json({ message: 'Image upload failed' });
    }
});

export default router;

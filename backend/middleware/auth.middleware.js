import jwt from 'jsonwebtoken';
import User from '../model/User.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            res.clearCookie("jwt");
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const adminRoute = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Access denied - Admin only" });
    }
};

export const artistRoute = (req, res, next) => {
    if (req.user && (req.user.role === "artist" || req.user.role === "admin")) {
        next();
    } else {
        return res.status(403).json({ message: "Access denied - Artist only" });
    }
};

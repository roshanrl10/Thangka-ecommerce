import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js"
import dotenv from "dotenv";
import productRoute from "./route/product.route.js"
import cartRoutes from "./route/cart.route.js";
import checkoutRoutes from "./route/checkoutRoutes.js";
import paymentRoutes from "./route/paymentRoutes.js";
import orderRoutes from "./route/orderRoutes.js";
import authRoutes from "./route/auth.route.js";
import artistRoutes from "./route/artist.route.js";
import artistDashboardRoutes from "./route/artist.dashboard.route.js"; // New
import adminRoutes from "./route/admin.route.js";
import userRoutes from "./route/user.route.js";
import uploadRoutes from "./route/upload.route.js"; // New

dotenv.config();

connectDB(); // Call database connection

const app = express();

app.use(cors()); // Enable CORS
app.use(express.json());//allow us to accept json data in req.body


app.use("/api/products", productRoute)
app.use("/api/order", orderRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);

// New Routes
app.use("/api/auth", authRoutes);
app.use("/api/artist", artistRoutes);
app.use("/api/artist-dashboard", artistDashboardRoutes); // New
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes); // New

app.listen(5000, () => {
    console.log("server started at http://localhost:5000");
});

// // server.js
// import express from "express";
// import https from "https";
// import fs from "fs";

// const app = express();

// const options = {
//   key: fs.readFileSync("./certificates/server.key"),
//   cert: fs.readFileSync("./certificates/server.crt"),
// };

// https.createServer(options, app).listen(443, () => {
//   console.log("✅ HTTPS Server running at https://localhost");
// });

// app.get("/", (req, res) => {
//   res.send("Hello, HTTPS World!");
// });


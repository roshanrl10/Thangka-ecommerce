import express from "express";

import {connectDB} from "./config/db"
import dotenv from "dotenv";
import productRoute from "./route/product.route"

dotenv.config();

const app = express();

app.use(express.json());//allow us to accept json data in req.body

app.use("/api/products",productRoute)

app.use(cart)
app.use(favorites)
app.use(payment)
app.use(checkout)


app.listen(5000,()=>{
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


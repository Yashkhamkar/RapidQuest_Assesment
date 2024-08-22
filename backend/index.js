const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const connectDB = require("./utils/db");
const customerRoutes = require("./routes/customer.routes");
const orderRoutes = require("./routes/order.routes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/customers", customerRoutes);
app.use("/orders", orderRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Handle any other routes by serving the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
});

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

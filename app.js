// require("dotenv").config({ path: ".env" });

// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const paymentRoutes = require("./routes/paymentRoutes");
// const connectDB = require("./mongo_config/db");

// const app = express();

// // Middleware to capture raw body ONLY for Razorpay Webhook
// app.use("/api/payments/webhook", bodyParser.json({
//   verify: (req, res, buf) => {
//     req.rawBody = buf.toString();
//   }
// }));

// // Normal JSON parser for all other routes
// app.use(bodyParser.json());

// // Routes
// app.use("/api/payments", paymentRoutes);

// // Connect to DB and Start Server
// const PORT = process.env.PORT || 5000;
// connectDB().then(() => {
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// });



require("dotenv").config({ path: ".env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // ✅ Add this line
const bodyParser = require("body-parser");
const paymentRoutes = require("./routes/paymentRoutes");
const connectDB = require("./mongo_config/db");

const app = express();

// ✅ CORS middleware (must be near the top)
app.use(cors({
  origin: ["http://localhost:5173", "https://litwits.in"], // ✅ your frontend domains
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // only if you're using cookies/auth
}));
// Middleware to capture raw body ONLY for Razorpay Webhook
app.use("/api/payments/webhook", bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

// Normal JSON parser for all other routes
app.use(bodyParser.json());

// Routes
app.use("/api/payments", paymentRoutes);

// Connect to DB and Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});


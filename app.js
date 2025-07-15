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
const cors = require("cors");
const bodyParser = require("body-parser");
const paymentRoutes = require("./routes/paymentRoutes");
const connectDB = require("./mongo_config/db");

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://litwits.in",
      "https://www.litwits.in"
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "OPTIONS"], // Added OPTIONS for preflight
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept"
  ],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Special handling for Razorpay webhook
app.use("/api/payments/webhook", 
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    }
  })
);

// Regular JSON parser for other routes
app.use(bodyParser.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.path}`);
  next();
});

// Routes
app.use("/api/payments", paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Connect to DB and Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1);
});

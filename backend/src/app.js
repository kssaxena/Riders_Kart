import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import ImageKit from "imagekit";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import socketSetup from "../src/db/socket.js";

const allowedOrigins = [
  process.env.ORIGIN_1,
  process.env.ORIGIN_2,
  process.env.ORIGIN_3,
];

const app = express();

// Socket connection
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 2 * 60 * 1000,
    // whether to skip middlewares upon successful recovery
    skipMiddlewares: true,
  },
});

// ** ImageKit Setup **
const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

// ** CORS Configuration for frontend **
const corsOptionsFrontend = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const corsOptionsBackend = {
  origin: true, // Allow any origin (since API keys protect access)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  exposedHeaders: ["X-RateLimit-Limit", "X-RateLimit-Remaining"],
};

// app.options("*", cors()); // ✅ Explicitly handle preflight requests
// app.use(cors(corsOptions));

// For frontend browsers (strict CORS)
app.use("/api/v1", cors(corsOptionsFrontend));

// For backend APIs (more permissive)
app.use("/public/api/v1", cors(corsOptionsBackend));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// ** Socket.IO Connection Handling **
socketSetup(io);

app.use((req, res, next) => {
  console.log("Request from: ", req.method, ", ", req.url);
  console.log("Request Body: ", req.body);
  next();
});

// ** Route for Authenticating ImageKit **
app.get("/auth-image-kit", (req, res) => {
  res.send(imagekit.getAuthenticationParameters());
});

// ** Routes Setup **
import userRouter from "./routes/user.routes.js";
import driverRouter from "./routes/driver.routes.js";
import orderRouter from "./routes/order.routes.js";
import adminRouter from "./routes/admin.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import publicRoutes from "./routes/public.routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/driver", driverRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/payment", paymentRouter);

// Public API routes (for backend access)
app.use("/public/api/v1", publicRoutes);

// ** Error Handling Middleware **
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ success: false, message: "Internal Server Error" });
// });

export { app, server, io };

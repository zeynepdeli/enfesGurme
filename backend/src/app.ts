import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import likeRoutes from "./routes/likeRoutes";
import addressRoutes from "./routes/addressRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import heroSlideRoutes from "./routes/heroSlideRoutes";
import featuredCardRoutes from "./routes/featuredCardRoutes";
import bestsellerCardRoutes from "./routes/bestsellerCardRoutes";

dotenv.config();

const app: Application = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://192.168.1.54:3000",
];

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS tarafından izin verilmedi: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/hero-slides", heroSlideRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/featured-cards", featuredCardRoutes);
app.use("/api/bestseller-cards", bestsellerCardRoutes);
// Health check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server çalışıyor!",
    endpoints: {
      auth: "/api/auth",
      user: "/api/user",
      products: "/api/products",
      categories: "/api/categories",
      cart: "/api/cart",
      orders: "/api/orders",
      reviews: "/api/reviews",
      likes: "/api/likes",
      addresses: "/api/addresses",
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: `${req.originalUrl} bulunamadı`,
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message:
      process.env.NODE_ENV === "development" ? err.message : "Sunucu hatası",
  });
});

export default app;

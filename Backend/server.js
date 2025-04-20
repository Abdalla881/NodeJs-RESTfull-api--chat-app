import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";

import { app, httpServer, io } from "./Utils/socket.io.js";
import cors from "cors";
import dbConnection from "./Config/dbConnection.js";
import MountRoute from "./Routes/server.js";
import ApiError from "./Utils/ApiError.js";
import GlobalErrorHandler from "./Middleware/Error.Middlewere.js";
const PORT = 5001;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
if (process.env.NODE_ENV !== "production") {
  const morgan = await import("morgan");
  app.use(morgan.default("dev"));
  console.log(`Mode : ${process.env.NODE_ENV}`);
}

// Mount Routes
MountRoute(app);

// Catch-all for undefined routes (404)
app.use((req, res, next) => {
  next(new ApiError("Route not found", 404));
});

// Global Handler Error middleware
app.use(GlobalErrorHandler);

const server = httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.name, err.message);

  server.close(() => {
    console.error("Server closed due to unhandled promise rejection");
    setTimeout(() => {
      process.exit(1); // Exit the process after cleanup
    }, 1000);
  }); // Wait for 1 second before exiting
});

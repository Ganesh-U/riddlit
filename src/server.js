import "dotenv/config";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB, getDB } from "./db/connection.js";
import { setupUserRoutes } from "./routes/userRoutes.js";
import { setupPuzzleRoutes } from "./routes/puzzleRoutes.js";
import { setupSubmissionRoutes } from "./routes/submissionRoutes.js";
import { setupCommentRoutes } from "./routes/commentRoutes.js";
import { setupVoteRoutes } from "./routes/voteRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Session with MongoDB Store
app.use(
  session({
    secret: process.env.SESSION_SECRET || "riddlit-dev-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      dbName: "riddlit",
      collectionName: "sessions",
      touchAfter: 24 * 3600, // lazy session update (in seconds)
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// Connect to database and setup routes
connectDB()
  .then(() => {
    const db = getDB();

    // API Routes
    app.use("/api", setupUserRoutes(db));
    app.use("/api/puzzles", setupPuzzleRoutes(db));
    app.use("/api/submissions", setupSubmissionRoutes(db));
    app.use("/api/comments", setupCommentRoutes(db));
    app.use("/api/votes", setupVoteRoutes(db));

    // Health check endpoint
    app.get("/api/health", (req, res) => {
      res.json({ status: "ok", message: "Server is running" });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Database: ${db.databaseName}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 Open: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  });

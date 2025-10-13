import express from "express";

const router = express.Router();

// Setup routes with database
export function setupUserRoutes(db) {
  // Register
  router.post("/register", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || username.trim().length === 0) {
        return res.status(400).json({ error: "Username is required" });
      }

      if (!password || password.length < 4) {
        return res.status(400).json({ error: "Password must be at least 4 characters" });
      }

      const existing = await db.collection("users").findOne({ username });
      if (existing) {
        return res.status(400).json({ error: "Username already taken" });
      }

      await db.collection("users").insertOne({
        username,
        password,
        created_at: new Date(),
        puzzle_count: 0,
        solve_count: 0,
      });

      // Set session
      req.session.username = username;

      // Save session explicitly before sending response
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ error: "Registration failed" });
        }
        res.json({ success: true, username });
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Login
  router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await db.collection("users").findOne({ username });
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      if (user.password !== password) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Set session
      req.session.username = username;

      // Save session explicitly before sending response
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ error: "Login failed" });
        }
        res.json({ success: true, username });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Logout
  router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // Get session
  router.get("/session", (req, res) => {
    if (req.session.username) {
      res.json({ username: req.session.username });
    } else {
      res.json({ username: null });
    }
  });

  return router;
}

export default router;

import express from "express";

const router = express.Router();

// Setup routes with database
export function setupUserRoutes(db) {
  // Register
  router.post("/register", async (req, res) => {
    console.log("=== REGISTER ATTEMPT ===");
    console.log("Body:", req.body);
    console.log("Session ID before:", req.sessionID);

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
        console.log("❌ Username already taken:", username);
        return res.status(400).json({ error: "Username already taken" });
      }

      await db.collection("users").insertOne({
        username,
        password,
        created_at: new Date(),
        puzzle_count: 0,
        solve_count: 0,
      });

      console.log("✅ User created:", username);

      // Set session
      req.session.username = username;
      console.log("Session username set to:", req.session.username);

      // Save session explicitly before sending response
      req.session.save((err) => {
        if (err) {
          console.error("❌ Session save error:", err);
          return res.status(500).json({ error: "Registration failed" });
        }
        console.log("✅ Session saved successfully");
        console.log("Session data after save:", req.session);
        res.json({ success: true, username });
      });
    } catch (error) {
      console.error("❌ Register error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Login
  router.post("/login", async (req, res) => {
    console.log("=== LOGIN ATTEMPT ===");
    console.log("Body:", req.body);
    console.log("Session ID before:", req.sessionID);
    console.log("Session data before:", req.session);

    try {
      const { username, password } = req.body;

      const user = await db.collection("users").findOne({ username });
      if (!user) {
        console.log("❌ User not found:", username);
        return res.status(401).json({ error: "Invalid username or password" });
      }

      console.log("✅ User found:", username);
      console.log("Password match:", user.password === password);

      if (user.password !== password) {
        console.log("❌ Wrong password");
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Set session
      req.session.username = username;
      console.log("Session username set to:", req.session.username);
      console.log("Session ID after set:", req.sessionID);

      // Save session explicitly before sending response
      req.session.save((err) => {
        if (err) {
          console.error("❌ Session save error:", err);
          return res.status(500).json({ error: "Login failed" });
        }
        console.log("✅ Session saved successfully");
        console.log("Session data after save:", req.session);
        res.json({ success: true, username });
      });
    } catch (error) {
      console.error("❌ Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Logout
  router.post("/logout", (req, res) => {
    console.log("=== LOGOUT ===");
    console.log("Session before destroy:", req.session);

    req.session.destroy((err) => {
      if (err) {
        console.error("❌ Logout error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      console.log("✅ Session destroyed");
      res.json({ success: true });
    });
  });

  // Get session
  router.get("/session", (req, res) => {
    console.log("=== SESSION CHECK ===");
    console.log("Session ID:", req.sessionID);
    console.log("Session data:", req.session);
    console.log("Username in session:", req.session.username);

    if (req.session.username) {
      res.json({ username: req.session.username });
    } else {
      res.json({ username: null });
    }
  });

  return router;
}

export default router;

import express from "express";
import { ObjectId } from "mongodb";
import { requireLogin } from "../middleware/auth.js";

const router = express.Router();

export function setupPuzzleRoutes(db) {
  // Create puzzle
  router.post("/", requireLogin, async (req, res) => {
    try {
      const { question, answer, hint, category, difficulty } = req.body;

      if (!question || !answer || !category || !difficulty) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const puzzle = {
        question,
        answer: answer.toLowerCase().trim(),
        hint: hint || null,
        category,
        difficulty,
        creator_username: req.session.username,
        total_attempts: 0,
        successful_solves: 0,
        likes: 0,
        dislikes: 0,
        created_date: new Date(),
      };

      const result = await db.collection("puzzles").insertOne(puzzle);

      await db
        .collection("users")
        .updateOne({ username: req.session.username }, { $inc: { puzzle_count: 1 } });

      res.json({ success: true, puzzle_id: result.insertedId });
    } catch (error) {
      console.error("Create puzzle error:", error);
      res.status(500).json({ error: "Failed to create puzzle" });
    }
  });

  // Get all puzzles
  router.get("/", async (req, res) => {
    try {
      const { category, difficulty } = req.query;
      const filter = {};

      if (category && category !== "All") {
        filter.category = category;
      }
      if (difficulty) {
        filter.difficulty = difficulty;
      }

      const puzzles = await db
        .collection("puzzles")
        .find(filter)
        .sort({ created_date: -1 })
        .limit(100)
        .toArray();

      res.json(puzzles);
    } catch (error) {
      console.error("Get puzzles error:", error);
      res.status(500).json({ error: "Failed to fetch puzzles" });
    }
  });

  // Get my puzzles
  router.get("/mine", requireLogin, async (req, res) => {
    try {
      const puzzles = await db
        .collection("puzzles")
        .find({ creator_username: req.session.username })
        .sort({ created_date: -1 })
        .toArray();

      res.json(puzzles);
    } catch (error) {
      console.error("Get my puzzles error:", error);
      res.status(500).json({ error: "Failed to fetch puzzles", details: error.message });
    }
  });

  // Get single puzzle
  router.get("/:id", async (req, res) => {
    try {
      const puzzle = await db.collection("puzzles").findOne({
        _id: new ObjectId(req.params.id),
      });

      if (!puzzle) {
        return res.status(404).json({ error: "Puzzle not found" });
      }

      res.json(puzzle);
    } catch (error) {
      console.error("Get puzzle error:", error);
      res.status(500).json({ error: "Failed to fetch puzzle" });
    }
  });

  // Update puzzle
  router.put("/:id", requireLogin, async (req, res) => {
    try {
      const { question, answer, hint, category, difficulty } = req.body;
      const puzzleId = new ObjectId(req.params.id);

      const puzzle = await db.collection("puzzles").findOne({ _id: puzzleId });
      if (!puzzle) {
        return res.status(404).json({ error: "Puzzle not found" });
      }
      if (puzzle.creator_username !== req.session.username) {
        return res.status(403).json({ error: "Not authorized" });
      }

      await db.collection("puzzles").updateOne(
        { _id: puzzleId },
        {
          $set: {
            question,
            answer: answer.toLowerCase().trim(),
            hint: hint || null,
            category,
            difficulty,
          },
        }
      );

      res.json({ success: true });
    } catch (error) {
      console.error("Update puzzle error:", error);
      res.status(500).json({ error: "Failed to update puzzle" });
    }
  });

  // Delete puzzle
  router.delete("/:id", requireLogin, async (req, res) => {
    try {
      const puzzleId = new ObjectId(req.params.id);

      const puzzle = await db.collection("puzzles").findOne({ _id: puzzleId });
      if (!puzzle) {
        return res.status(404).json({ error: "Puzzle not found" });
      }
      if (puzzle.creator_username !== req.session.username) {
        return res.status(403).json({ error: "Not authorized" });
      }

      await db.collection("puzzles").deleteOne({ _id: puzzleId });

      await db.collection("submissions").deleteMany({ puzzle_id: puzzleId.toString() });
      await db.collection("comments").deleteMany({ puzzle_id: puzzleId.toString() });

      await db
        .collection("users")
        .updateOne({ username: req.session.username }, { $inc: { puzzle_count: -1 } });

      res.json({ success: true });
    } catch (error) {
      console.error("Delete puzzle error:", error);
      res.status(500).json({ error: "Failed to delete puzzle" });
    }
  });

  return router;
}

export default router;

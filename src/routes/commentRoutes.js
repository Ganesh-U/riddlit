// Consider moving all your database logic from the routes folder to a different "repositories" folder 
// It is best if HTTP logic (requests/responses) is not mixed in with data logic (CRUD operations)
import express from "express";
import { ObjectId } from "mongodb";
import { requireLogin } from "../middleware/auth.js";

const router = express.Router();

export function setupCommentRoutes(db) {
  // Add comment
  router.post("/", requireLogin, async (req, res) => {
    try {
      const { puzzle_id, text } = req.body;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: "Comment text is required" });
      }

      const comment = {
        puzzle_id,
        commenter_username: req.session.username,
        text: text.trim(),
        created_at: new Date(),
      };

      await db.collection("comments").insertOne(comment);

      res.json({ success: true });
    } catch (error) {
      console.error("Add comment error:", error);
      res.status(500).json({ error: "Failed to add comment" });
    }
  });

  // Get comments for puzzle
  router.get("/:puzzle_id", async (req, res) => {
    try {
      const comments = await db
        .collection("comments")
        .find({ puzzle_id: req.params.puzzle_id })
        .sort({ created_at: -1 })
        .toArray();

      res.json(comments);
    } catch (error) {
      console.error("Get comments error:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  // Update comment
  router.put("/:id", requireLogin, async (req, res) => {
    try {
      const { text } = req.body;
      const commentId = new ObjectId(req.params.id);

      const comment = await db.collection("comments").findOne({ _id: commentId });
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
      if (comment.commenter_username !== req.session.username) {
        return res.status(403).json({ error: "Not authorized" });
      }

      await db
        .collection("comments")
        .updateOne({ _id: commentId }, { $set: { text: text.trim() } });

      res.json({ success: true });
    } catch (error) {
      console.error("Update comment error:", error);
      res.status(500).json({ error: "Failed to update comment" });
    }
  });

  // Delete comment
  router.delete("/:id", requireLogin, async (req, res) => {
    try {
      const commentId = new ObjectId(req.params.id);

      const comment = await db.collection("comments").findOne({ _id: commentId });
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
      if (comment.commenter_username !== req.session.username) {
        return res.status(403).json({ error: "Not authorized" });
      }

      await db.collection("comments").deleteOne({ _id: commentId });

      res.json({ success: true });
    } catch (error) {
      console.error("Delete comment error:", error);
      res.status(500).json({ error: "Failed to delete comment" });
    }
  });

  return router;
}

export default router;

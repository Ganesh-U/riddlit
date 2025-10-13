import express from "express";
import { ObjectId } from "mongodb";
import { requireLogin } from "../middleware/auth.js";

const router = express.Router();

export function setupVoteRoutes(db) {
  // Vote on a puzzle (like or dislike)
  router.post("/", requireLogin, async (req, res) => {
    try {
      const { puzzle_id, vote_type } = req.body;

      if (!puzzle_id || !vote_type) {
        return res.status(400).json({ error: "Puzzle ID and vote type required" });
      }

      if (vote_type !== "like" && vote_type !== "dislike") {
        return res.status(400).json({ error: "Vote type must be 'like' or 'dislike'" });
      }

      const puzzle = await db.collection("puzzles").findOne({
        _id: new ObjectId(puzzle_id),
      });

      if (!puzzle) {
        return res.status(404).json({ error: "Puzzle not found" });
      }

      const existingVote = await db.collection("votes").findOne({
        puzzle_id,
        voter_username: req.session.username,
      });

      if (existingVote) {
        if (existingVote.vote_type === vote_type) {
          await db.collection("votes").deleteOne({ _id: existingVote._id });

          const updateField = vote_type === "like" ? { likes: -1 } : { dislikes: -1 };
          await db
            .collection("puzzles")
            .updateOne({ _id: new ObjectId(puzzle_id) }, { $inc: updateField });

          return res.json({
            success: true,
            action: "removed",
            vote_type: null,
          });
        }

        await db.collection("votes").updateOne(
          { _id: existingVote._id },
          {
            $set: {
              vote_type,
              voted_at: new Date(),
            },
          }
        );

        const oldVoteField = existingVote.vote_type === "like" ? "likes" : "dislikes";
        const newVoteField = vote_type === "like" ? "likes" : "dislikes";

        await db.collection("puzzles").updateOne(
          { _id: new ObjectId(puzzle_id) },
          {
            $inc: {
              [oldVoteField]: -1,
              [newVoteField]: 1,
            },
          }
        );

        return res.json({
          success: true,
          action: "switched",
          vote_type,
        });
      }

      await db.collection("votes").insertOne({
        puzzle_id,
        voter_username: req.session.username,
        vote_type,
        voted_at: new Date(),
      });

      const updateField = vote_type === "like" ? { likes: 1 } : { dislikes: 1 };
      await db
        .collection("puzzles")
        .updateOne({ _id: new ObjectId(puzzle_id) }, { $inc: updateField });

      res.json({
        success: true,
        action: "added",
        vote_type,
      });
    } catch (error) {
      console.error("Vote error:", error);
      res.status(500).json({ error: "Failed to vote" });
    }
  });

  // Get user's votes for puzzles
  router.get("/mine", requireLogin, async (req, res) => {
    try {
      const votes = await db
        .collection("votes")
        .find({ voter_username: req.session.username })
        .toArray();

      const voteMap = {};
      votes.forEach((vote) => {
        voteMap[vote.puzzle_id] = vote.vote_type;
      });

      res.json(voteMap);
    } catch (error) {
      console.error("Get votes error:", error);
      res.status(500).json({ error: "Failed to fetch votes" });
    }
  });

  return router;
}

export default router;

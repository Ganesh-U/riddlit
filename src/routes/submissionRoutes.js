import express from "express";
import { ObjectId } from "mongodb";
import { requireLogin } from "../middleware/auth.js";

const router = express.Router();

export function setupSubmissionRoutes(db) {
  // Submit answer
  router.post("/", requireLogin, async (req, res) => {
    try {
      const { puzzle_id, submitted_answer } = req.body;

      // Get puzzle
      const puzzle = await db.collection("puzzles").findOne({
        _id: new ObjectId(puzzle_id),
      });

      if (!puzzle) {
        return res.status(404).json({ error: "Puzzle not found" });
      }

      // Check if user already solved this puzzle
      const existingSolvedSubmission = await db.collection("submissions").findOne({
        puzzle_id,
        solver_username: req.session.username,
        is_correct: true,
      });

      if (existingSolvedSubmission) {
        return res.status(400).json({
          error: "You already solved this puzzle!",
          already_solved: true,
        });
      }

      // Check answer
      const userAnswer = submitted_answer.toLowerCase().trim();
      const correctAnswer = puzzle.answer.toLowerCase().trim();
      const isCorrect = userAnswer === correctAnswer;

      // Create submission
      const submission = {
        puzzle_id,
        solver_username: req.session.username,
        submitted_answer: userAnswer,
        is_correct: isCorrect,
        submission_time: new Date(),
      };

      await db.collection("submissions").insertOne(submission);

      // Update puzzle stats
      await db.collection("puzzles").updateOne(
        { _id: new ObjectId(puzzle_id) },
        {
          $inc: {
            total_attempts: 1,
            successful_solves: isCorrect ? 1 : 0,
          },
        }
      );

      if (isCorrect) {
        await db
          .collection("users")
          .updateOne({ username: req.session.username }, { $inc: { solve_count: 1 } });
      }

      res.json({ success: true, is_correct: isCorrect });
    } catch (error) {
      console.error("Submit answer error:", error);
      res.status(500).json({ error: "Failed to submit answer" });
    }
  });

  // Get my submissions
  router.get("/mine", requireLogin, async (req, res) => {
    try {
      const submissions = await db
        .collection("submissions")
        .find({ solver_username: req.session.username })
        .sort({ submission_time: -1 })
        .limit(50)
        .toArray();

      res.json(submissions);
    } catch (error) {
      console.error("Get submissions error:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  // Get my stats
  router.get("/stats/mine", requireLogin, async (req, res) => {
    try {
      const submissions = await db
        .collection("submissions")
        .find({ solver_username: req.session.username })
        .toArray();

      const totalSolved = submissions.filter((s) => s.is_correct).length;
      const totalAttempts = submissions.length;
      const successRate = totalAttempts > 0 ? Math.round((totalSolved / totalAttempts) * 100) : 0;

      const correctDates = submissions
        .filter((s) => s.is_correct)
        .map((s) => new Date(s.submission_time).toDateString());

      const uniqueDates = [...new Set(correctDates)].sort().reverse();

      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      for (let i = 0; i < uniqueDates.length; i++) {
        const date = new Date(uniqueDates[i]);
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() - i);

        if (date.toDateString() === expectedDate.toDateString()) {
          tempStreak++;
          if (i === 0 || currentStreak > 0) {
            currentStreak = tempStreak;
          }
        } else {
          break;
        }

        longestStreak = Math.max(longestStreak, tempStreak);
      }

      res.json({
        total_solved: totalSolved,
        success_rate: successRate,
        current_streak: currentStreak,
        longest_streak: longestStreak,
      });
    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Get leaderboard
  router.get("/stats/leaderboard", async (req, res) => {
    try {
      const users = await db
        .collection("users")
        .find({})
        .sort({ solve_count: -1 })
        .limit(10)
        .toArray();

      // Calculate streaks for each user
      const leaderboard = await Promise.all(
        users.map(async (user) => {
          const submissions = await db
            .collection("submissions")
            .find({ solver_username: user.username, is_correct: true })
            .sort({ submission_time: -1 })
            .toArray();

          const correctDates = submissions.map((s) => new Date(s.submission_time).toDateString());

          const uniqueDates = [...new Set(correctDates)].sort().reverse();

          let currentStreak = 0;
          for (let i = 0; i < uniqueDates.length; i++) {
            const date = new Date(uniqueDates[i]);
            const expectedDate = new Date();
            expectedDate.setDate(expectedDate.getDate() - i);

            if (date.toDateString() === expectedDate.toDateString()) {
              currentStreak++;
            } else {
              break;
            }
          }

          return {
            username: user.username,
            total_solved: user.solve_count || 0,
            streak: currentStreak,
          };
        })
      );

      res.json(leaderboard);
    } catch (error) {
      console.error("Get leaderboard error:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  return router;
}

export default router;

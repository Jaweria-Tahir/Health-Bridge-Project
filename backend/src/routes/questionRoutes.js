const express = require("express");

const Question = require("../models/Question");

const authenticate = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


router.post(
  "/",
  authenticate,
  authorizeRoles("citizen"),
  async (req, res) => {
    try {
      const { question, category } = req.body;

      if (!question) {
        return res.status(400).json({
          message: "Question is required"
        });
      }

      const newQuestion = await Question.create({
        question,
        category: category || "general_health",
        submittedBy: req.user.userId
      });

      res.status(201).json({
        message: "Question submitted successfully",
        question: newQuestion
      });

    } catch (error) {
      console.error("Submit question error:", error);

      res.status(500).json({
        message: "Server error"
      });
    }
  }
);



router.get(
  "/my",
  authenticate,
  authorizeRoles("citizen"),
  async (req, res) => {
    try {
      const questions = await Question.find({
        submittedBy: req.user.userId
      })
        .populate("reviewedBy", "name email")
        .sort({ createdAt: -1 });

      res.json({
        count: questions.length,
        questions
      });

    } catch (error) {
      console.error("Get my questions error:", error);

      res.status(500).json({
        message: "Server error"
      });
    }
  }
);


router.get(
  "/",
  authenticate,
  authorizeRoles("organization", "admin"),
  async (req, res) => {
    try {
      const questions = await Question.find()
        .populate("submittedBy", "name email")
        .populate("reviewedBy", "name email")
        .sort({ createdAt: -1 });

      res.json({
        count: questions.length,
        questions
      });

    } catch (error) {
      console.error("Get questions error:", error);

      res.status(500).json({
        message: "Server error"
      });
    }
  }
);


router.put(
  "/:id",
  authenticate,
  authorizeRoles("organization", "admin"),
  async (req, res) => {
    try {
      const { answer, status } = req.body;

      const question = await Question.findById(
        req.params.id
      );

      if (!question) {
        return res.status(404).json({
          message: "Question not found"
        });
      }

      if (answer !== undefined) {
        question.answer = answer;
      }

      if (status !== undefined) {
        question.status = status;
      }

      question.reviewedBy = req.user.userId;

      await question.save();

      res.json({
        message: "Question updated successfully",
        question
      });

    } catch (error) {
      console.error("Update question error:", error);

      res.status(500).json({
        message: "Server error"
      });
    }
  }
);


module.exports = router;
const express = require("express");

const Education = require("../models/Education");

const authenticate = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


router.get("/", authenticate, async (req, res) => {
  try {
    const education = await Education.find({
      status: { $regex: /^published$/i }
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: education.length,
      education
    });

  } catch (error) {
    console.error("Get education error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});



router.get("/search", authenticate, async (req, res) => {
  try {
    const { q, category } = req.query;

    const filter = {
      status: { $regex: /^published$/i }
    };

    if (q) {
      filter.$or = [
        {
          title: {
            $regex: q,
            $options: "i"
          }
        },
        {
          summary: {
            $regex: q,
            $options: "i"
          }
        },
        {
          content: {
            $regex: q,
            $options: "i"
          }
        }
      ];
    }

    if (category) {
      filter.category = category;
    }

    const education = await Education.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: education.length,
      education
    });

  } catch (error) {
    console.error("Search education error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


router.get("/:id", authenticate, async (req, res) => {
  try {
    const education = await Education.findOne({
      _id: req.params.id,
      status: "published"
    }).populate("createdBy", "name email");

    if (!education) {
      return res.status(404).json({
        message: "Educational content not found"
      });
    }

    res.json(education);

  } catch (error) {
    console.error("Get education item error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});



router.post(
  "/",
  authenticate,
  authorizeRoles("organization", "admin"),
  async (req, res) => {
    try {
      const {
        title,
        category,
        summary,
        content,
        source,
        status
      } = req.body;

      if (
        !title ||
        !category ||
        !summary ||
        !content ||
        !source
      ) {
        return res.status(400).json({
          message: "All educational content fields are required"
        });
      }

      const education = await Education.create({
        title,
        category,
        summary,
        content,
        source,
        status: status || "published",
        createdBy: req.user.userId
      });

      res.status(201).json({
        message: "Educational content created successfully",
        education
      });

    } catch (error) {
      console.error("Create education error:", error);

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
      const education = await Education.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

      if (!education) {
        return res.status(404).json({
          message: "Educational content not found"
        });
      }

      res.json({
        message: "Educational content updated successfully",
        education
      });

    } catch (error) {
      console.error("Update education error:", error);

      res.status(500).json({
        message: "Server error"
      });
    }
  }
);


router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const education = await Education.findByIdAndDelete(
        req.params.id
      );

      if (!education) {
        return res.status(404).json({
          message: "Educational content not found"
        });
      }

      res.json({
        message: "Educational content deleted successfully"
      });

    } catch (error) {
      console.error("Delete education error:", error);

      res.status(500).json({
        message: "Server error"
      });
    }
  }
);


module.exports = router;
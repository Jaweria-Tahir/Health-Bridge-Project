const express = require("express");

const Resource = require("../models/Resource");

const authenticate = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  analyzeResource
} = require("../services/pythonService");

const router = express.Router();


router.get("/", authenticate, async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate("createdBy", "name email");

    res.json({
      count: resources.length,
      resources
    });

  } catch (error) {
    console.error("Get resources error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


router.get("/search", authenticate, async (req, res) => {
  try {
    const { q, category } = req.query;

    const filter = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } }
      ];
    }

    if (category) {
      filter.category = category;
    }

    const resources = await Resource.find(filter)
      .populate("createdBy", "name email");

    res.json({
      count: resources.length,
      resources
    });

  } catch (error) {
    console.error("Search resources error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


router.post(
  "/:id/analyze",
  authenticate,
  authorizeRoles("organization", "admin"),
  async (req, res) => {
    try {
      const resource = await Resource.findById(
        req.params.id
      );

      if (!resource) {
        return res.status(404).json({
          message: "Resource not found"
        });
      }

      const analysis = await analyzeResource(resource);

      res.json({
        message: "Resource analyzed successfully",
        analysis
      });

    } catch (error) {
      console.error(
        "Resource analysis error:",
        error
      );

      res.status(500).json({
        message: error.message
      });
    }
  }
);



router.get("/:id", authenticate, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found"
      });
    }

    res.json(resource);

  } catch (error) {
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
        name,
        category,
        description,
        location,
        contactInformation,
        availability
      } = req.body;

      if (
        !name ||
        !category ||
        !description ||
        !location ||
        !contactInformation ||
        !availability
      ) {
        return res.status(400).json({
          message: "All resource fields are required"
        });
      }

      const resource = await Resource.create({
        name,
        category,
        description,
        location,
        contactInformation,
        availability,
        createdBy: req.user.userId
      });

      res.status(201).json({
        message: "Resource created successfully",
        resource
      });

    } catch (error) {
      console.error("Create resource error:", error);

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
      const resource = await Resource.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

      if (!resource) {
        return res.status(404).json({
          message: "Resource not found"
        });
      }

      res.json({
        message: "Resource updated successfully",
        resource
      });

    } catch (error) {
      console.error("Update resource error:", error);

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
      const resource = await Resource.findByIdAndDelete(req.params.id);

      if (!resource) {
        return res.status(404).json({
          message: "Resource not found"
        });
      }

      res.json({
        message: "Resource deleted successfully"
      });

    } catch (error) {
      console.error("Delete resource error:", error);

      res.status(500).json({
        message: "Server error"
      });
    }
  }
);


module.exports = router;
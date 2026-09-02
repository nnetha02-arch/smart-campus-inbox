const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const Department = require("../models/Department");
const User = require("../models/User");

// GET /api/departments - list all
router.get("/", protect, async (req, res) => {
  const departments = await Department.find().sort({ name: 1 });
  res.json(departments);
});

// POST /api/departments (admin only)
router.post("/", protect, authorize("admin"), async (req, res) => {
  const { name, description } = req.body;
  const dept = await Department.create({ name, description });
  res.status(201).json(dept);
});

// GET /api/departments/:id/staff - list staff belonging to a department (for assignment dropdown)
router.get("/:id/staff", protect, authorize("admin"), async (req, res) => {
  const staff = await User.find({ role: "staff", department: req.params.id }).select("name email");
  res.json(staff);
});

module.exports = router;

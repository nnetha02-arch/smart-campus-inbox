const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const ctrl = require("../controllers/feedbackController");

router.post("/", protect, authorize("student"), ctrl.createFeedback);
router.get("/:complaintId", protect, ctrl.getFeedbackForComplaint);

module.exports = router;

const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");
const ctrl = require("../controllers/complaintController");

// Student
router.post("/", protect, authorize("student"), upload.single("image"), ctrl.createComplaint);
router.get("/mine", protect, authorize("student"), ctrl.getMyComplaints);

// Admin
router.get("/", protect, authorize("admin"), ctrl.getAllComplaints);
router.get("/stats", protect, authorize("admin"), ctrl.getStats);
router.put("/:id/assign", protect, authorize("admin"), ctrl.assignComplaint);

// Staff
router.get("/assigned", protect, authorize("staff"), ctrl.getAssignedComplaints);
router.put(
  "/:id/status",
  protect,
  authorize("staff"),
  upload.single("proofImage"),
  ctrl.updateStatus
);

// Shared (any logged-in user who owns/relates to it)
router.get("/:id", protect, ctrl.getComplaintById);

module.exports = router;

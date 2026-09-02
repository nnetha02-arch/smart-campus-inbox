const Feedback = require("../models/Feedback");

// POST /api/feedback (student)
exports.createFeedback = async (req, res) => {
  try {
    const { complaint, rating, comment } = req.body;
    const feedback = await Feedback.create({
      complaint,
      rating,
      comment,
      student: req.user.id,
    });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: "Failed to submit feedback", error: err.message });
  }
};

// GET /api/feedback/:complaintId
exports.getFeedbackForComplaint = async (req, res) => {
  const feedback = await Feedback.findOne({ complaint: req.params.complaintId });
  res.json(feedback);
};

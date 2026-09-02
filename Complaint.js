const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    complaintId: { type: String, required: true, unique: true }, // e.g. CMP1024
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Electrical",
        "Plumbing",
        "Civil",
        "Cleaning",
        "IT",
        "Hostel",
        "Transport",
        "Other",
      ],
    },
    location: { type: String, required: true }, // e.g. "Block A - Room 204"
    image: { type: String }, // file path / URL
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedDepartment: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // staff member
    resolvedAt: { type: Date },
    resolutionNote: { type: String },
    resolutionImage: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);

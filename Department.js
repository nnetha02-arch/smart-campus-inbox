const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g. Electrical, Plumbing, IT
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);

const Complaint = require("../models/Complaint");
const Department = require("../models/Department");
const {
  detectPriority,
  getDepartmentNameForCategory,
  generateComplaintId,
} = require("../utils/smartAssign");

// POST /api/complaints  (student)
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;
    if (!title || !description || !category || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const complaintId = await generateComplaintId(Complaint);
    const priority = detectPriority(`${title} ${description}`);
    const deptName = getDepartmentNameForCategory(category);

    let department = await Department.findOne({ name: deptName });
    if (!department) {
      department = await Department.create({ name: deptName });
    }

    const complaint = await Complaint.create({
      complaintId,
      title,
      description,
      category,
      location,
      priority,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
      student: req.user.id,
      assignedDepartment: department._id,
      status: "Pending",
    });

    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: "Failed to create complaint", error: err.message });
  }
};

// GET /api/complaints/mine (student)
exports.getMyComplaints = async (req, res) => {
  const complaints = await Complaint.find({ student: req.user.id })
    .populate("assignedDepartment", "name")
    .populate("assignedTo", "name")
    .sort({ createdAt: -1 });
  res.json(complaints);
};

// GET /api/complaints (admin) - all complaints, with optional filters
exports.getAllComplaints = async (req, res) => {
  const { status, category, priority } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (priority) filter.priority = priority;

  const complaints = await Complaint.find(filter)
    .populate("student", "name email")
    .populate("assignedDepartment", "name")
    .populate("assignedTo", "name")
    .sort({ createdAt: -1 });
  res.json(complaints);
};

// GET /api/complaints/assigned (staff) - complaints assigned to this staff member's department
exports.getAssignedComplaints = async (req, res) => {
  const complaints = await Complaint.find({
    $or: [{ assignedTo: req.user.id }, { assignedDepartment: req.query.departmentId }],
  })
    .populate("student", "name email")
    .populate("assignedDepartment", "name")
    .sort({ createdAt: -1 });
  res.json(complaints);
};

// GET /api/complaints/:id
exports.getComplaintById = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate("student", "name email")
    .populate("assignedDepartment", "name")
    .populate("assignedTo", "name");
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });
  res.json(complaint);
};

// PUT /api/complaints/:id/assign (admin) - assign staff / change priority / department
exports.assignComplaint = async (req, res) => {
  const { assignedTo, assignedDepartment, priority } = req.body;
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });

  if (assignedTo) complaint.assignedTo = assignedTo;
  if (assignedDepartment) complaint.assignedDepartment = assignedDepartment;
  if (priority) complaint.priority = priority;
  if (complaint.status === "Pending") complaint.status = "In Progress";

  await complaint.save();
  res.json(complaint);
};

// PUT /api/complaints/:id/status (staff) - update progress / mark resolved
exports.updateStatus = async (req, res) => {
  const { status, resolutionNote } = req.body;
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });

  complaint.status = status;
  if (resolutionNote) complaint.resolutionNote = resolutionNote;
  if (req.file) complaint.resolutionImage = `/uploads/${req.file.filename}`;
  if (status === "Resolved") complaint.resolvedAt = new Date();

  await complaint.save();
  res.json(complaint);
};

// GET /api/complaints/stats (admin) - basic analytics
exports.getStats = async (req, res) => {
  const total = await Complaint.countDocuments();
  const pending = await Complaint.countDocuments({ status: "Pending" });
  const inProgress = await Complaint.countDocuments({ status: "In Progress" });
  const resolved = await Complaint.countDocuments({ status: "Resolved" });

  const byCategory = await Complaint.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  res.json({ total, pending, inProgress, resolved, byCategory });
};

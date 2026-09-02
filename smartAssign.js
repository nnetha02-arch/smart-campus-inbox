// Maps a complaint category to a default department name.
// This is the "automatic complaint routing" feature.
const CATEGORY_TO_DEPARTMENT = {
  Electrical: "Electrical",
  Plumbing: "Plumbing",
  Civil: "Civil",
  Cleaning: "Cleaning",
  IT: "IT",
  Hostel: "Hostel",
  Transport: "Transport",
  Other: "General",
};

// Simple keyword-based priority detector.
// Looks for urgent/high-risk keywords in the description/title.
const HIGH_PRIORITY_KEYWORDS = [
  "exposed wire",
  "spark",
  "fire",
  "short circuit",
  "gas leak",
  "smoke",
  "flood",
  "electric shock",
  "collapsed",
  "ceiling falling",
  "no water",
  "security",
  "injury",
];

const MEDIUM_PRIORITY_KEYWORDS = [
  "not working",
  "broken",
  "leak",
  "damaged",
  "slow",
  "issue",
];

function detectPriority(text) {
  const t = text.toLowerCase();
  if (HIGH_PRIORITY_KEYWORDS.some((kw) => t.includes(kw))) return "High";
  if (MEDIUM_PRIORITY_KEYWORDS.some((kw) => t.includes(kw))) return "Medium";
  return "Low";
}

function getDepartmentNameForCategory(category) {
  return CATEGORY_TO_DEPARTMENT[category] || "General";
}

// Generates a short human-friendly complaint ID like CMP1024
async function generateComplaintId(ComplaintModel) {
  const count = await ComplaintModel.countDocuments();
  const nextNumber = 1000 + count + 1;
  return `CMP${nextNumber}`;
}

module.exports = {
  detectPriority,
  getDepartmentNameForCategory,
  generateComplaintId,
};

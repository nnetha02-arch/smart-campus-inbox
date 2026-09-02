import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { StatusBadge, PriorityBadge } from "../components/Badges";

export default function StudentDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/complaints/mine")
      .then((res) => setComplaints(res.data))
      .finally(() => setLoading(false));
  }, []);

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  return (
    <div className="container">
      <div className="stats-row">
        <div className="stat-box"><h2>{total}</h2><p>Total</p></div>
        <div className="stat-box"><h2>{pending}</h2><p>Pending</p></div>
        <div className="stat-box"><h2>{resolved}</h2><p>Resolved</p></div>
      </div>

      <div className="card" style={{ textAlign: "center" }}>
        <Link to="/student/new">
          <button>+ Submit New Complaint</button>
        </Link>
      </div>

      <div className="card">
        <h3>My Complaints</h3>
        {loading && <p>Loading...</p>}
        {!loading && complaints.length === 0 && <p>No complaints yet.</p>}
        {complaints.map((c) => (
          <div className="complaint-row" key={c._id}>
            <div>
              <strong>{c.complaintId}</strong> — {c.title}
              <div style={{ fontSize: 13, color: "#6b7280" }}>
                {c.category} · {c.location}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <PriorityBadge priority={c.priority} />
              <StatusBadge status={c.status} />
              <Link to={`/complaints/${c._id}`}>View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

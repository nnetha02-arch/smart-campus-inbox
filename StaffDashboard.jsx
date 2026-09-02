import { useEffect, useState } from "react";
import api from "../services/api";
import { StatusBadge, PriorityBadge } from "../components/Badges";

export default function StaffDashboard() {
  const [complaints, setComplaints] = useState([]);

  const load = () => api.get("/complaints/assigned").then((res) => setComplaints(res.data));

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/complaints/${id}/status`, { status });
    load();
  };

  return (
    <div className="container">
      <div className="card">
        <h3>Assigned Complaints</h3>
        {complaints.length === 0 && <p>No complaints assigned yet.</p>}
        {complaints.map((c) => (
          <div className="complaint-row" key={c._id}>
            <div>
              <strong>{c.complaintId}</strong> — {c.title}
              <div style={{ fontSize: 13, color: "#6b7280" }}>
                {c.location} · reported by {c.student?.name}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <PriorityBadge priority={c.priority} />
              <StatusBadge status={c.status} />
              <select
                value={c.status}
                onChange={(e) => updateStatus(c._id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

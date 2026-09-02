import { useEffect, useState } from "react";
import api from "../services/api";
import { StatusBadge, PriorityBadge } from "../components/Badges";

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const load = () => {
    api.get("/complaints", { params: { status: statusFilter || undefined } }).then((res) => setComplaints(res.data));
    api.get("/complaints/stats").then((res) => setStats(res.data));
  };

  useEffect(() => { load(); }, [statusFilter]);

  const handlePriorityChange = async (id, priority) => {
    await api.put(`/complaints/${id}/assign`, { priority });
    load();
  };

  return (
    <div className="container">
      {stats && (
        <div className="stats-row">
          <div className="stat-box"><h2>{stats.total}</h2><p>Total</p></div>
          <div className="stat-box"><h2>{stats.pending}</h2><p>Pending</p></div>
          <div className="stat-box"><h2>{stats.inProgress}</h2><p>In Progress</p></div>
          <div className="stat-box"><h2>{stats.resolved}</h2><p>Resolved</p></div>
        </div>
      )}

      {stats?.byCategory && (
        <div className="card">
          <h3>Complaints by Category</h3>
          {stats.byCategory.map((c) => (
            <div key={c._id} className="complaint-row">
              <span>{c._id}</span>
              <strong>{c.count}</strong>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <h3>All Complaints</h3>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ maxWidth: 200, marginBottom: 12 }}>
          <option value="">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
        {complaints.map((c) => (
          <div className="complaint-row" key={c._id}>
            <div>
              <strong>{c.complaintId}</strong> — {c.title}
              <div style={{ fontSize: 13, color: "#6b7280" }}>
                {c.student?.name} · {c.category} · {c.location} · {c.assignedDepartment?.name}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <select
                value={c.priority}
                onChange={(e) => handlePriorityChange(c._id, e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <StatusBadge status={c.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

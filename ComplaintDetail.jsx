import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { StatusBadge, PriorityBadge } from "../components/Badges";
import { useAuth } from "../context/AuthContext";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

export default function ComplaintDetail() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  const { user } = useAuth();

  const load = () => api.get(`/complaints/${id}`).then((res) => setComplaint(res.data));

  useEffect(() => {
    load();
  }, [id]);

  const submitFeedback = async (e) => {
    e.preventDefault();
    await api.post("/feedback", { complaint: id, rating, comment });
    setMsg("Thanks for your feedback!");
  };

  if (!complaint) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <div className="card">
        <h2>{complaint.complaintId} — {complaint.title}</h2>
        <p>{complaint.description}</p>
        <p><strong>Category:</strong> {complaint.category}</p>
        <p><strong>Location:</strong> {complaint.location}</p>
        <p>
          <StatusBadge status={complaint.status} /> &nbsp;
          <PriorityBadge priority={complaint.priority} />
        </p>
        {complaint.assignedDepartment && (
          <p><strong>Department:</strong> {complaint.assignedDepartment.name}</p>
        )}
        {complaint.image && (
          <img src={`${API_BASE}${complaint.image}`} alt="complaint" style={{ maxWidth: "100%", borderRadius: 8 }} />
        )}
        {complaint.resolutionNote && (
          <div style={{ marginTop: 12 }}>
            <strong>Resolution note:</strong> {complaint.resolutionNote}
          </div>
        )}
      </div>

      {user?.role === "student" && complaint.status === "Resolved" && (
        <div className="card">
          <h3>Give Feedback</h3>
          {msg && <p style={{ color: "#16a34a" }}>{msg}</p>}
          <form onSubmit={submitFeedback}>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} star{r > 1 ? "s" : ""}</option>
              ))}
            </select>
            <textarea
              placeholder="Comments (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit">Submit Feedback</button>
          </form>
        </div>
      )}
    </div>
  );
}

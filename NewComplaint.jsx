import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CATEGORIES = ["Electrical", "Plumbing", "Civil", "Cleaning", "IT", "Hostel", "Transport", "Other"];
const LOCATIONS = ["Block A", "Block B", "Library", "Hostel", "Canteen", "Ground", "Parking"];

export default function NewComplaint() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Electrical",
    location: "Block A",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append("image", image);

      const { data } = await api.post("/complaints", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(`Complaint submitted! ID: ${data.complaintId}`);
      setTimeout(() => navigate("/student"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit complaint");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <div className="card">
        <h2>Submit New Complaint</h2>
        {error && <p className="error-text">{error}</p>}
        {success && <p style={{ color: "#16a34a" }}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Title (e.g. Fan not working)"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Describe the issue in detail..."
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          >
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <input
            placeholder="Room / specific detail (e.g. Room 204)"
            onChange={(e) =>
              setForm((f) => ({ ...f, location: `${f.location.split(" - ")[0]} - ${e.target.value}` }))
            }
          />
          <input type="file" accept="image/*,video/*" onChange={(e) => setImage(e.target.files[0])} />
          <button type="submit">Submit Complaint</button>
        </form>
      </div>
    </div>
  );
}

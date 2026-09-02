import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      <div className="card" style={{ textAlign: "center", padding: 50 }}>
        <h1>🎓 Smart Campus Complaint & Resolution System</h1>
        <p style={{ color: "#6b7280", maxWidth: 600, margin: "12px auto" }}>
          Report campus issues like broken furniture, electrical faults, water
          leakage, Wi-Fi problems and more — and track them until resolved.
        </p>
        <div style={{ marginTop: 20 }}>
          <Link to="/register">
            <button>Get Started</button>
          </Link>
          <Link to="/login" style={{ marginLeft: 12 }}>
            <button style={{ background: "white", color: "#2563eb", border: "1px solid #2563eb" }}>
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

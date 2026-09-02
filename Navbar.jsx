import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ fontWeight: 700, fontSize: 18 }}>
        🎓 Smart Campus
      </Link>
      <div>
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {user?.role === "student" && (
          <>
            <Link to="/student">Dashboard</Link>
            <Link to="/student/new">New Complaint</Link>
          </>
        )}
        {user?.role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
        {user?.role === "staff" && <Link to="/staff">Staff Dashboard</Link>}
        {user && (
          <>
            <span style={{ marginLeft: 16 }}>Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              style={{ marginLeft: 12, background: "white", color: "#2563eb" }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

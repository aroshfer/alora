import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="wrap" style={{ padding: "90px 24px", textAlign: "center" }}>
      <h2 style={{ fontSize: 28, marginBottom: 12 }}>Page not found</h2>
      <p style={{ color: "#8a8375", marginBottom: 24 }}>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminBookings, fetchAdminUsers } from "../api";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("bookings");
  const [loadError, setLoadError] = useState("");
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("bellhavenUser");
    const user = stored ? JSON.parse(stored) : null;

    if (!user || user.role !== "ADMIN") {
      navigate("/signin");
      return;
    }

    setAdminName(user.fullName);

    fetchAdminBookings()
      .then(setBookings)
      .catch(() => setLoadError("Could not load bookings. Is the backend running?"));

    fetchAdminUsers(user.email)
      .then(setUsers)
      .catch(() => setLoadError("Could not load users. Is the backend running?"));
  }, [navigate]);

  return (
    <>
      <div className="page-banner">
        <h1>Admin Dashboard</h1>
        <p>{adminName ? `Signed in as ${adminName}` : "Manage bookings and registered users."}</p>
      </div>

      <section>
        <div className="container">
          <div className="admin-tabs">
            <button
              type="button"
              className={`admin-tab-btn${tab === "bookings" ? " active" : ""}`}
              onClick={() => setTab("bookings")}
            >
              Bookings ({bookings.length})
            </button>
            <button
              type="button"
              className={`admin-tab-btn${tab === "users" ? " active" : ""}`}
              onClick={() => setTab("users")}
            >
              Users ({users.length})
            </button>
          </div>

          {loadError && (
            <p style={{ color: "#c0392b", fontSize: "13px", marginBottom: "16px" }}>
              {loadError}
            </p>
          )}

          {tab === "bookings" && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Room</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Guests</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.fullName}</td>
                      <td>{b.email}</td>
                      <td>{b.roomType}</td>
                      <td>{b.checkin}</td>
                      <td>{b.checkout}</td>
                      <td>{b.guests}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && !loadError && <p>No bookings yet.</p>}
            </div>
          )}

          {tab === "users" && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && !loadError && <p>No users yet.</p>}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

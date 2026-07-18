import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser, fetchAdminBookings, fetchAdminUsers } from "../api";

export default function Admin() {
  const user = getCurrentUser();
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("bookings");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;

    Promise.all([fetchAdminBookings(), fetchAdminUsers(user.email)])
      .then(([bookingsData, usersData]) => {
        setBookings(bookingsData);
        setUsers(usersData);
      })
      .catch(() => setError("Couldn't load admin data. Please try again."))
      .finally(() => setLoading(false));
  }, [user]);

  // Not signed in, or signed in as a regular user - this page isn't
  // theirs to see (the /api/admin/* endpoints re-check this too).
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/signin" replace />;
  }

  return (
    <>
      <div className="page-banner">
        <h1>Admin Dashboard</h1>
        <p>Signed in as {user.fullName} ({user.email})</p>
      </div>

      <section className="admin-section">
        <div className="container">
          <div className="admin-tabs">
            <button
              className={`admin-tab${tab === "bookings" ? " active" : ""}`}
              onClick={() => setTab("bookings")}
            >
              Bookings ({bookings.length})
            </button>
            <button
              className={`admin-tab${tab === "users" ? " active" : ""}`}
              onClick={() => setTab("users")}
            >
              Users ({users.length})
            </button>
          </div>

          {loading && <p>Loading…</p>}
          {error && <p style={{ color: "#c0392b" }}>{error}</p>}

          {!loading && !error && tab === "bookings" && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Guest</th>
                  <th>Email</th>
                  <th>Room</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Guests</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={7}>No bookings yet.</td>
                  </tr>
                )}
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.fullName}</td>
                    <td>{b.email}</td>
                    <td>{b.roomType}</td>
                    <td>{b.checkin}</td>
                    <td>{b.checkout}</td>
                    <td>{b.guests ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && !error && tab === "users" && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4}>No users yet.</td>
                  </tr>
                )}
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
          )}
        </div>
      </section>
    </>
  );
}

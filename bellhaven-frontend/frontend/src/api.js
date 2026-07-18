const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080/api';

export function formatINR(n) {
  return '\u20b9' + Number(n).toLocaleString('en-IN');
}

export async function fetchRooms(preview) {
  const url = preview ? `${API_BASE}/rooms?preview=${preview}` : `${API_BASE}/rooms`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to load rooms');
  }
  return res.json();
}

// Checks how many rooms of a type are free for a date range. Returns
// { available: boolean, roomsLeft: number }. Throws only on network
// errors or bad input - "no rooms left" is a normal response, not
// an error.
export async function checkAvailability({ room, checkin, checkout }) {
  const params = new URLSearchParams({ room, checkin, checkout });
  const res = await fetch(`${API_BASE}/rooms/availability?${params.toString()}`);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || 'Could not check availability.');
  }

  return res.json();
}

// Returns { ok: true, data } on success, or { ok: false, errors } on
// a 400 validation response from the backend (field -> message map),
// matching the field ids the booking form uses: fullname, email,
// checkin, checkout, room.
export async function submitBooking(payload) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (res.status === 400) {
    const errors = await res.json();
    return { ok: false, errors };
  }

  if (!res.ok) {
    throw new Error('Booking request failed');
  }

  const data = await res.json();
  return { ok: true, data };
}

const USER_STORAGE_KEY = 'bellhavenUser';

// Fired on login/logout so components (e.g. Navbar) mounted elsewhere
// in the tree can react without a page reload.
function notifyAuthChanged() {
  window.dispatchEvent(new Event('bellhaven-auth-changed'));
}

// Stores the signed-in user and notifies the rest of the app. Shared
// by signin() and signup() - signing up counts as being signed in,
// so there's no need to make the user sign in again right after.
function storeSession(data) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data));
  notifyAuthChanged();
}

// Returns { ok: true, data } (an AuthResponse: id, fullName, email,
// role, message) on success, or { ok: false, errors } on a 400
// validation response (field -> message map): fullname, email, password.
// On success, also stores the user - signup logs you in immediately.
export async function signup(payload) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (res.status === 400) {
    const errors = await res.json();
    return { ok: false, errors };
  }

  if (!res.ok) {
    throw new Error('Signup request failed');
  }

  const data = await res.json();
  storeSession(data);
  return { ok: true, data };
}

// Same shape as signup(). On success, also stores the user in
// localStorage so the rest of the app knows who's signed in.
export async function signin(payload) {
  const res = await fetch(`${API_BASE}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (res.status === 400) {
    const errors = await res.json();
    return { ok: false, errors };
  }

  if (!res.ok) {
    throw new Error('Signin request failed');
  }

  const data = await res.json();
  storeSession(data);
  return { ok: true, data };
}

// Reads the signed-in user (as stored by signin()/signup()) out of
// localStorage, or null if nobody's signed in.
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(USER_STORAGE_KEY);
  notifyAuthChanged();
}

// Admin dashboard reads. There's no session/token in this project (see
// AdminController's notes), so we identify the caller by passing along
// the signed-in admin's email - the backend re-checks that this email
// actually belongs to an ADMIN account before returning data.
export async function fetchAdminBookings() {
  const res = await fetch(`${API_BASE}/admin/bookings`);
  if (!res.ok) {
    throw new Error('Failed to load bookings');
  }
  return res.json();
}

export async function fetchAdminUsers(adminEmail) {
  const url = `${API_BASE}/admin/users?adminEmail=${encodeURIComponent(adminEmail)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to load users');
  }
  return res.json();
}
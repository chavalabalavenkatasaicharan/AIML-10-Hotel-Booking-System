import React, { useEffect, useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../api';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const location = useLocation();
  const navigate = useNavigate();

  // Re-check on every route change (e.g. right after SignIn navigates
  // away) and whenever signin()/logout() fire the auth-changed event.
  useEffect(() => {
    setUser(getCurrentUser());
  }, [location]);

  useEffect(() => {
    const onAuthChanged = () => setUser(getCurrentUser());
    window.addEventListener('bellhaven-auth-changed', onAuthChanged);
    return () => window.removeEventListener('bellhaven-auth-changed', onAuthChanged);
  }, []);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate('/');
  }

  const linkClass = ({ isActive }) => (isActive ? 'active' : undefined);

  const navLinksStyle = menuOpen
    ? {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        background: '#fff',
        padding: '15px 20px',
        gap: '15px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }
    : undefined;

  return (
    <header>
      <div className="navbar">
        <Link to="/" className="logo">
          Bell<span>haven</span>
        </Link>
<nav className="nav-links" style={navLinksStyle}>
  <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>
    Home
  </NavLink>
  <NavLink to="/rooms" className={linkClass} onClick={() => setMenuOpen(false)}>
    Rooms
  </NavLink>
  <NavLink to="/amenities" className={linkClass} onClick={() => setMenuOpen(false)}>
    Amenities
  </NavLink>
  <NavLink to="/reviews" className={linkClass} onClick={() => setMenuOpen(false)}>
    Reviews
  </NavLink>
  <NavLink to="/contact" className={linkClass} onClick={() => setMenuOpen(false)}>
    Contact
  </NavLink>
  {user ? (
    <>
      {user.role === 'ADMIN' && (
        <NavLink to="/admin" className={linkClass} onClick={() => setMenuOpen(false)}>
          Admin
        </NavLink>
      )}
      <span className="auth-link" style={{ cursor: 'default' }}>
        Hi, {user.fullName.split(' ')[0]}
      </span>
      <a href="#logout" className="auth-link" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
        Logout
      </a>
    </>
  ) : (
    <NavLink to="/signin" className="auth-link" onClick={() => setMenuOpen(false)}>
      Login / Signup
    </NavLink>
  )}
</nav>
        <Link to="/book" className="book-now-btn">
          Book Now
        </Link>
        <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)}>
          &#9776;
        </button>
      </div>
    </header>
  );
}

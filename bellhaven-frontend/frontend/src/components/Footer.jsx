import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4>Bellhaven Boutique Hotel</h4>
            <p>Road No. 4, Banjara Hills, Hyderabad</p>
            <p>Family-run since 1998.</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <Link to="/rooms">Rooms</Link>
            <Link to="/amenities">Amenities</Link>
            <Link to="/book">Book Now</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div>
            <h4>Contact</h4>
            <a href="tel:+914040123456">+91 40 4012 3456</a>
            <a href="mailto:info@bellhavenhotel.in">info@bellhavenhotel.in</a>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 1998–2026 Bellhaven Boutique Hotel. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

import React from 'react';

export default function Contact() {
  return (
    <>
      <div className="page-banner">
        <h1>Find Us</h1>
        <p>Banjara Hills, Hyderabad</p>
      </div>

      <section>
        <div className="container">
          <div className="location-wrap">
            <div className="location-info">
              <p>
                <strong>Address:</strong> 8-2-120, Road No. 4, Banjara Hills, Hyderabad, Telangana
                500034
              </p>
              <p>
                <strong>Phone:</strong> +91 40 4012 3456
              </p>
              <p>
                <strong>Email:</strong> info@bellhavenhotel.in
              </p>
              <p>
                <strong>Check-in:</strong> 2:00 PM &nbsp; <strong>Check-out:</strong> 11:00 AM
              </p>
              <p>About 10 minutes from GVK One, a short drive from Banjara Hills Road No. 12.</p>
            </div>
            <div className="location-map">
              <iframe
                title="Bellhaven location map"
                src="https://www.google.com/maps?q=Banjara+Hills,+Hyderabad&output=embed"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

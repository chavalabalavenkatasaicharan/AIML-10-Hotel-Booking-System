import React from 'react';

const AMENITIES = [
  { icon: '📶', title: 'Free WiFi', desc: 'Throughout the building' },
  { icon: '🚗', title: 'Free Parking', desc: 'Small lot behind the hotel' },
  { icon: '🍳', title: 'Breakfast Included', desc: '7am–10:30am, in the courtyard' },
  { icon: '🧺', title: 'Laundry Service', desc: 'Next-day, ask at the desk' }
];

export default function Amenities() {
  return (
    <>
      <div className="page-banner">
        <h1>Amenities</h1>
        <p>The basics, done properly.</p>
      </div>

      <section className="amenities-bg">
        <div className="container">
          <div className="amenities-list">
            {AMENITIES.map((a) => (
              <div className="amenity-item" key={a.title}>
                <div className="icon">{a.icon}</div>
                <h4>{a.title}</h4>
                <p>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

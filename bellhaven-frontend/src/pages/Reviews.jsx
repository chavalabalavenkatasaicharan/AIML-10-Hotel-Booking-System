import React from 'react';

const TESTIMONIALS = [
  {
    stars: '★★★★★',
    quote:
      '"Stayed here for a work trip and ended up extending a night. The front desk gave us a better restaurant recommendation than any guidebook."',
    name: '— Priya M.'
  },
  {
    stars: '★★★★★',
    quote:
      '"Small hotel, but everything worked and the room was quiet. Breakfast in the courtyard was the best part honestly."',
    name: '— Daniel K.'
  },
  {
    stars: '★★★★☆',
    quote:
      '"Good value, close to everything in Banjara Hills. Parking lot is tiny so get there early if you\'re driving."',
    name: '— Aisha R.'
  }
];

export default function Reviews() {
  return (
    <>
      <div className="page-banner">
        <h1>What Guests Say</h1>
        <p>A few notes from recent stays.</p>
      </div>

      <section>
        <div className="container">
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div className="testimonial" key={t.name}>
                <div className="stars">{t.stars}</div>
                <p>{t.quote}</p>
                <div className="name">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

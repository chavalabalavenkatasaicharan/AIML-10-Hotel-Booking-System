import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import { fetchRooms } from '../api';

export default function Home() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [guests, setGuests] = useState('2 Guests');
  const [checkoutError, setCheckoutError] = useState('');

  const todayISO = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchRooms(3)
      .then(setRooms)
      .catch(() => setRooms([]));
  }, []);

  function handleCheckinChange(e) {
    const value = e.target.value;
    setCheckin(value);
    if (value) {
      const next = new Date(value);
      next.setDate(next.getDate() + 1);
      const nextISO = next.toISOString().split('T')[0];
      if (checkout && checkout <= value) {
        setCheckout(nextISO);
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (checkin && checkout && new Date(checkout) <= new Date(checkin)) {
      setCheckoutError('Check-out must be after check-in.');
      return;
    }
    setCheckoutError('');

    const params = new URLSearchParams();
    if (checkin) params.set('checkin', checkin);
    if (checkout) params.set('checkout', checkout);
    const guestsMatch = guests.match(/\d+/);
    if (guestsMatch) params.set('guests', guestsMatch[0]);

    navigate(`/book${params.toString() ? '?' + params.toString() : ''}`);
  }

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Bellhaven Boutique Hotel</h1>
          <p>
            A small 18-room hotel in Banjara Hills, Hyderabad, run by the same family since 1998.
            Check availability below or just give us a call.
          </p>

          <form className="booking-widget" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="qCheckin">Check-in</label>
              <input
                type="date"
                id="qCheckin"
                min={todayISO}
                value={checkin}
                onChange={handleCheckinChange}
              />
            </div>
            <div className="field">
              <label htmlFor="qCheckout">Check-out</label>
              <input
                type="date"
                id="qCheckout"
                min={checkin || todayISO}
                value={checkout}
                onChange={(e) => setCheckout(e.target.value)}
                title={checkoutError}
              />
            </div>
            <div className="field">
              <label htmlFor="qGuests">Guests</label>
              <select id="qGuests" value={guests} onChange={(e) => setGuests(e.target.value)}>
                <option>1 Guest</option>
                <option>2 Guests</option>
                <option>3 Guests</option>
                <option>4 Guests</option>
              </select>
            </div>
            <button type="submit">Check Availability</button>
          </form>
        </div>
      </section>

      <section className="about">
        <div className="container about">
          <img src="/images/Hotel.jpg" alt="Hotel lobby" />
          <div className="about-text">
            <h2>About Bellhaven</h2>
            <p>
              We opened Bellhaven in 1998 in a converted bungalow just off Road No. 4 in Banjara
              Hills. It's still owned and run by the same family, and most of our staff have been
              with us for years.
            </p>
            <p>
              We don't have a pool or a gym. What we do have is 18 quiet rooms, a good breakfast,
              and someone at the front desk who actually knows the neighborhood if you ask for
              recommendations.
            </p>
            <p>Free parking, free wifi, and check-in from 2pm. Early arrivals are welcome to leave luggage with us.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-title">
            <h2>A Few of Our Rooms</h2>
            <p>Six room types in total, all with private bathrooms and free wifi.</p>
          </div>
          <div className="rooms-grid">
            {rooms.map((room) => (
              <RoomCard key={room.name} room={room} />
            ))}
          </div>
          <div className="view-all-link">
            <Link to="/rooms">View all rooms &rarr;</Link>
          </div>
        </div>
      </section>
    </>
  );
}

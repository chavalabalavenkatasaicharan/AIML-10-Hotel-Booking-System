import React from "react";
import { useNavigate } from "react-router-dom";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  function handleBookNow() {
    navigate(`/book?room=${encodeURIComponent(room.name)}`);
  }

  return (
    <div className="room-card">
      <img
        src={room.image}
        alt={room.name}
        className="room-image"
      />

      <div className="room-content">
        <h3>{room.name}</h3>

        <p>{room.description}</p>

        <h4 className="room-price">
          ₹{room.price.toLocaleString("en-IN")} <span>/ night</span>
        </h4>

        <button className="room-book-btn" onClick={handleBookNow}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
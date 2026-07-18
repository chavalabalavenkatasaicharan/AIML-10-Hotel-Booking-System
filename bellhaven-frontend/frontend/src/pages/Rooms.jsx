import React from "react";
import RoomCard from "../components/RoomCard";

const rooms = [
  {
    name: "Standard Single",
    price: 1999,
    description: "A comfortable retreat designed for the solo guest, featuring a plush queen-size bed and thoughtful in-room amenities",
    image: "/images/standard-single.jpeg",
  },
  {
    name: "Standard Double",
    price: 2999,
    description: "Ideal for friends or family, this roomy option comes with two double beds and offers lovely views of the city skyline.",
    image: "/images/standard-double.jpeg",
  },
  {
    name: "Superior Room King Bed",
    price: 3999,
    description: "Escape to a peaceful space with a king-size bed, tucked away with serene views of the garden courtyard below.",
    image: "/images/SUPERIOR_KING.avif",
  },
  {
    name: "Deluxe Room",
    price: 5999,
    description: "Generously sized with two queen beds, this room comfortably accommodates families of up to four for a relaxed stay",
    image: "/images/Deluxe-room.jpeg",
  },
  {

    name: "Superior Double",
    price: 7499,
    description: "A spacious layout featuring two queen beds, well-suited for larger families of up to six travelling together.",
    image: "/images/premium-room.jpeg"
  },
  {
    name: "Premium Room",
    price: 8999,
    description: "Perched at the top of the building, this room rewards guests with a stunning, elevated view of the surroundings.",
    image:"/images/superior-double.jpeg"

  }

];

export default function Rooms() {
  return (
    <>
      <div className="page-banner">
        <h1>Our Rooms</h1>
        <p>Choose the perfect room for your stay at Bellhaven Boutique Hotel.</p>
      </div>

      <section className="rooms-section">
        <div className="container">
          <div className="rooms-grid">
            {rooms.map((room) => (
              <RoomCard key={room.name} room={room} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
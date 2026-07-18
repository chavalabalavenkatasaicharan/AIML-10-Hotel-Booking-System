-- Source of truth for room data, served via GET /api/rooms.
-- Rooms.jsx, Home.jsx, and Book.jsx all fetch this list from the API -
-- none of them hardcode room data anymore. Image paths below must
-- match files that actually exist under frontend/public/images/.
-- total_rooms is how many physical rooms of that type the hotel has,
-- used to work out real availability against existing bookings.

INSERT INTO rooms (name, price, description, image, display_order, total_rooms) VALUES
('Standard Single', 1999, 'Cozy room with a queen bed, perfect for solo travelers.', '/images/standard-single.jpeg', 1, 5),
('Standard Double', 2999, 'Spacious room with two double beds and a city view.', '/images/standard-double.jpeg', 2, 5),
('Superior Room King Bed', 3999, 'Quiet room overlooking the courtyard garden.', '/images/SUPERIOR_KING.avif', 3, 3),
('Deluxe Room', 5999, 'Two queen beds, ideal for families of up to 4.', '/images/Deluxe-room.jpeg', 4, 4),
('Superior Double', 7499, 'Two queen beds, ideal for families of up to 6.', '/images/superior-double.jpeg', 5, 4),
('Premium Room', 8999, 'At the top of the building with a nice view.', '/images/premium-room.jpeg', 6, 2);
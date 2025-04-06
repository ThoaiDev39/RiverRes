-- Insert Users (10 accounts including 3 admins)
INSERT INTO Users (username, email, password, role, birth, gender, phone, address, created_at, updated_at) VALUES
-- Admin accounts
('admin1', 'admin1@riverres.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', '1990-01-01', 'male', '0123456789', '123 Admin St', NOW(), NOW()),
('admin2', 'admin2@riverres.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', '1991-02-02', 'female', '0123456788', '124 Admin St', NOW(), NOW()),
('admin3', 'admin3@riverres.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', '1992-03-03', 'male', '0123456787', '125 Admin St', NOW(), NOW()),
-- Regular user accounts
('user1', 'user1@example.com', '$2a$10$8K1p/a0dL1LXMIZoIqPK6.QpQqHh0Y0QqHh0Y0QqHh0Y0QqHh0Y0Q', 'user', '1993-04-04', 'female', '0123456786', '126 User St', NOW(), NOW()),
('user2', 'user2@example.com', '$2a$10$8K1p/a0dL1LXMIZoIqPK6.QpQqHh0Y0QqHh0Y0QqHh0Y0QqHh0Y0Q', 'user', '1994-05-05', 'male', '0123456785', '127 User St', NOW(), NOW()),
('user3', 'user3@example.com', '$2a$10$8K1p/a0dL1LXMIZoIqPK6.QpQqHh0Y0QqHh0Y0QqHh0Y0QqHh0Y0Q', 'user', '1995-06-06', 'female', '0123456784', '128 User St', NOW(), NOW()),
('user4', 'user4@example.com', '$2a$10$8K1p/a0dL1LXMIZoIqPK6.QpQqHh0Y0QqHh0Y0QqHh0Y0QqHh0Y0Q', 'user', '1996-07-07', 'male', '0123456783', '129 User St', NOW(), NOW()),
('user5', 'user5@example.com', '$2a$10$8K1p/a0dL1LXMIZoIqPK6.QpQqHh0Y0QqHh0Y0QqHh0Y0QqHh0Y0Q', 'user', '1997-08-08', 'female', '0123456782', '130 User St', NOW(), NOW()),
('user6', 'user6@example.com', '$2a$10$8K1p/a0dL1LXMIZoIqPK6.QpQqHh0Y0QqHh0Y0QqHh0Y0QqHh0Y0Q', 'user', '1998-09-09', 'male', '0123456781', '131 User St', NOW(), NOW()),
('user7', 'user7@example.com', '$2a$10$8K1p/a0dL1LXMIZoIqPK6.QpQqHh0Y0QqHh0Y0QqHh0Y0QqHh0Y0Q', 'user', '1999-10-10', 'female', '0123456780', '132 User St', NOW(), NOW());

-- Insert Halls (4 halls)
INSERT INTO Halls (name, capacity, price, image, description, createdAt, updatedAt) VALUES
('Grand Ballroom', 200, 5000000, 'grand_ballroom.jpg', 'Luxurious ballroom perfect for large weddings and corporate events', NOW(), NOW()),
('Garden Hall', 100, 3000000, 'garden_hall.jpg', 'Beautiful garden view hall for intimate gatherings', NOW(), NOW()),
('River View Hall', 150, 4000000, 'river_view_hall.jpg', 'Stunning river view hall with modern amenities', NOW(), NOW()),
('VIP Hall', 50, 2000000, 'vip_hall.jpg', 'Exclusive VIP hall for premium events', NOW(), NOW());

-- Insert TimeSlots
INSERT INTO TimeSlots (name, startTime, endTime, description, createdAt, updatedAt) VALUES
('Morning', '08:00:00', '12:00:00', 'Morning event slot', NOW(), NOW()),
('Afternoon', '13:00:00', '17:00:00', 'Afternoon event slot', NOW(), NOW()),
('Evening', '18:00:00', '22:00:00', 'Evening event slot', NOW(), NOW()),
('Night', '19:00:00', '23:00:00', 'Night event slot', NOW(), NOW());

-- Insert Menus (4 menus)
INSERT INTO Menus (name, description, totalPrice, image, createdAt, updatedAt) VALUES
('Premium Menu', 'Luxury dining experience with premium dishes', 1500000, 'premium_menu.jpg', NOW(), NOW()),
('Standard Menu', 'Classic dishes for traditional events', 1000000, 'standard_menu.jpg', NOW(), NOW()),
('Budget Menu', 'Affordable yet delicious options', 800000, 'budget_menu.jpg', NOW(), NOW()),
('Vegetarian Menu', 'Healthy and delicious vegetarian options', 1200000, 'vegetarian_menu.jpg', NOW(), NOW());

-- Insert MenuItems for each menu
-- Premium Menu Items
-- Insert Dishes
INSERT INTO Dishes (name, description, price, image, createdAt, updatedAt) VALUES
('Lobster Thermidor', 'Classic French lobster dish', 500000, 'lobster_thermidor.jpg', NOW(), NOW()),
('Wagyu Beef Steak', 'Premium Japanese beef', 800000, 'wagyu_beef.jpg', NOW(), NOW()),
('Truffle Risotto', 'Creamy risotto with black truffle', 300000, 'truffle_risotto.jpg', NOW(), NOW()),
('Grilled Salmon', 'Fresh Atlantic salmon', 300000, 'grilled_salmon.jpg', NOW(), NOW()),
('Beef Tenderloin', 'Classic beef tenderloin', 400000, 'beef_tenderloin.jpg', NOW(), NOW()),
('Chicken Alfredo', 'Creamy pasta with chicken', 200000, 'chicken_alfredo.jpg', NOW(), NOW()),
('Spaghetti Bolognese', 'Classic Italian pasta', 150000, 'spaghetti_bolognese.jpg', NOW(), NOW()),
('Grilled Chicken', 'Herb-marinated chicken', 200000, 'grilled_chicken.jpg', NOW(), NOW()),
('Vegetable Stir Fry', 'Fresh mixed vegetables', 100000, 'vegetable_stir_fry.jpg', NOW(), NOW()),
('Mushroom Risotto', 'Creamy mushroom risotto', 250000, 'mushroom_risotto.jpg', NOW(), NOW()),
('Vegetable Curry', 'Spicy vegetable curry', 200000, 'vegetable_curry.jpg', NOW(), NOW()),
('Quinoa Bowl', 'Healthy quinoa with vegetables', 180000, 'quinoa_bowl.jpg', NOW(), NOW());

-- Insert MenuDish relationships
INSERT INTO MenuDishes (menuId, dishId, quantity) VALUES
(1, 1, 1),  -- Lobster Thermidor
(1, 2, 1),  -- Wagyu Beef Steak
(1, 3, 1),  -- Truffle Risotto

(2, 4, 1),  -- Grilled Salmon
(2, 5, 1),  -- Beef Tenderloin
(2, 6, 1),  -- Chicken Alfredo

(3, 7, 1),  -- Spaghetti Bolognese
(3, 8, 1),  -- Grilled Chicken
(3, 9, 1),  -- Vegetable Stir Fry

(4, 10, 1), -- Mushroom Risotto
(4, 11, 1), -- Vegetable Curry
(4, 12, 1); -- Quinoa Bowl
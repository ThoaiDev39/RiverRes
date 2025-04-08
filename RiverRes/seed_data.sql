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
('Paradise Hall', 200, 5000000, 'grand_ballroom.jpg', 'Sảnh tiệc sang trọng hoàn hảo cho các đám cưới lớn và sự kiện doanh nghiệp', NOW(), NOW()),
('Bliss Hall', 100, 3000000, 'garden_hall.jpg', 'Sảnh với tầm nhìn ra vườn đẹp cho các buổi họp mặt thân mật', NOW(), NOW()),
('SPearl Hall', 150, 4000000, 'river_view_hall.jpg', 'Sảnh với tầm nhìn ra sông tuyệt đẹp và tiện nghi hiện đại', NOW(), NOW()),
('Sunrise Hall', 50, 2000000, 'vip_hall.jpg', 'Sảnh VIP độc quyền cho các sự kiện cao cấp', NOW(), NOW());

-- Insert TimeSlots
INSERT INTO TimeSlots (name, startTime, endTime, description, createdAt, updatedAt) VALUES
('Buổi sáng', '08:00:00', '12:00:00', 'Khung giờ sự kiện buổi sáng', NOW(), NOW()),
('Buổi chiều', '13:00:00', '17:00:00', 'Khung giờ sự kiện buổi chiều', NOW(), NOW()),
('Buổi tối', '18:00:00', '22:00:00', 'Khung giờ sự kiện buổi tối', NOW(), NOW()),
('Đêm', '19:00:00', '23:00:00', 'Khung giờ sự kiện đêm', NOW(), NOW());

-- Insert Menus (4 menus)
INSERT INTO Menus (name, description, totalPrice, image, createdAt, updatedAt) VALUES
('Thực đơn cao cấp', 'Trải nghiệm ẩm thực sang trọng với các món ăn cao cấp', 1500000, 'premium_menu.jpg', NOW(), NOW()),
('Thực đơn tiêu chuẩn', 'Các món ăn cổ điển cho các sự kiện truyền thống', 1000000, 'standard_menu.jpg', NOW(), NOW()),
('Thực đơn tiết kiệm', 'Các lựa chọn ngon miệng nhưng giá cả phải chăng', 800000, 'budget_menu.jpg', NOW(), NOW()),
('Thực đơn chay', 'Các lựa chọn chay lành mạnh và ngon miệng', 1200000, 'vegetarian_menu.jpg', NOW(), NOW());

-- Insert MenuItems for each menu
-- Premium Menu Items
-- Insert Dishes
INSERT INTO Dishes (name, description, price, image, createdAt, updatedAt) VALUES
('Tôm hùm Thermidor', 'Món tôm hùm Pháp cổ điển', 500000, 'lobster_thermidor.jpg', NOW(), NOW()),
('Bít tết Wagyu', 'Thịt bò Nhật Bản cao cấp', 800000, 'wagyu_beef.jpg', NOW(), NOW()),
('Risotto nấm truffle', 'Risotto kem với nấm truffle đen', 300000, 'truffle_risotto.jpg', NOW(), NOW()),
('Cá hồi nướng', 'Cá hồi Đại Tây Dương tươi ngon', 300000, 'grilled_salmon.jpg', NOW(), NOW()),
('Thịt bò tenderloin', 'Thịt bò tenderloin cổ điển', 400000, 'beef_tenderloin.jpg', NOW(), NOW()),
('Mì Ý Alfredo gà', 'Mì kem với gà', 200000, 'chicken_alfredo.jpg', NOW(), NOW()),
('Mì Ý Bolognese', 'Mì Ý cổ điển', 150000, 'spaghetti_bolognese.jpg', NOW(), NOW()),
('Gà nướng', 'Gà ướp thảo mộc', 200000, 'grilled_chicken.jpg', NOW(), NOW()),
('Rau xào', 'Rau củ tươi ngon', 100000, 'vegetable_stir_fry.jpg', NOW(), NOW()),
('Risotto nấm', 'Risotto nấm kem', 250000, 'mushroom_risotto.jpg', NOW(), NOW()),
('Cà ri rau', 'Cà ri rau cay', 200000, 'vegetable_curry.jpg', NOW(), NOW()),
('Bát quinoa', 'Quinoa lành mạnh với rau củ', 180000, 'quinoa_bowl.jpg', NOW(), NOW());

-- Insert MenuDish relationships
INSERT INTO MenuDishes (menuId, dishId, quantity) VALUES
(1, 1, 1),  -- Tôm hùm Thermidor
(1, 2, 1),  -- Bít tết Wagyu
(1, 3, 1),  -- Risotto nấm truffle

(2, 4, 1),  -- Cá hồi nướng
(2, 5, 1),  -- Thịt bò tenderloin
(2, 6, 1),  -- Mì Ý Alfredo gà

(3, 7, 1),  -- Mì Ý Bolognese
(3, 8, 1),  -- Gà nướng
(3, 9, 1),  -- Rau xào

(4, 10, 1), -- Risotto nấm
(4, 11, 1), -- Cà ri rau
(4, 12, 1); -- Bát quinoa

// Vào trang đăng ký tạo tài khoản có email như sau email = 'admin123@gmail.com'
// sau đó chạy sql tron mysql
UPDATE Users SET role = 'admin' WHERE email = 'admin123@gmail.com';
// Vào lại trang , mở F12, phần app -> local storage -> localhost:5173 -> xóa token > F5 và đăng nhập lại

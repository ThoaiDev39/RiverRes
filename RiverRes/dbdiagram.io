// RiverRes Database Schema

// Users table
Table Users {
  id integer [pk, increment]
  username string [not null, unique]
  email string [not null, unique]
  password string [not null]
  fullName string
  phone string
  address string
  role string [default: 'user'] // 'user', 'admin'
  createdAt datetime [default: `now()`]
  updatedAt datetime [default: `now()`]
}

// Halls table
Table Halls {
  id integer [pk, increment]
  name string [not null]
  capacity integer [not null]
  price decimal [not null]
  image string
  description text
  createdAt datetime [default: `now()`]
  updatedAt datetime [default: `now()`]
}

// TimeSlots table
Table TimeSlots {
  id integer [pk, increment]
  name string [not null]
  startTime time [not null]
  endTime time [not null]
  description string
  createdAt datetime [default: `now()`]
  updatedAt datetime [default: `now()`]
}

// Menus table
Table Menus {
  id integer [pk, increment]
  name string [not null]
  description text
  totalPrice decimal [not null]
  image string
  createdAt datetime [default: `now()`]
  updatedAt datetime [default: `now()`]
}

// Events table
Table Events {
  id integer [pk, increment]
  userId integer [ref: > Users.id, not null]
  hallId integer [ref: > Halls.id, not null]
  timeSlotId integer [ref: > TimeSlots.id, not null]
  menuId integer [ref: > Menus.id, not null]
  eventDate date [not null]
  numberOfTables integer [not null]
  status string [default: 'pending'] // 'pending', 'confirmed', 'paid', 'cancelled'
  totalPrice decimal [not null, default: 0]
  createdAt datetime [default: `now()`]
  updatedAt datetime [default: `now()`]

  indexes {
    (userId, eventDate)
    (hallId, eventDate, timeSlotId) [unique]
  }
}

// MenuItems table
Table MenuItems {
  id integer [pk, increment]
  menuId integer [ref: > Menus.id, not null]
  name string [not null]
  description text
  price decimal [not null]
  image string
  createdAt datetime [default: `now()`]
  updatedAt datetime [default: `now()`]
}

// Payments table
Table Payments {
  id integer [pk, increment]
  eventId integer [ref: > Events.id, not null]
  amount decimal [not null]
  paymentMethod string [not null]
  status string [not null] // 'pending', 'completed', 'failed'
  transactionId string
  createdAt datetime [default: `now()`]
  updatedAt datetime [default: `now()`]
} 
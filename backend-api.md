# Backend API Documentation

## Event Booking API

### User APIs

#### 1. Kiểm tra TimeSlot trống cho Sảnh
Kiểm tra các khung giờ còn trống cho một sảnh cụ thể vào ngày được chọn.

```http
GET /api/hall/{hallId}/available-time-slots
```

**Parameters:**
- `hallId`: ID của sảnh (path parameter)
- `date`: Ngày muốn đặt (query parameter, format: YYYY-MM-DD)

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Buổi sáng",
            "startTime": "08:00:00",
            "endTime": "14:00:00",
            "isAvailable": true
        },
        {
            "id": 2,
            "name": "Buổi chiều",
            "startTime": "15:00:00",
            "endTime": "20:00:00",
            "isAvailable": false
        },
        {
            "id": 3,
            "name": "Buổi tối",
            "startTime": "17:00:00",
            "endTime": "23:00:00",
            "isAvailable": true
        }
    ]
}
```

#### 2. Kiểm tra tính khả dụng của Sảnh
Double-check xem sảnh có thực sự còn trống cho khung giờ đã chọn không.

```http
POST /api/event/check-hall-availability
```

**Request Body:**
```json
{
    "hallId": 1,
    "eventDate": "2024-04-06",
    "timeSlotId": 1
}
```

**Response:**
```json
{
    "isAvailable": true,
    "message": "Sảnh khả dụng cho khung giờ này"
}
```

#### 3. Tạo Event mới (Dành cho User)
API để người dùng đặt tiệc.

```http
POST /api/event/booking
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
    "hallId": 1,
    "timeSlotId": 1,
    "menuId": 1,
    "eventDate": "2024-04-06",
    "numberOfTables": 10,
    "notes": "Ghi chú thêm về yêu cầu đặc biệt (nếu có)"
}
```

**Response Success:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "userId": 1,
        "hallId": 1,
        "timeSlotId": 1,
        "menuId": 1,
        "eventDate": "2024-04-06",
        "numberOfTables": 10,
        "status": "pending",
        "notes": "Ghi chú thêm về yêu cầu đặc biệt (nếu có)",
        "createdAt": "2024-04-06T10:00:00.000Z"
    }
}
```

**Response Error:**
```json
{
    "success": false,
    "message": "Lỗi cụ thể"
}
```

### Admin APIs

#### 1. Tạo Event (Dành cho Admin)
API để admin tạo event với quyền đặc biệt.

```http
POST /api/event
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
    "userId": 1,        // Admin có thể chỉ định user
    "hallId": 1,
    "timeSlotId": 1,
    "menuId": 1,
    "eventDate": "2024-04-06",
    "numberOfTables": 10,
    "status": "confirmed",  // Admin có thể set status
    "notes": "Ghi chú thêm về yêu cầu đặc biệt (nếu có)"
}
```

**Response Success:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "userId": 1,
        "hallId": 1,
        "timeSlotId": 1,
        "menuId": 1,
        "eventDate": "2024-04-06",
        "numberOfTables": 10,
        "status": "confirmed",
        "notes": "Ghi chú thêm về yêu cầu đặc biệt (nếu có)",
        "createdAt": "2024-04-06T10:00:00.000Z"
    }
}
```

#### 2. Cập nhật trạng thái Event
API để admin cập nhật trạng thái của event.

```http
PATCH /api/event/{eventId}/status
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
    "status": "confirmed" // pending, confirmed, paid, cancelled
}
```

**Response:**
```json
{
    "success": true,
    "message": "Cập nhật trạng thái thành công"
}
```

### 4. Lấy thông tin Event
Lấy chi tiết của một event đã đặt.

```http
GET /api/event/{eventId}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "userId": 1,
        "hallId": 1,
        "timeSlotId": 1,
        "menuId": 1,
        "eventDate": "2024-04-06",
        "numberOfTables": 10,
        "status": "pending",
        "notes": "Ghi chú thêm về yêu cầu đặc biệt (nếu có)",
        "hall": {
            "id": 1,
            "name": "Tên sảnh",
            "capacity": 50
        },
        "timeSlot": {
            "id": 1,
            "name": "Buổi sáng",
            "startTime": "08:00:00",
            "endTime": "14:00:00"
        },
        "menu": {
            "id": 1,
            "name": "Tên menu"
        }
    }
}
```

## Quy trình đặt tiệc

### Bước 1: Chọn Sảnh và Ngày
1. Frontend hiển thị form cho người dùng chọn sảnh và ngày
2. Gọi API kiểm tra TimeSlot trống cho sảnh đã chọn
3. Hiển thị các TimeSlot có sẵn cho người dùng chọn

### Bước 2: Chọn TimeSlot
1. Người dùng chọn TimeSlot từ danh sách có sẵn
2. Gọi API kiểm tra tính khả dụng của sảnh để double-check
3. Nếu khả dụng, cho phép người dùng tiếp tục. Nếu không, thông báo lỗi

### Bước 3: Điền thông tin đặt tiệc
1. Hiển thị form cho người dùng điền:
   - Số lượng bàn
   - Chọn menu
   - Ghi chú thêm (nếu có)
2. Validate thông tin trước khi gửi:
   - Số bàn không vượt quá sức chứa của sảnh
   - Menu phải được chọn
   - Ngày phải lớn hơn ngày hiện tại

### Bước 4: Xác nhận đặt tiệc
1. Gọi API tạo Event mới
2. Hiển thị thông báo thành công/thất bại
3. Nếu thành công, có thể chuyển hướng đến trang chi tiết Event

## Lưu ý
1. Tất cả các request đều cần token xác thực (trừ check available-time-slots)
2. Format ngày phải là "YYYY-MM-DD"
3. Số bàn phải nằm trong giới hạn sức chứa của sảnh
4. Status của event sẽ tự động là "pending" khi người dùng đặt
5. Chỉ admin mới có thể thay đổi status của event

## Error Codes
- 400: Bad Request - Dữ liệu không hợp lệ
- 401: Unauthorized - Chưa đăng nhập
- 403: Forbidden - Không có quyền
- 404: Not Found - Không tìm thấy resource
- 409: Conflict - Sảnh đã được đặt
- 500: Internal Server Error - Lỗi server 
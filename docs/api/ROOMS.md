# Rooms API Documentation

## Overview

The Rooms resource manages individual rental units. Rooms can be attached to Properties and have an availability system to prevent double-booking.

---

## Schema

```typescript
{
  _id: ObjectId (auto-generated)
  name: string (required)
  description: string (required)
  surface: number (required, in m²)
  price: number (required, rental price)
  property: ObjectId (reference to Property, null when not attached)
  isAvailable: boolean (default: true)
}
```

---

## Endpoints

### 1. Create Room

**POST** `/rooms`

Creates a new room. Room is created as available by default.

**Request Body**:

```json
{
  "name": "Master Bedroom",
  "description": "Large room with private bathroom",
  "surface": 25,
  "price": 600
}
```

**Response** (201 Created):

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Master Bedroom",
  "description": "Large room with private bathroom",
  "surface": 25,
  "price": 600,
  "property": null,
  "isAvailable": true
}
```

**Example**:

```bash
curl -X POST http://localhost:3000/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Master Bedroom",
    "description": "Large room with private bathroom",
    "surface": 25,
    "price": 600
  }'
```

---

### 2. Get All Rooms

**GET** `/rooms`

Returns all rooms (both available and attached).

**Response** (200 OK):

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Master Bedroom",
    "description": "Large room with private bathroom",
    "surface": 25,
    "price": 600,
    "property": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Downtown Apartment"
    },
    "isAvailable": false
  },
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Single Room",
    "description": "Cozy single room",
    "surface": 15,
    "price": 400,
    "property": null,
    "isAvailable": true
  }
]
```

**Example**:

```bash
curl http://localhost:3000/rooms
```

---

### 3. Get Available Rooms ⭐ IMPORTANT

**GET** `/rooms/available`

Returns only rooms that are **not attached** to any property. **Use this endpoint in your frontend select!**

**Response** (200 OK):

```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Single Room",
    "description": "Cozy single room",
    "surface": 15,
    "price": 400,
    "property": null,
    "isAvailable": true
  }
]
```

**Use Case**: When creating or updating a Property, fetch available rooms to populate the room selection dropdown.

**Example**:

```bash
curl http://localhost:3000/rooms/available
```

**Frontend Example**:

```javascript
// Fetch available rooms for property form
const response = await fetch('/rooms/available');
const availableRooms = await response.json();

// Populate select
const select = document.getElementById('roomSelect');
availableRooms.forEach((room) => {
  const option = document.createElement('option');
  option.value = room._id;
  option.text = `${room.name} - ${room.surface}m² - €${room.price}`;
  select.appendChild(option);
});
```

---

### 4. Get Room by ID

**GET** `/rooms/:id`

Returns a single room with populated property information.

**Response** (200 OK):

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Master Bedroom",
  "description": "Large room with private bathroom",
  "surface": 25,
  "price": 600,
  "property": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Downtown Apartment",
    "address": "123 Main St"
  },
  "isAvailable": false
}
```

**Error Response** (404 Not Found):

```json
{
  "statusCode": 404,
  "message": "Room with ID 507f1f77bcf86cd799439011 not found"
}
```

**Example**:

```bash
curl http://localhost:3000/rooms/507f1f77bcf86cd799439011
```

---

### 5. Update Room

**PATCH** `/rooms/:id`

Updates room information. **Cannot update if room is attached to a property.**

**Request Body**:

```json
{
  "price": 650,
  "description": "Updated description"
}
```

**Response** (200 OK):

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Master Bedroom",
  "description": "Updated description",
  "surface": 25,
  "price": 650,
  "property": null,
  "isAvailable": true
}
```

**Error Response** (400 Bad Request) - If room is attached:

```json
{
  "statusCode": 400,
  "message": "This room is already attached to a property and cannot be modified"
}
```

**Example**:

```bash
curl -X PATCH http://localhost:3000/rooms/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 650
  }'
```

---

### 6. Attach Room to Property

**PATCH** `/rooms/:roomId/attach/:propertyId`

Attaches a room to a property. Room must be available.

**Response** (200 OK):

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Master Bedroom",
  "description": "Large room with private bathroom",
  "surface": 25,
  "price": 600,
  "property": "507f1f77bcf86cd799439012",
  "isAvailable": false
}
```

**Effect**:

- `room.property` is set to propertyId
- `room.isAvailable` is set to `false`
- Room **disappears** from `/rooms/available`

**Error Response** (400 Bad Request) - If room is already attached:

```json
{
  "statusCode": 400,
  "message": "This room is already attached to another property"
}
```

**Example**:

```bash
curl -X PATCH http://localhost:3000/rooms/507f1f77bcf86cd799439011/attach/507f1f77bcf86cd799439012
```

**Note**: Usually you don't call this endpoint directly. Instead, pass `roomIds` when creating/updating a Property, and the system handles attachment automatically.

---

### 7. Detach Room from Property

**PATCH** `/rooms/:roomId/detach`

Detaches a room from its property, making it available again.

**Response** (200 OK):

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Master Bedroom",
  "description": "Large room with private bathroom",
  "surface": 25,
  "price": 600,
  "property": null,
  "isAvailable": true
}
```

**Effect**:

- `room.property` is set to `null`
- `room.isAvailable` is set to `true`
- Room **reappears** in `/rooms/available`

**Example**:

```bash
curl -X PATCH http://localhost:3000/rooms/507f1f77bcf86cd799439011/detach
```

---

### 8. Delete Room

**DELETE** `/rooms/:id`

Deletes a room. **Can only delete if room is available (not attached).**

**Response** (200 OK):

```json
{
  "message": "Room deleted successfully"
}
```

**Error Response** (400 Bad Request) - If room is attached:

```json
{
  "statusCode": 400,
  "message": "Cannot delete a room that is attached to a property"
}
```

**Example**:

```bash
curl -X DELETE http://localhost:3000/rooms/507f1f77bcf86cd799439011
```

---

## Business Rules

### ✅ Allowed Operations

1. **Create room without property**

   ```bash
   POST /rooms
   # Room is created with isAvailable=true, property=null
   ```

2. **Attach available room to property**

   ```bash
   PATCH /rooms/:roomId/attach/:propertyId
   # Only works if isAvailable=true
   ```

3. **Detach room from property**

   ```bash
   PATCH /rooms/:roomId/detach
   # Room becomes available again
   ```

4. **Update available room**

   ```bash
   PATCH /rooms/:id
   # Only works if isAvailable=true
   ```

5. **Delete available room**
   ```bash
   DELETE /rooms/:id
   # Only works if isAvailable=true
   ```

### ❌ Forbidden Operations

1. **Attach already attached room**
   - Returns 400 error
   - Message: "This room is already attached to another property"

2. **Update attached room**
   - Returns 400 error
   - Message: "This room is already attached to a property and cannot be modified"

3. **Delete attached room**
   - Returns 400 error
   - Message: "Cannot delete a room that is attached to a property"

---

## Availability System

### How It Works

```
┌─────────────────┐
│  Create Room    │
│ isAvailable=true│
│  property=null  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Appears in      │
│ /rooms/available│
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Attach to       │
│ Property        │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│isAvailable=false│
│property=ID      │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Does NOT appear │
│ in /rooms/      │
│ available       │
└─────────────────┘
```

### Query Logic

**Available Rooms**:

```typescript
find({ isAvailable: true, property: null });
```

**Attached Rooms**:

```typescript
find({ isAvailable: false, property: { $ne: null } });
```

---

## Integration with Property

### Automatic Attachment

When creating a Property with `roomIds`:

```bash
curl -X POST http://localhost:3000/property \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Apartment",
    "roomIds": ["ROOM_ID_1", "ROOM_ID_2"],
    ...
  }'
```

**What happens**:

1. Property is created
2. Each room in `roomIds` is automatically attached
3. Rooms become unavailable
4. Rooms disappear from `/rooms/available`

### Automatic Detachment

When deleting a Property:

```bash
curl -X DELETE http://localhost:3000/property/PROPERTY_ID
```

**What happens**:

1. All rooms attached to this property are detached
2. Rooms become available again
3. Rooms reappear in `/rooms/available`
4. Property is deleted

---

## Common Workflows

### 1. Create and List Available Rooms

```bash
# Create room 1
curl -X POST http://localhost:3000/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Room A",
    "description": "First room",
    "surface": 20,
    "price": 500
  }'

# Create room 2
curl -X POST http://localhost:3000/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Room B",
    "description": "Second room",
    "surface": 25,
    "price": 600
  }'

# List available rooms
curl http://localhost:3000/rooms/available
# Both rooms appear
```

### 2. Attach Room to Property

```bash
# Method 1: Via Property creation (recommended)
curl -X POST http://localhost:3000/property \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Property",
    "roomIds": ["ROOM_A_ID", "ROOM_B_ID"],
    ...
  }'

# Method 2: Direct attachment
curl -X PATCH http://localhost:3000/rooms/ROOM_A_ID/attach/PROPERTY_ID
```

### 3. Update Property Rooms

```bash
# Update property to use different rooms
curl -X PATCH http://localhost:3000/property/PROPERTY_ID \
  -H "Content-Type: application/json" \
  -d '{
    "roomIds": ["ROOM_C_ID"]
  }'

# Old rooms (A, B) are automatically detached
# New room (C) is automatically attached
```

---

## Frontend Integration

### React Example

```jsx
import { useState, useEffect } from 'react';

function PropertyForm() {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);

  useEffect(() => {
    // Fetch available rooms
    fetch('/rooms/available')
      .then((res) => res.json())
      .then((data) => setAvailableRooms(data));
  }, []);

  const handleSubmit = async (formData) => {
    await fetch('/property', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        roomIds: selectedRooms,
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        multiple
        value={selectedRooms}
        onChange={(e) =>
          setSelectedRooms(
            Array.from(e.target.selectedOptions, (opt) => opt.value),
          )
        }
      >
        {availableRooms.map((room) => (
          <option key={room._id} value={room._id}>
            {room.name} - {room.surface}m² - €{room.price}
          </option>
        ))}
      </select>
      <button type="submit">Create Property</button>
    </form>
  );
}
```

---

## Testing

See [Testing Guide](../guides/TESTING.md) for complete test scenarios.

**Quick Test**:

```bash
# 1. Create room
ROOM_ID=$(curl -s -X POST http://localhost:3000/rooms \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","description":"Test","surface":20,"price":500}' \
  | jq -r '._id')

# 2. Verify available
curl http://localhost:3000/rooms/available | grep $ROOM_ID

# 3. Attach to property
curl -X PATCH http://localhost:3000/rooms/$ROOM_ID/attach/PROPERTY_ID

# 4. Verify NOT available
curl http://localhost:3000/rooms/available | grep $ROOM_ID
# Should return nothing
```

---

## Related Resources

- [Property API](./PROPERTY.md) - Property management
- [Rooms-Property Relationship Guide](../guides/ROOMS_PROPERTY_RELATIONSHIP.md) - Detailed guide

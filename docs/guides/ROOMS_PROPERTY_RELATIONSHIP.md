# Room ↔ Property Relationship

## 📋 Summary

This document explains how the **Room** to **Property** attachment system works, ensuring that:

- ✅ A Room can only be attached to **ONE** Property
- ✅ Once attached, the Room **DOES NOT appear** in the frontend select
- ✅ The Room is only visible during Property creation/update process

---

## 🗄️ Room Schema

```typescript
@Schema()
export class Rooms {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  surface: number;

  @Prop({ required: true })
  price: number;

  // Reference to Property (optional, null when not attached)
  @Prop({ type: Types.ObjectId, ref: 'Property', default: null })
  property: Types.ObjectId;

  // Availability flag (true = available, false = already attached)
  @Prop({ default: true })
  isAvailable: boolean;
}
```

### Important Fields:

- **`property`**: Reference to Property (null when not attached)
- **`isAvailable`**: `true` = available to attach, `false` = already attached

---

## 🔌 API Endpoints

### 1. **GET /rooms/available** ⭐ ESSENTIAL

Returns only **available** rooms (not attached).

**Frontend Usage:**

```javascript
// Use this endpoint in the Property form select
const response = await fetch('/rooms/available');
const availableRooms = await response.json();

// Populate the select with these rooms
```

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Room 1",
    "description": "Spacious room",
    "surface": 20,
    "price": 500,
    "property": null,
    "isAvailable": true
  }
]
```

---

### 2. **GET /rooms**

Returns **ALL** rooms (attached and not attached).

**Usage:** Administrative listing, do not use in Property creation select.

---

### 3. **POST /rooms**

Creates a new room (always created as available).

**Body:**

```json
{
  "name": "Room 2",
  "description": "Room with balcony",
  "surface": 25,
  "price": 600
}
```

---

### 4. **PATCH /rooms/:roomId/attach/:propertyId**

Attaches a room to a property.

**Example:**

```bash
PATCH /rooms/507f1f77bcf86cd799439011/attach/507f191e810c19729de860ea
```

**Effect:**

- `room.property` = propertyId
- `room.isAvailable` = false
- Room **disappears** from `/rooms/available`

**Error if room is already attached:**

```json
{
  "statusCode": 400,
  "message": "This room is already attached to another property"
}
```

---

### 5. **PATCH /rooms/:roomId/detach**

Detaches a room from a property (if needed).

**Example:**

```bash
PATCH /rooms/507f1f77bcf86cd799439011/detach
```

**Effect:**

- `room.property` = null
- `room.isAvailable` = true
- Room **reappears** in `/rooms/available`

---

## 🎨 Frontend Implementation

### Property Creation/Edit Form

```javascript
// 1. Fetch available rooms
async function loadAvailableRooms() {
  const response = await fetch('/rooms/available');
  const rooms = await response.json();

  // Populate the select
  const select = document.getElementById('roomsSelect');
  select.innerHTML = rooms
    .map(
      (room) => `
    <option value="${room._id}">
      ${room.name} - ${room.surface}m² - $ ${room.price}
    </option>
  `,
    )
    .join('');
}

// 2. When creating/updating Property
async function createProperty(propertyData, selectedRoomIds) {
  // Create the property
  const propertyResponse = await fetch('/property', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...propertyData,
      roomIds: selectedRoomIds,
    }),
  });

  const property = await propertyResponse.json();
  alert('Property created and rooms attached successfully!');
}
```

### React Example

```jsx
import { useState, useEffect } from 'react';

function PropertyForm() {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);

  // Load available rooms on component mount
  useEffect(() => {
    fetch('/rooms/available')
      .then((res) => res.json())
      .then((data) => setAvailableRooms(data));
  }, []);

  const handleSubmit = async (propertyData) => {
    // Create property with selected rooms
    const res = await fetch('/property', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...propertyData,
        roomIds: selectedRooms,
      }),
    });

    const property = await res.json();
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Property fields... */}

      <label>Select Rooms:</label>
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
            {room.name} - {room.surface}m² - $ {room.price}
          </option>
        ))}
      </select>

      <button type="submit">Create Property</button>
    </form>
  );
}
```

---

## 🔒 Business Rules

### ✅ Allowed:

1. Create rooms without attaching to any property
2. Attach an available room to a property
3. Detach a room (if needed)
4. Delete an available room
5. Delete a property (releases the rooms)

### ❌ NOT Allowed:

1. Attach a room that is already attached to another property (returns error 400)
2. Modify an attached room (returns error 400)
3. Delete an attached room (returns error 400)

---

## 🔄 Complete Flow

```
1. User creates rooms
   ↓
2. Rooms become available (isAvailable = true)
   ↓
3. User opens Property creation form
   ↓
4. Frontend calls GET /rooms/available
   ↓
5. Select shows only available rooms
   ↓
6. User selects rooms and creates Property
   ↓
7. Backend attaches rooms to Property
   ↓
8. Rooms become unavailable (isAvailable = false)
   ↓
9. Rooms NO LONGER appear in GET /rooms/available
```

---

## 🧪 Testing

### 1. Create a room

```bash
curl -X POST http://localhost:3000/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Master Room",
    "description": "Main room with suite",
    "surface": 30,
    "price": 800
  }'
```

### 2. List available rooms

```bash
curl http://localhost:3000/rooms/available
```

### 3. Attach room to a property

```bash
curl -X PATCH http://localhost:3000/rooms/{roomId}/attach/{propertyId}
```

### 4. Verify that the room no longer appears

```bash
curl http://localhost:3000/rooms/available
# The attached room should NOT appear in this list
```

---

## 📝 Important Notes

1. **Always use `/rooms/available`** in the frontend select, never `/rooms`
2. **Attachment is automatic** when you call the `/attach` endpoint
3. **Once attached, the room disappears** from the select automatically
4. **To "release" a room**, use the `/detach` endpoint

---

## 🚀 Next Steps

If you want to implement additional features:

1. **Attachment history**: Keep track of when a room was attached/detached
2. **Soft delete**: Instead of deleting, mark as "inactive"
3. **Duplicate validation**: Prevent creating rooms with the same name
4. **Advanced filters**: Filter rooms by price, size, etc.

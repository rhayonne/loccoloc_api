# Property API Documentation

## Overview

The Property resource manages rental properties owned by users. Properties can have multiple rooms and are categorized by type.

---

## Schema

```typescript
{
  _id: ObjectId (auto-generated)
  name: string (required)
  description: string (required)
  address: string (required)
  surfaceTotal: number (required, total area in m²)
  price: number (required, rental price)
  typeProperty: ObjectId (reference to TypesProperty)
  location: string
  imagesProperty: string[] (required, array of image URLs)
  rooms: ObjectId[] (array of Room references)
  owner: ObjectId (required, reference to User)
}
```

---

## Endpoints

### 1. Create Property

**POST** `/property`

Creates a new property and automatically attaches selected rooms.

**Request Body**:

```json
{
  "name": "Downtown Apartment",
  "description": "Beautiful 2-bedroom apartment in city center",
  "address": "123 Main Street, Paris, 75001",
  "surfaceTotal": 80,
  "price": 1500,
  "typeProperty": "507f1f77bcf86cd799439011",
  "location": "City Center",
  "imagesProperty": [
    "https://example.com/img1.jpg",
    "https://example.com/img2.jpg"
  ],
  "roomIds": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
  "owner": "507f1f77bcf86cd799439014"
}
```

**Response** (201 Created):

```json
{
  "_id": "507f1f77bcf86cd799439015",
  "name": "Downtown Apartment",
  "description": "Beautiful 2-bedroom apartment in city center",
  "address": "123 Main Street, Paris, 75001",
  "surfaceTotal": 80,
  "price": 1500,
  "typeProperty": "507f1f77bcf86cd799439011",
  "location": "City Center",
  "imagesProperty": [
    "https://example.com/img1.jpg",
    "https://example.com/img2.jpg"
  ],
  "rooms": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
  "owner": "507f1f77bcf86cd799439014"
}
```

**What Happens**:

1. Property is created
2. Each room in `roomIds` is automatically attached to this property
3. Rooms become unavailable (`isAvailable = false`)
4. Rooms disappear from `/rooms/available`

**Example**:

```bash
curl -X POST http://localhost:3000/property \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Downtown Apartment",
    "description": "Beautiful apartment",
    "address": "123 Main St, Paris",
    "surfaceTotal": 80,
    "price": 1500,
    "imagesProperty": ["img1.jpg"],
    "roomIds": ["ROOM_ID_1", "ROOM_ID_2"],
    "owner": "USER_ID"
  }'
```

---

### 2. Get All Properties

**GET** `/property`

Returns all properties with populated references.

**Response** (200 OK):

```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "name": "Downtown Apartment",
    "description": "Beautiful apartment",
    "address": "123 Main St, Paris",
    "surfaceTotal": 80,
    "price": 1500,
    "typeProperty": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Apartment",
      "description": "Multi-unit residential building"
    },
    "location": "City Center",
    "imagesProperty": ["img1.jpg", "img2.jpg"],
    "rooms": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Master Bedroom",
        "surface": 25,
        "price": 600
      }
    ],
    "owner": {
      "_id": "507f1f77bcf86cd799439014",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    }
  }
]
```

**Example**:

```bash
curl http://localhost:3000/property
```

---

### 3. Get Property by ID

**GET** `/property/:id`

Returns a single property with all populated references.

**Response** (200 OK):

```json
{
  "_id": "507f1f77bcf86cd799439015",
  "name": "Downtown Apartment",
  "typeProperty": { ... },
  "rooms": [ ... ],
  "owner": { ... }
}
```

**Error Response** (404 Not Found):

```json
{
  "statusCode": 404,
  "message": "Property with ID 507f1f77bcf86cd799439015 not found"
}
```

**Example**:

```bash
curl http://localhost:3000/property/507f1f77bcf86cd799439015
```

---

### 4. Update Property

**PATCH** `/property/:id`

Updates property information. Can also update attached rooms.

**Request Body** (partial update):

```json
{
  "price": 1600,
  "location": "Downtown",
  "roomIds": ["NEW_ROOM_ID_1", "NEW_ROOM_ID_2"]
}
```

**Response** (200 OK):

```json
{
  "_id": "507f1f77bcf86cd799439015",
  "name": "Downtown Apartment",
  "price": 1600,
  "location": "Downtown",
  "rooms": ["NEW_ROOM_ID_1", "NEW_ROOM_ID_2"]
}
```

**What Happens When Updating Rooms**:

1. All old rooms are detached (become available again)
2. New rooms are attached (become unavailable)

**Example**:

```bash
curl -X PATCH http://localhost:3000/property/507f1f77bcf86cd799439015 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1600,
    "roomIds": ["NEW_ROOM_ID"]
  }'
```

---

### 5. Delete Property

**DELETE** `/property/:id`

Deletes a property and automatically detaches all rooms.

**Response** (200 OK):

```json
{
  "message": "Property deleted successfully"
}
```

**What Happens**:

1. All rooms attached to this property are detached
2. Rooms become available again (`isAvailable = true`)
3. Rooms reappear in `/rooms/available`
4. Property is deleted

**Example**:

```bash
curl -X DELETE http://localhost:3000/property/507f1f77bcf86cd799439015
```

---

## Room Management

### Automatic Room Attachment

When you create or update a property with `roomIds`, the system automatically:

1. **Validates** that all rooms are available
2. **Attaches** each room to the property
3. **Updates** room status (`isAvailable = false`)
4. **Removes** rooms from available list

### Automatic Room Detachment

When you delete a property or update it with different rooms:

1. **Finds** all rooms attached to the property
2. **Detaches** each room
3. **Updates** room status (`isAvailable = true`)
4. **Returns** rooms to available list

---

## Relationships

### Property → TypesProperty (1:1)

```bash
# Get property with type
curl http://localhost:3000/property/PROPERTY_ID
# Returns property with populated typeProperty
```

### Property → Rooms (1:n)

```bash
# Property can have multiple rooms
# Rooms are automatically managed via roomIds
```

### Property → User/Owner (1:1)

```bash
# Each property has one owner
# Owner must be a User with role 'proprietaire'
```

---

## Common Workflows

### 1. Create Property with Rooms

```bash
# Step 1: Get available rooms
curl http://localhost:3000/rooms/available

# Step 2: Create property with selected room IDs
curl -X POST http://localhost:3000/property \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Apartment",
    "description": "Nice place",
    "address": "123 Street",
    "surfaceTotal": 60,
    "price": 1200,
    "imagesProperty": ["img.jpg"],
    "roomIds": ["ROOM_ID_1", "ROOM_ID_2"],
    "owner": "OWNER_ID"
  }'

# Step 3: Verify rooms are no longer available
curl http://localhost:3000/rooms/available
# Selected rooms should not appear
```

### 2. Change Property Rooms

```bash
# Update property with new rooms
curl -X PATCH http://localhost:3000/property/PROPERTY_ID \
  -H "Content-Type: application/json" \
  -d '{
    "roomIds": ["NEW_ROOM_ID_1", "NEW_ROOM_ID_2"]
  }'

# Old rooms are automatically released
# New rooms are automatically attached
```

### 3. Delete Property and Release Rooms

```bash
# Delete property
curl -X DELETE http://localhost:3000/property/PROPERTY_ID

# Verify rooms are available again
curl http://localhost:3000/rooms/available
# Previously attached rooms should reappear
```

---

## Validation Rules

- **name**: Required, string
- **description**: Required, string
- **address**: Required, string
- **surfaceTotal**: Required, number (must be > 0)
- **price**: Required, number (must be >= 0)
- **imagesProperty**: Required, array of strings (at least 1 image)
- **owner**: Required, valid User ObjectId
- **typeProperty**: Optional, valid TypesProperty ObjectId
- **roomIds**: Optional, array of valid Room ObjectIds (must be available)

---

## Error Handling

### Room Already Attached

```json
{
  "statusCode": 400,
  "message": "This room is already attached to another property"
}
```

### Invalid Room ID

```json
{
  "statusCode": 404,
  "message": "Room with ID 507f... not found"
}
```

### Property Not Found

```json
{
  "statusCode": 404,
  "message": "Property with ID 507f... not found"
}
```

---

## Frontend Integration Example

```javascript
// Fetch available rooms
const availableRooms = await fetch('/rooms/available').then((r) => r.json());

// Create property
const property = await fetch('/property', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'My Property',
    description: 'Great location',
    address: '123 Main St',
    surfaceTotal: 80,
    price: 1500,
    imagesProperty: ['img1.jpg'],
    roomIds: selectedRoomIds, // From user selection
    owner: currentUserId,
  }),
}).then((r) => r.json());

// Rooms are now automatically attached
```

---

## Related Resources

- [Rooms API](./ROOMS.md) - Room management and availability
- [User API](./USER.md) - User/Owner management
- [TypesProperty API](./TYPES_PROPERTY.md) - Property type categories
- [Rooms-Property Relationship Guide](../guides/ROOMS_PROPERTY_RELATIONSHIP.md)

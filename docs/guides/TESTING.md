# 🧪 Tests to Validate the Implementation

## Prerequisites

- Server running at `http://localhost:3000`
- MongoDB connected
- Have a user created (to use as owner)

---

## 📝 Scenario 1: Create Room and Verify Availability

### 1.1 Create a Room

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

**Expected response:**

```json
{
  "_id": "GENERATED_ROOM_ID",
  "name": "Master Room",
  "description": "Main room with suite",
  "surface": 30,
  "price": 800,
  "property": null,
  "isAvailable": true
}
```

### 1.2 Verify that the Room is available

```bash
curl http://localhost:3000/rooms/available
```

**Expected response:**

- The created room should appear in the list

---

## 📝 Scenario 2: Create Property and Attach Rooms

### 2.1 Create Property with Room

```bash
curl -X POST http://localhost:3000/property \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Downtown Apartment",
    "description": "1 bedroom apartment downtown",
    "address": "Flower Street, 123",
    "surfaceTotal": 50,
    "price": 1500,
    "location": "Downtown",
    "imagesProperty": ["img1.jpg", "img2.jpg"],
    "owner": "USER_ID_HERE",
    "roomIds": ["ROOM_ID_HERE"]
  }'
```

**Expected response:**

- Property created successfully
- Status 201

### 2.2 Verify that the Room is NO longer available

```bash
curl http://localhost:3000/rooms/available
```

**Expected response:**

- The attached room should **NOT** appear in the list

### 2.3 Verify that the Room was attached

```bash
curl http://localhost:3000/rooms/ROOM_ID_HERE
```

**Expected response:**

```json
{
  "_id": "ROOM_ID",
  "name": "Master Room",
  "property": "PROPERTY_ID",
  "isAvailable": false
}
```

---

## 📝 Scenario 3: Try to Attach Already Attached Room (Should Fail)

### 3.1 Create another Property

```bash
curl -X POST http://localhost:3000/property \
  -H "Content-Type: application/json" \
  -d '{
    "name": "South Zone Apartment",
    "description": "Apartment in south zone",
    "address": "Paulista Avenue, 456",
    "surfaceTotal": 60,
    "price": 2000,
    "imagesProperty": ["img3.jpg"],
    "owner": "USER_ID_HERE",
    "roomIds": []
  }'
```

### 3.2 Try to attach the same room

```bash
curl -X PATCH http://localhost:3000/rooms/ALREADY_ATTACHED_ROOM_ID/attach/NEW_PROPERTY_ID
```

**Expected response:**

```json
{
  "statusCode": 400,
  "message": "This room is already attached to another property"
}
```

---

## 📝 Scenario 4: Detach Room

### 4.1 Detach the room

```bash
curl -X PATCH http://localhost:3000/rooms/ROOM_ID/detach
```

**Expected response:**

```json
{
  "_id": "ROOM_ID",
  "name": "Master Room",
  "property": null,
  "isAvailable": true
}
```

### 4.2 Verify that the room is available again

```bash
curl http://localhost:3000/rooms/available
```

**Expected response:**

- The room should appear again in the list

---

## 📝 Scenario 5: Delete Property (Releases Rooms)

### 5.1 Create property with rooms

```bash
# First, attach the room again
curl -X PATCH http://localhost:3000/rooms/ROOM_ID/attach/PROPERTY_ID

# Verify it's not available
curl http://localhost:3000/rooms/available
```

### 5.2 Delete the property

```bash
curl -X DELETE http://localhost:3000/property/PROPERTY_ID
```

### 5.3 Verify that the rooms were released

```bash
curl http://localhost:3000/rooms/available
```

**Expected response:**

- The rooms from the deleted property should appear again as available

---

## 📝 Scenario 6: Try to Delete Attached Room (Should Fail)

### 6.1 Attach room to a property

```bash
curl -X PATCH http://localhost:3000/rooms/ROOM_ID/attach/PROPERTY_ID
```

### 6.2 Try to delete the room

```bash
curl -X DELETE http://localhost:3000/rooms/ROOM_ID
```

**Expected response:**

```json
{
  "statusCode": 400,
  "message": "Cannot delete a room that is attached to a property"
}
```

---

## 📝 Scenario 7: Update Property (Reattach Rooms)

### 7.1 Create two rooms

```bash
# Room 1
curl -X POST http://localhost:3000/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Room 1",
    "description": "First room",
    "surface": 20,
    "price": 500
  }'

# Room 2
curl -X POST http://localhost:3000/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Room 2",
    "description": "Second room",
    "surface": 25,
    "price": 600
  }'
```

### 7.2 Create property with Room 1

```bash
curl -X POST http://localhost:3000/property \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Apartment",
    "description": "Update test",
    "address": "Test Street, 789",
    "surfaceTotal": 70,
    "price": 1800,
    "imagesProperty": ["img.jpg"],
    "owner": "USER_ID_HERE",
    "roomIds": ["ROOM_1_ID"]
  }'
```

### 7.3 Update property to use Room 2

```bash
curl -X PATCH http://localhost:3000/property/PROPERTY_ID \
  -H "Content-Type: application/json" \
  -d '{
    "roomIds": ["ROOM_2_ID"]
  }'
```

### 7.4 Verify availability

```bash
curl http://localhost:3000/rooms/available
```

**Expected response:**

- Room 1 should be available again (was detached)
- Room 2 should NOT be available (was attached)

---

## 🎯 Validation Checklist

Use this checklist to ensure everything is working:

- [ ] ✅ Creating room sets `isAvailable = true`
- [ ] ✅ Created room appears in `/rooms/available`
- [ ] ✅ Attaching room to property sets `isAvailable = false`
- [ ] ✅ Attached room does NOT appear in `/rooms/available`
- [ ] ✅ Trying to attach already attached room returns error 400
- [ ] ✅ Detaching room sets `isAvailable = true`
- [ ] ✅ Detached room appears again in `/rooms/available`
- [ ] ✅ Deleting property releases the rooms (they become available again)
- [ ] ✅ Trying to delete attached room returns error 400
- [ ] ✅ Updating property reattaches rooms correctly

---

## 🔧 Automated Test Script

Save this script as `test-rooms.sh`:

```bash
#!/bin/bash

API_URL="http://localhost:3000"
USER_ID="507f1f77bcf86cd799439011" # REPLACE with real ID

echo "🧪 Starting tests..."

# 1. Create room
echo "\n📝 Test 1: Creating room..."
ROOM_RESPONSE=$(curl -s -X POST $API_URL/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Room",
    "description": "Test room",
    "surface": 20,
    "price": 500
  }')

ROOM_ID=$(echo $ROOM_RESPONSE | jq -r '._id')
echo "✅ Room created: $ROOM_ID"

# 2. Verify availability
echo "\n📝 Test 2: Verifying availability..."
AVAILABLE=$(curl -s $API_URL/rooms/available | jq -r ".[] | select(._id==\"$ROOM_ID\") | ._id")

if [ "$AVAILABLE" == "$ROOM_ID" ]; then
  echo "✅ Room is available"
else
  echo "❌ Room is NOT available (ERROR)"
  exit 1
fi

# 3. Create property
echo "\n📝 Test 3: Creating property with room..."
PROPERTY_RESPONSE=$(curl -s -X POST $API_URL/property \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test Property\",
    \"description\": \"Test\",
    \"address\": \"Test Street, 123\",
    \"surfaceTotal\": 50,
    \"price\": 1000,
    \"imagesProperty\": [\"img.jpg\"],
    \"owner\": \"$USER_ID\",
    \"roomIds\": [\"$ROOM_ID\"]
  }")

PROPERTY_ID=$(echo $PROPERTY_RESPONSE | jq -r '._id')
echo "✅ Property created: $PROPERTY_ID"

# 4. Verify that room is no longer available
echo "\n📝 Test 4: Verifying that room is no longer available..."
AVAILABLE=$(curl -s $API_URL/rooms/available | jq -r ".[] | select(._id==\"$ROOM_ID\") | ._id")

if [ -z "$AVAILABLE" ]; then
  echo "✅ Room is NOT available (correct)"
else
  echo "❌ Room is still available (ERROR)"
  exit 1
fi

# 5. Delete property
echo "\n📝 Test 5: Deleting property..."
curl -s -X DELETE $API_URL/property/$PROPERTY_ID > /dev/null
echo "✅ Property deleted"

# 6. Verify that room is available again
echo "\n📝 Test 6: Verifying that room is available again..."
sleep 1
AVAILABLE=$(curl -s $API_URL/rooms/available | jq -r ".[] | select(._id==\"$ROOM_ID\") | ._id")

if [ "$AVAILABLE" == "$ROOM_ID" ]; then
  echo "✅ Room is available again (correct)"
else
  echo "❌ Room is NOT available again (ERROR)"
  exit 1
fi

# 7. Cleanup
echo "\n📝 Cleaning up..."
curl -s -X DELETE $API_URL/rooms/$ROOM_ID > /dev/null
echo "✅ Room deleted"

echo "\n🎉 All tests passed!"
```

To execute:

```bash
chmod +x test-rooms.sh
./test-rooms.sh
```

---

## 📊 Expected Results

### ✅ Success

All tests should pass without errors. You should see:

- Rooms being created as available
- Rooms disappearing from `/rooms/available` when attached
- Rooms reappearing when detached or property deleted
- Errors 400 when trying to attach already attached room or delete attached room

### ❌ Common Problems

1. **Room doesn't appear in `/rooms/available` after creation**
   - Check if `isAvailable` is being set to `true` by default

2. **Room still appears in `/rooms/available` after attaching**
   - Check if `isAvailable` is being set to `false` in `attachToProperty()`

3. **Error when creating property with rooms**
   - Check if RoomsModule is being imported in PropertyModule
   - Check if RoomsService is being exported in RoomsModule

4. **Rooms don't become available again when deleting property**
   - Check if the `remove()` method in PropertyService is detaching the rooms

---

## 🐛 Debug

If something doesn't work, check:

1. **Server logs:**

   ```bash
   # Check for errors in the console
   ```

2. **Room state in database:**

   ```bash
   # In MongoDB
   db.rooms.find({ _id: ObjectId("ROOM_ID") })
   ```

3. **Property state in database:**
   ```bash
   # In MongoDB
   db.properties.find({ _id: ObjectId("PROPERTY_ID") })
   ```

---

## 📞 Support

If you encounter problems:

1. Check if all modules are imported correctly
2. Check if MongoDB is running
3. Check NestJS logs
4. Test each endpoint individually using the examples above

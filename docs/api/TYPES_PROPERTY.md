# TypesProperty API Documentation

## Overview

The TypesProperty resource manages property type categories (e.g., Apartment, House, Studio, etc.).

---

## Schema

```typescript
{
  _id: ObjectId(auto - generated);
  name: string(required);
  description: string(required);
}
```

---

## Endpoints

### 1. Create Property Type

**POST** `/types-property`

Creates a new property type category.

**Request Body**:

```json
{
  "name": "Apartment",
  "description": "Multi-unit residential building"
}
```

**Response** (201 Created):

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Apartment",
  "description": "Multi-unit residential building"
}
```

**Example**:

```bash
curl -X POST http://localhost:3000/types-property \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apartment",
    "description": "Multi-unit residential building"
  }'
```

---

### 2. Get All Property Types

**GET** `/types-property`

Returns all property types.

**Response** (200 OK):

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Apartment",
    "description": "Multi-unit residential building"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "House",
    "description": "Single-family detached home"
  },
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Studio",
    "description": "Single-room apartment"
  }
]
```

**Example**:

```bash
curl http://localhost:3000/types-property
```

---

### 3. Get Property Type by ID

**GET** `/types-property/:id`

Returns a single property type.

**Response** (200 OK):

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Apartment",
  "description": "Multi-unit residential building"
}
```

**Error Response** (404 Not Found):

```json
{
  "statusCode": 404,
  "message": "TypesProperty with ID 507f... not found"
}
```

**Example**:

```bash
curl http://localhost:3000/types-property/507f1f77bcf86cd799439011
```

---

### 4. Update Property Type

**PATCH** `/types-property/:id`

Updates property type information.

**Request Body**:

```json
{
  "description": "Updated description for apartment type"
}
```

**Response** (200 OK):

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Apartment",
  "description": "Updated description for apartment type"
}
```

**Example**:

```bash
curl -X PATCH http://localhost:3000/types-property/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description"
  }'
```

---

### 5. Delete Property Type

**DELETE** `/types-property/:id`

Deletes a property type.

**Response** (200 OK):

```json
{
  "message": "TypesProperty deleted successfully"
}
```

**Example**:

```bash
curl -X DELETE http://localhost:3000/types-property/507f1f77bcf86cd799439011
```

---

## Relationship with Property

Property types are linked to Properties in a 1:1 relationship.

### Create Property with Type

```bash
# 1. Create property type
TYPE_RESPONSE=$(curl -X POST http://localhost:3000/types-property \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apartment",
    "description": "Multi-unit building"
  }')

TYPE_ID=$(echo $TYPE_RESPONSE | jq -r '._id')

# 2. Create property with type
curl -X POST http://localhost:3000/property \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"My Apartment\",
    \"typeProperty\": \"$TYPE_ID\",
    ...
  }"
```

### Get Property with Type

```bash
curl http://localhost:3000/property/PROPERTY_ID
```

**Response**:

```json
{
  "_id": "PROPERTY_ID",
  "name": "My Apartment",
  "typeProperty": {
    "_id": "TYPE_ID",
    "name": "Apartment",
    "description": "Multi-unit building"
  },
  ...
}
```

---

## Common Property Types

Here are some common property types you might want to create:

### Apartment

```json
{
  "name": "Apartment",
  "description": "Multi-unit residential building with shared facilities"
}
```

### House

```json
{
  "name": "House",
  "description": "Single-family detached home with private yard"
}
```

### Studio

```json
{
  "name": "Studio",
  "description": "Single-room apartment with combined living and sleeping area"
}
```

### Duplex

```json
{
  "name": "Duplex",
  "description": "Two-story apartment or house with internal stairs"
}
```

### Loft

```json
{
  "name": "Loft",
  "description": "Open-plan apartment, often in converted industrial space"
}
```

### Villa

```json
{
  "name": "Villa",
  "description": "Luxury detached house, often with garden and pool"
}
```

---

## Bulk Creation Script

Create multiple property types at once:

```bash
#!/bin/bash

API_URL="http://localhost:3000/types-property"

# Array of property types
declare -a TYPES=(
  '{"name":"Apartment","description":"Multi-unit residential building"}'
  '{"name":"House","description":"Single-family detached home"}'
  '{"name":"Studio","description":"Single-room apartment"}'
  '{"name":"Duplex","description":"Two-story apartment with internal stairs"}'
  '{"name":"Loft","description":"Open-plan converted industrial space"}'
  '{"name":"Villa","description":"Luxury detached house with garden"}'
)

# Create each type
for type in "${TYPES[@]}"
do
  curl -X POST $API_URL \
    -H "Content-Type: application/json" \
    -d "$type"
  echo ""
done
```

---

## Use Cases

### 1. Initialize Property Types

When setting up the system, create standard property types:

```bash
# Create standard types
curl -X POST http://localhost:3000/types-property \
  -H "Content-Type: application/json" \
  -d '{"name":"Apartment","description":"Multi-unit building"}'

curl -X POST http://localhost:3000/types-property \
  -H "Content-Type: application/json" \
  -d '{"name":"House","description":"Single-family home"}'

curl -X POST http://localhost:3000/types-property \
  -H "Content-Type: application/json" \
  -d '{"name":"Studio","description":"Single-room apartment"}'
```

### 2. Frontend Property Type Selector

```javascript
// Fetch all property types for dropdown
const types = await fetch('/types-property').then((r) => r.json());

// Populate select
const select = document.getElementById('propertyType');
types.forEach((type) => {
  const option = document.createElement('option');
  option.value = type._id;
  option.text = type.name;
  select.appendChild(option);
});
```

### 3. Filter Properties by Type

```javascript
// Get all properties
const properties = await fetch('/property').then((r) => r.json());

// Filter by type
const apartments = properties.filter(
  (p) => p.typeProperty.name === 'Apartment',
);
```

---

## Validation Rules

- **name**: Required, string, should be unique
- **description**: Required, string

---

## Best Practices

1. **Keep names simple**: Use standard, recognizable names
2. **Descriptive descriptions**: Help users understand the difference
3. **Don't delete types in use**: Check if any properties use a type before deleting
4. **Consistent naming**: Use singular form (Apartment, not Apartments)

---

## Related Resources

- [Property API](./PROPERTY.md) - Properties use TypesProperty for categorization

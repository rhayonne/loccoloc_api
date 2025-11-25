# Database Schemas

Complete reference of all MongoDB schemas in the LocColoc API.

---

## Table of Contents

1. [User Schema](#user-schema)
2. [Garant Schema](#garant-schema)
3. [Property Schema](#property-schema)
4. [Rooms Schema](#rooms-schema)
5. [TypesProperty Schema](#typesproperty-schema)
6. [Relationships Diagram](#relationships-diagram)

---

## User Schema

**Collection**: `users`

```typescript
{
  _id: ObjectId
  email: string (required, unique, indexed, validated)
  password: string (required, hashed, select: false)
  role: UserRole (enum, default: 'locataire')
  firstName: string (required)
  lastName: string (required)
  phone: string
  dateOfBirth: Date
  address: string
  garants: ObjectId[] (ref: 'Garant')
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### Indexes

- `email`: unique, indexed

### Enums

```typescript
enum UserRole {
  LOCATAIRE = 'locataire', // Tenant
  PROPRIETAIRE = 'proprietaire', // Property Owner
  SUPER_ADMIN = 'super_admin', // Administrator
}
```

### Middleware

- **Pre-save**: Hashes password with bcrypt (10 rounds) if modified

### Validation

- Email must match regex pattern
- Email error message: "Ce n'est pas un format d'adresse e-mail valide."

---

## Garant Schema

**Collection**: `garants`

```typescript
{
  _id: ObjectId
  firstName: string
  lastName: string
  phone: string
  email: string (validated)
  rib: string (French IBAN, validated)
}
```

### Validation

- **Email**:
  - Must be valid email format
  - Must have TLD (top-level domain)
  - Display name required
- **RIB**:
  - Must follow international IBAN format
  - Must start with 'FR' (French IBAN)
  - Minimum length: 10 characters
  - Error message: "Le RIB doit suivre le format international IBAN."

---

## Property Schema

**Collection**: `properties`

```typescript
{
  _id: ObjectId
  name: string (required)
  description: string (required)
  address: string (required)
  surfaceTotal: number (required)
  price: number (required)
  typeProperty: ObjectId (ref: 'TypesProperty')
  location: string
  imagesProperty: string[] (required)
  rooms: ObjectId[] (ref: 'Rooms')
  owner: ObjectId (required, ref: 'User')
}
```

### References

- `typeProperty` → TypesProperty (1:1)
- `rooms` → Rooms (1:n)
- `owner` → User (1:1)

### Notes

- Rooms are automatically managed via PropertyService
- When property is deleted, all rooms are detached
- When property is updated with new rooms, old rooms are detached

---

## Rooms Schema

**Collection**: `rooms`

```typescript
{
  _id: ObjectId
  name: string (required)
  description: string (required)
  surface: number (required)
  price: number (required)
  property: ObjectId (ref: 'Property', default: null)
  isAvailable: boolean (default: true)
}
```

### References

- `property` → Property (1:1, optional)

### Business Logic

- `isAvailable = true` when `property = null`
- `isAvailable = false` when room is attached to a property
- Room can only be attached to ONE property at a time

### Availability States

| isAvailable | property | Meaning                          |
| ----------- | -------- | -------------------------------- |
| true        | null     | Room is available for attachment |
| false       | ObjectId | Room is attached to a property   |

---

## TypesProperty Schema

**Collection**: `typesProperties`

```typescript
{
  _id: ObjectId;
  name: string(required);
  description: string(required);
}
```

### Common Values

- Apartment
- House
- Studio
- Duplex
- Loft
- Villa

---

## Relationships Diagram

```
┌──────────────────┐
│      User        │
│  (Tenant/Owner)  │
└────┬─────────┬───┘
     │ 1       │ 1
     │         │
     │ n       │ n (owner)
┌────┴─────┐   │
│  Garant  │   │
└──────────┘   │
               │
        ┌──────┴──────────┐
        │    Property     │
        └──┬──────────┬───┘
           │ 1        │ 1
           │          │
           │ 1        │ n
    ┌──────┴─────┐    │
    │TypesProperty│    │
    └────────────┘    │
                 ┌────┴────┐
                 │  Rooms  │
                 └─────────┘
```

### Relationship Details

#### User → Garant (1:n)

- One user can have multiple guarantors
- Stored as array in User.garants
- Populated on User queries

#### User → Property (1:n as owner)

- One user (proprietaire) can own multiple properties
- Stored as Property.owner
- Populated on Property queries

#### Property → TypesProperty (1:1)

- One property has one type
- Stored as Property.typeProperty
- Populated on Property queries

#### Property → Rooms (1:n)

- One property can have multiple rooms
- Stored as Property.rooms array
- Rooms have reverse reference via Rooms.property
- Automatically managed by PropertyService

---

## Collection Naming Conventions

| Schema        | Collection Name |
| ------------- | --------------- |
| User          | users           |
| Garant        | garants         |
| Property      | properties      |
| Rooms         | rooms           |
| TypesProperty | typesProperties |

---

## Indexes Summary

### Unique Indexes

- `users.email` - Ensures email uniqueness

### Regular Indexes

- `users.email` - Improves query performance

### Recommended Additional Indexes

```javascript
// For better query performance
db.properties.createIndex({ owner: 1 });
db.properties.createIndex({ typeProperty: 1 });
db.rooms.createIndex({ property: 1 });
db.rooms.createIndex({ isAvailable: 1 });
```

---

## Data Integrity Rules

### User

- Email must be unique
- Password is never returned in queries (select: false)
- Password is automatically hashed on save

### Garant

- RIB must be French IBAN format
- Email must be valid

### Property

- Must have valid owner (User with role 'proprietaire')
- Rooms in roomIds must exist and be available
- Must have at least one image

### Rooms

- Can only be attached to one property at a time
- Cannot be modified when attached
- Cannot be deleted when attached
- Automatically detached when property is deleted

### TypesProperty

- Should have unique names (not enforced at DB level)

---

## Timestamps

Collections with automatic timestamps:

- **User**: `createdAt`, `updatedAt`
- **Others**: No automatic timestamps (can be added if needed)

To add timestamps to other schemas:

```typescript
@Schema({ timestamps: true })
export class YourSchema { ... }
```

---

## Validation Summary

### Email Validation

- Used in: User, Garant
- Pattern: Standard email regex
- Must have TLD

### IBAN Validation

- Used in: Garant
- Must start with 'FR'
- Minimum length: 10 characters

### Number Validation

- `surface`: Must be > 0
- `price`: Must be >= 0
- `surfaceTotal`: Must be > 0

---

## Migration Considerations

If you need to migrate or seed data:

### 1. Create Users First

```javascript
// Create admin
db.users.insertOne({
  email: 'admin@loccoloc.com',
  password: '$2b$10$...', // Pre-hashed
  role: 'super_admin',
  firstName: 'Admin',
  lastName: 'User',
});
```

### 2. Create Property Types

```javascript
db.typesProperties.insertMany([
  { name: 'Apartment', description: 'Multi-unit building' },
  { name: 'House', description: 'Single-family home' },
  { name: 'Studio', description: 'Single-room apartment' },
]);
```

### 3. Create Rooms

```javascript
db.rooms.insertMany([
  {
    name: 'Room 1',
    description: '...',
    surface: 20,
    price: 500,
    isAvailable: true,
  },
  {
    name: 'Room 2',
    description: '...',
    surface: 25,
    price: 600,
    isAvailable: true,
  },
]);
```

### 4. Create Properties

```javascript
db.properties.insertOne({
  name: 'My Property',
  description: '...',
  address: '...',
  surfaceTotal: 80,
  price: 1500,
  typeProperty: ObjectId('...'),
  imagesProperty: ['img1.jpg'],
  rooms: [ObjectId('...'), ObjectId('...')],
  owner: ObjectId('...'),
});

// Don't forget to update rooms
db.rooms.updateMany(
  { _id: { $in: [ObjectId('...'), ObjectId('...')] } },
  { $set: { property: ObjectId('...'), isAvailable: false } },
);
```

---

## Schema Evolution

### Adding New Fields

To add new fields to existing schemas:

1. Update the schema class
2. Add migration script if needed
3. Update DTOs
4. Update documentation

Example:

```typescript
// Add new field to Property
@Prop({ default: false })
isFeatured: boolean;
```

### Removing Fields

1. Mark as deprecated first
2. Update code to not use the field
3. Remove from schema
4. Clean up database

---

## Related Documentation

- [User API](../api/USER.md)
- [Property API](../api/PROPERTY.md)
- [Rooms API](../api/ROOMS.md)
- [Garant API](../api/GARANT.md)
- [TypesProperty API](../api/TYPES_PROPERTY.md)

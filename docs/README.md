# 📚 Documentation Index

Welcome to the LocColoc API documentation! This directory contains complete documentation for all aspects of the system.

---

## 📖 Documentation Structure

```
docs/
├── README.md                          # This file - Documentation index
├── api/                               # API endpoint documentation
│   ├── USER.md                       # User management API
│   ├── PROPERTY.md                   # Property management API
│   ├── ROOMS.md                      # Rooms management API
│   ├── GARANT.md                     # Guarantor management API
│   └── TYPES_PROPERTY.md             # Property types API
├── schemas/                           # Database schemas
│   └── DATABASE_SCHEMAS.md           # Complete schema reference
└── guides/                            # How-to guides
    ├── ROOMS_PROPERTY_RELATIONSHIP.md # Room attachment system
    └── TESTING.md                     # Testing guide
```

---

## 🚀 Getting Started

### New to the Project?

1. Start with the [Main README](../README.md) for quick start
2. Read the [System Overview](#system-overview) below
3. Explore [API Documentation](#api-documentation)

### Looking for Something Specific?

- **API Endpoints**: See [API Documentation](#api-documentation)
- **Database Structure**: See [Database Schemas](#database-schemas)
- **Testing**: See [Testing Guide](./guides/TESTING.md)
- **Room System**: See [Rooms-Property Guide](./guides/ROOMS_PROPERTY_RELATIONSHIP.md)

---

## 📋 System Overview

### What is LocColoc?

LocColoc is a property rental management API that handles:

- **User Management**: Tenants, property owners, and administrators
- **Property Listings**: Complete property management with images and details
- **Room Management**: Individual rental units with availability tracking
- **Guarantor System**: Financial guarantors for tenants
- **Property Categorization**: Type-based property classification

### Key Features

✅ **Multi-role User System** (Tenant, Owner, Admin)  
✅ **Secure Authentication** (Password hashing with bcrypt)  
✅ **Room Availability System** (Prevents double-booking)  
✅ **Automatic Relationship Management** (Rooms ↔ Properties)  
✅ **Data Validation** (Email, IBAN, business rules)  
✅ **RESTful API** (Standard HTTP methods)

---

## 📚 API Documentation

Complete endpoint documentation for each resource:

### 👤 [User API](./api/USER.md)

Manage users (tenants, owners, admins)

**Key Endpoints**:

- `POST /user` - Create user
- `GET /user` - List users
- `GET /user/:id` - Get user details
- `PATCH /user/:id` - Update user
- `DELETE /user/:id` - Delete user

**Features**:

- Password hashing
- Email validation
- Role-based access
- Guarantor linking

---

### 🏠 [Property API](./api/PROPERTY.md)

Manage rental properties

**Key Endpoints**:

- `POST /property` - Create property (with rooms)
- `GET /property` - List properties
- `GET /property/:id` - Get property details
- `PATCH /property/:id` - Update property
- `DELETE /property/:id` - Delete property

**Features**:

- Automatic room attachment
- Property type categorization
- Owner association
- Image management

---

### 🚪 [Rooms API](./api/ROOMS.md)

Manage individual rental units

**Key Endpoints**:

- `POST /rooms` - Create room
- `GET /rooms/available` ⭐ - **Get available rooms** (use in frontend!)
- `GET /rooms` - List all rooms
- `PATCH /rooms/:id/attach/:propertyId` - Attach room
- `PATCH /rooms/:id/detach` - Detach room
- `DELETE /rooms/:id` - Delete room

**Features**:

- Availability tracking
- One room, one property rule
- Automatic status updates
- Business rule enforcement

---

### 👨‍👩‍👧 [Garant API](./api/GARANT.md)

Manage guarantors for tenants

**Key Endpoints**:

- `POST /garant` - Create guarantor
- `GET /garant` - List guarantors
- `GET /garant/:id` - Get guarantor details
- `PATCH /garant/:id` - Update guarantor
- `DELETE /garant/:id` - Delete guarantor

**Features**:

- Email validation
- French IBAN (RIB) validation
- User linking

---

### 🏢 [TypesProperty API](./api/TYPES_PROPERTY.md)

Manage property type categories

**Key Endpoints**:

- `POST /types-property` - Create type
- `GET /types-property` - List types
- `GET /types-property/:id` - Get type details
- `PATCH /types-property/:id` - Update type
- `DELETE /types-property/:id` - Delete type

**Common Types**: Apartment, House, Studio, Duplex, Loft, Villa

---

## 🗄️ Database Schemas

### [Complete Schema Reference](./schemas/DATABASE_SCHEMAS.md)

Detailed documentation of all MongoDB schemas:

- **User Schema** - User accounts with roles
- **Garant Schema** - Guarantor information
- **Property Schema** - Property listings
- **Rooms Schema** - Individual rental units
- **TypesProperty Schema** - Property categories

**Includes**:

- Field definitions
- Validation rules
- Relationships
- Indexes
- Data integrity rules

---

## 📖 Guides

### [Rooms-Property Relationship](./guides/ROOMS_PROPERTY_RELATIONSHIP.md)

Deep dive into the room attachment system:

- How availability works
- Attachment/detachment process
- Frontend integration
- Business rules
- Common workflows

**Read this if you're working with rooms!**

---

### [Testing Guide](./guides/TESTING.md)

Complete testing documentation:

- Test scenarios
- Validation checklist
- Automated test scripts
- Common problems
- Debug tips

**Includes**:

- 7 complete test scenarios
- Bash test automation script
- Expected results
- Error handling

---

## 🔗 Relationships

### Entity Relationship Overview

```
User (Tenant) ──1:n── Garant
User (Owner) ──1:n── Property
Property ──1:1── TypesProperty
Property ──1:n── Rooms
```

### Key Relationships

1. **User → Garant** (1:n)
   - One user can have multiple guarantors
   - Stored in User.garants array

2. **User → Property** (1:n as owner)
   - One owner can have multiple properties
   - Stored in Property.owner

3. **Property → TypesProperty** (1:1)
   - Each property has one type
   - Stored in Property.typeProperty

4. **Property → Rooms** (1:n)
   - One property can have multiple rooms
   - Automatically managed
   - Rooms can only belong to ONE property

---

## 🎯 Common Use Cases

### 1. Create Complete Property Listing

```bash
# 1. Create property owner
POST /user { role: "proprietaire", ... }

# 2. Create property type (if needed)
POST /types-property { name: "Apartment", ... }

# 3. Create rooms
POST /rooms { name: "Room 1", ... }
POST /rooms { name: "Room 2", ... }

# 4. Create property with rooms
POST /property {
  roomIds: ["ROOM_1_ID", "ROOM_2_ID"],
  owner: "OWNER_ID",
  typeProperty: "TYPE_ID",
  ...
}
```

### 2. Onboard New Tenant

```bash
# 1. Create tenant user
POST /user { role: "locataire", ... }

# 2. Create guarantor
POST /garant { ... }

# 3. Link guarantor to tenant
PATCH /user/:id { garants: ["GARANT_ID"] }
```

### 3. Manage Room Availability

```bash
# Get available rooms for selection
GET /rooms/available

# Attach room to property
POST /property { roomIds: ["ROOM_ID"], ... }

# Room automatically becomes unavailable
# Verify: GET /rooms/available (room won't appear)
```

---

## 🔍 Quick Reference

### HTTP Status Codes

| Code | Meaning                                               |
| ---- | ----------------------------------------------------- |
| 200  | OK - Request successful                               |
| 201  | Created - Resource created                            |
| 400  | Bad Request - Invalid data or business rule violation |
| 404  | Not Found - Resource doesn't exist                    |
| 409  | Conflict - Duplicate entry                            |
| 500  | Internal Server Error                                 |

### User Roles

| Role   | Value          | Description          |
| ------ | -------------- | -------------------- |
| Tenant | `locataire`    | Rents properties     |
| Owner  | `proprietaire` | Owns properties      |
| Admin  | `super_admin`  | System administrator |

### Room States

| isAvailable | property | Meaning                  |
| ----------- | -------- | ------------------------ |
| true        | null     | Available for attachment |
| false       | ObjectId | Attached to property     |

---

## 💡 Best Practices

### API Usage

1. **Always use `/rooms/available`** for frontend room selection
2. **Pass `roomIds` when creating/updating properties** (automatic attachment)
3. **Check user role** before allowing property creation
4. **Validate IBAN format** for guarantors (must start with 'FR')
5. **Use populated queries** to get related data

### Development

1. **Update documentation** when adding features
2. **Write tests** for new endpoints
3. **Follow naming conventions** (singular for schemas)
4. **Use TypeScript types** for type safety
5. **Validate input** with class-validator

---

## 🆘 Troubleshooting

### Common Issues

**Room doesn't appear in `/rooms/available`**

- Check if `isAvailable = true`
- Check if `property = null`

**Cannot attach room to property**

- Verify room is available
- Check if room already attached

**Email validation fails**

- Ensure valid email format
- Check for TLD (top-level domain)

**RIB validation fails**

- Must start with 'FR'
- Must be at least 10 characters

---

## 📞 Need Help?

1. **Check the relevant API doc** in `/api` folder
2. **Review the schema** in `/schemas/DATABASE_SCHEMAS.md`
3. **Read the guides** in `/guides` folder
4. **Run the tests** following `/guides/TESTING.md`

---

## 🔄 Keeping Documentation Updated

When adding new features:

1. Update relevant API doc in `/api`
2. Update schema doc if database changes
3. Add guide if introducing new concept
4. Update this index if adding new files
5. Update main README.md

---

## 📝 Documentation Conventions

- **Endpoints**: Use HTTP method + path (e.g., `POST /user`)
- **Code blocks**: Include language for syntax highlighting
- **Examples**: Provide curl commands and responses
- **Sections**: Use clear headers and emojis for navigation
- **Links**: Use relative links between docs

---

## 🎉 You're Ready!

You now have access to complete documentation for the LocColoc API. Start exploring!

**Recommended Reading Order**:

1. [Main README](../README.md) - Quick start
2. [User API](./api/USER.md) - Understand users
3. [Property API](./api/PROPERTY.md) - Learn property management
4. [Rooms API](./api/ROOMS.md) - Master the room system
5. [Testing Guide](./guides/TESTING.md) - Validate your work

Happy coding! 🚀

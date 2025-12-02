# User API Documentation

## Overview

The User resource manages all users in the system, including tenants (locataires), property owners (proprietaires), and administrators.

---

## Schema

```typescript
{
  _id: ObjectId (auto-generated)
  email: string (required, unique, validated)
  password: string (required, hashed, not returned in queries)
  role: UserRole (default: LOCATAIRE)
  firstName: string (required)
  lastName: string (required)
  phone: string
  dateOfBirth: Date
  address: string
  garants: Garant[] (array of ObjectIds)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

### User Roles

```typescript
enum UserRole {
  LOCATAIRE = 'locataire', // Tenant
  PROPRIETAIRE = 'proprietaire', // Property Owner
  SUPER_ADMIN = 'super_admin', // Administrator
}
```

---

## Endpoints

### 1. Create User

**POST** `/user`

Creates a new user. Password is automatically hashed before saving.

**Request Body**:

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "role": "locataire",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+33612345678",
  "dateOfBirth": "1990-01-15",
  "address": "123 Main Street, Paris, France"
}
```

**Response** (201 Created):

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "john.doe@example.com",
  "role": "locataire",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+33612345678",
  "dateOfBirth": "1990-01-15T00:00:00.000Z",
  "address": "123 Main Street, Paris, France",
  "garants": [],
  "createdAt": "2025-11-25T10:00:00.000Z",
  "updatedAt": "2025-11-25T10:00:00.000Z"
}
```

**Validation Rules**:

- Email must be valid format
- Email must be unique
- Password is required (min 6 characters recommended)
- firstName and lastName are required

**Example**:

```bash
curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123!",
    "role": "locataire",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+33612345678"
  }'
```

---

### 2. Get All Users

**GET** `/user`

Returns a list of all users.

**Response** (200 OK):

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john.doe@example.com",
    "role": "locataire",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+33612345678",
    "garants": [],
    "createdAt": "2025-11-25T10:00:00.000Z",
    "updatedAt": "2025-11-25T10:00:00.000Z"
  }
]
```

**Note**: Password field is never returned in queries.

**Example**:

```bash
curl http://localhost:3000/user
```

---

### 3. Get User by ID

**GET** `/user/:id`

Returns a single user by ID, with populated garants.

**Response** (200 OK):

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "john.doe@example.com",
  "role": "locataire",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+33612345678",
  "garants": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane.doe@example.com",
      "phone": "+33612345679"
    }
  ],
  "createdAt": "2025-11-25T10:00:00.000Z",
  "updatedAt": "2025-11-25T10:00:00.000Z"
}
```

**Error Response** (404 Not Found):

```json
{
  "statusCode": 404,
  "message": "User with ID 507f1f77bcf86cd799439011 not found"
}
```

**Example**:

```bash
curl http://localhost:3000/user/507f1f77bcf86cd799439011
```

---

### 4. Update User

**PATCH** `/user/:id`

Updates user information. Can update any field except \_id.

**Request Body** (partial update):

```json
{
  "phone": "+33698765432",
  "address": "456 New Street, Lyon, France"
}
```

**Response** (200 OK):

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "john.doe@example.com",
  "role": "locataire",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+33698765432",
  "address": "456 New Street, Lyon, France",
  "updatedAt": "2025-11-25T11:00:00.000Z"
}
```

**Note**: If password is updated, it will be automatically hashed.

**Example**:

```bash
curl -X PATCH http://localhost:3000/user/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+33698765432",
    "address": "456 New Street, Lyon, France"
  }'
```

---

### 5. Delete User

**DELETE** `/user/:id`

Deletes a user by ID.

**Response** (200 OK):

```json
{
  "message": "User deleted successfully"
}
```

**Error Response** (404 Not Found):

```json
{
  "statusCode": 404,
  "message": "User with ID 507f1f77bcf86cd799439011 not found"
}
```

**Example**:

```bash
curl -X DELETE http://localhost:3000/user/507f1f77bcf86cd799439011
```

---

## Relationships

### User → Garant (1:n)

A user can have multiple guarantors.

**Adding Garants to User**:

```bash
# 1. Create garant
curl -X POST http://localhost:3000/garant \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "phone": "+33612345679",
    "rib": "FR7630006000011234567890189"
  }'

# 2. Update user with garant ID
curl -X PATCH http://localhost:3000/user/USER_ID \
  -H "Content-Type: application/json" \
  -d '{
    "garants": ["GARANT_ID"]
  }'
```

---

## Features

### Password Hashing

Passwords are automatically hashed using bcrypt (10 rounds) before saving:

```typescript
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});
```

### Email Validation

Email format is validated using regex:

- Must be valid email format
- Must be unique in the database

---

## Common Use Cases

### 1. Register New Tenant

```bash
curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tenant@example.com",
    "password": "SecurePass123",
    "role": "locataire",
    "firstName": "Marie",
    "lastName": "Martin",
    "phone": "+33612345678",
    "dateOfBirth": "1995-05-20"
  }'
```

### 2. Register Property Owner

```bash
curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@example.com",
    "password": "SecurePass123",
    "role": "proprietaire",
    "firstName": "Pierre",
    "lastName": "Dupont",
    "phone": "+33698765432"
  }'
```

### 3. Update User Profile

```bash
curl -X PATCH http://localhost:3000/user/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+33600000000",
    "address": "789 Updated Street, Marseille"
  }'
```

---

## Error Handling

### Duplicate Email

```json
{
  "statusCode": 409,
  "message": "Email already exists"
}
```

### Invalid Email Format

```json
{
  "statusCode": 400,
  "message": "test@invalid Ce n'est pas un format d'adresse e-mail valide."
}
```

### Missing Required Fields

```json
{
  "statusCode": 400,
  "message": "firstName is required"
}
```

---

## Security Notes

1. **Password Storage**: Passwords are hashed with bcrypt (never stored in plain text)
2. **Password Retrieval**: Password field is excluded from all queries (`select: false`)
3. **Email Uniqueness**: Enforced at database level with unique index
4. **Role-Based Access**: Use roles to implement authorization in your application

---

## Related Resources

- [Garant API](./GARANT.md) - Guarantor management
- [Property API](./PROPERTY.md) - Property management (for owners)

# Garant (Guarantor) API Documentation

## Overview

The Garant resource manages guarantors for tenants. Guarantors are people who guarantee payment for rental properties.

---

## Schema

```typescript
{
  _id: ObjectId (auto-generated)
  firstName: string
  lastName: string
  phone: string
  email: string (validated)
  rib: string (French IBAN format, validated)
}
```

---

## Endpoints

### 1. Create Garant

**POST** `/garant`

Creates a new guarantor.

**Request Body**:

```json
{
  "firstName": "Marie",
  "lastName": "Dupont",
  "phone": "+33612345678",
  "email": "marie.dupont@example.com",
  "rib": "FR7630006000011234567890189"
}
```

**Response** (201 Created):

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "Marie",
  "lastName": "Dupont",
  "phone": "+33612345678",
  "email": "marie.dupont@example.com",
  "rib": "FR7630006000011234567890189"
}
```

**Validation Rules**:

- **email**: Must be valid email format with TLD
- **rib**: Must be valid French IBAN (starts with 'FR', minimum 10 characters)

**Example**:

```bash
curl -X POST http://localhost:3000/garant \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Marie",
    "lastName": "Dupont",
    "phone": "+33612345678",
    "email": "marie.dupont@example.com",
    "rib": "FR7630006000011234567890189"
  }'
```

---

### 2. Get All Garants

**GET** `/garant`

Returns all guarantors.

**Response** (200 OK):

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "Marie",
    "lastName": "Dupont",
    "phone": "+33612345678",
    "email": "marie.dupont@example.com",
    "rib": "FR7630006000011234567890189"
  }
]
```

**Example**:

```bash
curl http://localhost:3000/garant
```

---

### 3. Get Garant by ID

**GET** `/garant/:id`

Returns a single guarantor.

**Response** (200 OK):

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "Marie",
  "lastName": "Dupont",
  "phone": "+33612345678",
  "email": "marie.dupont@example.com",
  "rib": "FR7630006000011234567890189"
}
```

**Error Response** (404 Not Found):

```json
{
  "statusCode": 404,
  "message": "Garant with ID 507f... not found"
}
```

**Example**:

```bash
curl http://localhost:3000/garant/507f1f77bcf86cd799439011
```

---

### 4. Update Garant

**PATCH** `/garant/:id`

Updates guarantor information.

**Request Body**:

```json
{
  "phone": "+33698765432",
  "email": "new.email@example.com"
}
```

**Response** (200 OK):

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "Marie",
  "lastName": "Dupont",
  "phone": "+33698765432",
  "email": "new.email@example.com",
  "rib": "FR7630006000011234567890189"
}
```

**Example**:

```bash
curl -X PATCH http://localhost:3000/garant/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+33698765432"
  }'
```

---

### 5. Delete Garant

**DELETE** `/garant/:id`

Deletes a guarantor.

**Response** (200 OK):

```json
{
  "message": "Garant deleted successfully"
}
```

**Example**:

```bash
curl -X DELETE http://localhost:3000/garant/507f1f77bcf86cd799439011
```

---

## Validation

### Email Validation

- Must be valid email format
- Must have TLD (top-level domain)
- Display name is required

**Valid Examples**:

- `john.doe@example.com`
- `marie.dupont@gmail.com`

**Invalid Examples**:

- `invalid-email` (no @)
- `test@localhost` (no TLD)

### RIB (French IBAN) Validation

- Must start with 'FR'
- Must be at least 10 characters long
- Follows international IBAN format

**Valid Example**:

```
FR7630006000011234567890189
```

**Invalid Examples**:

- `DE1234567890` (not French)
- `FR123` (too short)

---

## Relationship with User

Garants are linked to Users (tenants) in a 1:n relationship.

### Link Garant to User

```bash
# 1. Create garant
GARANT_RESPONSE=$(curl -X POST http://localhost:3000/garant \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Marie",
    "lastName": "Dupont",
    "phone": "+33612345678",
    "email": "marie.dupont@example.com",
    "rib": "FR7630006000011234567890189"
  }')

GARANT_ID=$(echo $GARANT_RESPONSE | jq -r '._id')

# 2. Add garant to user
curl -X PATCH http://localhost:3000/user/USER_ID \
  -H "Content-Type: application/json" \
  -d "{
    \"garants\": [\"$GARANT_ID\"]
  }"
```

### Get User with Garants

```bash
curl http://localhost:3000/user/USER_ID
```

**Response**:

```json
{
  "_id": "USER_ID",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "garants": [
    {
      "_id": "GARANT_ID",
      "firstName": "Marie",
      "lastName": "Dupont",
      "email": "marie.dupont@example.com",
      "rib": "FR7630006000011234567890189"
    }
  ]
}
```

---

## Common Workflows

### 1. Add Guarantor to Tenant

```bash
# Create tenant
TENANT=$(curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tenant@example.com",
    "password": "password123",
    "role": "locataire",
    "firstName": "Pierre",
    "lastName": "Martin"
  }')

TENANT_ID=$(echo $TENANT | jq -r '._id')

# Create guarantor
GARANT=$(curl -X POST http://localhost:3000/garant \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Marie",
    "lastName": "Dupont",
    "phone": "+33612345678",
    "email": "marie.dupont@example.com",
    "rib": "FR7630006000011234567890189"
  }')

GARANT_ID=$(echo $GARANT | jq -r '._id')

# Link guarantor to tenant
curl -X PATCH http://localhost:3000/user/$TENANT_ID \
  -H "Content-Type: application/json" \
  -d "{\"garants\": [\"$GARANT_ID\"]}"
```

### 2. Update Guarantor Information

```bash
curl -X PATCH http://localhost:3000/garant/GARANT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+33600000000",
    "rib": "FR7630006000019876543210987"
  }'
```

---

## Error Handling

### Invalid Email

```json
{
  "statusCode": 400,
  "message": "Email validation failed"
}
```

### Invalid RIB

```json
{
  "statusCode": 400,
  "message": "Le RIB doit suivre le format international IBAN."
}
```

### RIB Not French

```json
{
  "statusCode": 400,
  "message": "RIB must be a French IBAN (start with FR)"
}
```

---

## Use Cases

### Tenant Onboarding

When a new tenant registers, they typically need to provide guarantor information:

1. Tenant creates account
2. Tenant provides guarantor details
3. System creates Garant record
4. System links Garant to User

### Guarantor Verification

Property owners can verify guarantor information:

1. Get tenant details with populated garants
2. Verify RIB is valid French IBAN
3. Contact guarantor via email/phone

---

## Related Resources

- [User API](./USER.md) - User management (tenants link to garants)

# Committee Designation Feature Documentation

## Overview
The Committee Designation feature enables administrators to create designations (positions) within committees and assign users to these positions. Each designation can have multiple roles, and users assigned to designations inherit those roles. This is designed for alumni association committee management with full historical tracking.

## Features

### Admin Features
- **Create Committee Designations**: Define positions within committees (President, Vice-President, Secretary, etc.)
- **Assign Roles to Designations**: Each designation can have multiple system roles
- **Assign Users to Designations**: Map users to specific committee positions
- **Manage Assignments**: Track assignment and unassignment dates
- **Update Designations**: Modify designation details and roles

### Public Features
- **View Committee Structure**: See all designations and assigned members for any committee
- **Historical Data**: Access previous committee members and their designations
- **Role Information**: Understand what roles are associated with each position

## Data Models

### Committee Designation Schema
```typescript
{
  name: string;              // Designation name (e.g., "President")
  description?: string;      // Optional description
  committeeId: ObjectId;     // Reference to committee
  roles: Role[];            // Array of system roles
  displayOrder: number;     // Order for display (0 = first)
  isActive: boolean;        // Whether designation is active
  createdAt: Date;          // Auto-generated
  updatedAt: Date;          // Auto-generated
}
```

### Committee Member Schema
```typescript
{
  committeeId: ObjectId;     // Reference to committee
  designationId: ObjectId;   // Reference to designation
  userId: ObjectId;          // Reference to user
  assignedDate: Date;        // When user was assigned
  unassignedDate?: Date;     // When user was unassigned (if applicable)
  isActive: boolean;         // Whether assignment is currently active
  notes?: string;            // Optional notes about the assignment
  createdAt: Date;           // Auto-generated
  updatedAt: Date;           // Auto-generated
}
```

## API Endpoints

### Admin Endpoints

#### Create Committee Designation
```
POST /committee-designations
```
**Body:**
```json
{
  "name": "President",
  "description": "Committee President with full administrative authority",
  "committeeId": "committee_object_id",
  "roles": ["admin", "publisher"],
  "displayOrder": 0
}
```

#### Update Committee Designation
```
PATCH /committee-designations/:id
```
**Body:**
```json
{
  "name": "Updated President",
  "description": "Updated description",
  "roles": ["admin", "publisher", "reviewer"],
  "displayOrder": 1,
  "isActive": true
}
```

#### Assign Member to Designation
```
POST /committee-designations/members/assign
```
**Body:**
```json
{
  "committeeId": "committee_object_id",
  "designationId": "designation_object_id",
  "userId": "user_object_id",
  "assignedDate": "2024-01-01T00:00:00.000Z",
  "notes": "Elected for 2024-2025 term"
}
```

#### Unassign Member from Designation
```
PATCH /committee-designations/members/:memberId/unassign
```
**Body:**
```json
{
  "unassignedDate": "2024-12-31T23:59:59.999Z",
  "notes": "Term completed"
}
```

### Public Endpoints

#### Get Committee Designations
```
GET /committee-designations/committee/:committeeId
```
Returns all active designations for a committee.

#### Get Committee Members
```
GET /committee-designations/committee/:committeeId/members?includeInactive=false
```
Returns members assigned to committee designations.

#### Get Committee Structure
```
GET /committee-designations/committee/:committeeId/structure
```
Returns structured view with designations and their assigned members:
```json
[
  {
    "designation": { /* designation object */ },
    "member": { /* member object or null */ }
  }
]
```

#### Get Complete Committee Information
```
GET /committee-designations/committee/:committeeId/full?includeInactive=false
```
Returns both designations and members in separate arrays.

### Member/User Endpoints

#### Get User Committee History
```
GET /committee-designations/user/:userId/history?includeInactive=false
```
Returns all committee assignments for a user.

#### Get User Active Roles
```
GET /committee-designations/user/:userId/roles
```
Returns all roles inherited from active committee assignments.

## Business Rules

### Designation Management
1. **Committee Mapping**: Each designation must belong to a specific committee
2. **Role Assignment**: Designations can have multiple system roles
3. **Display Order**: Controls the order of positions in committee hierarchy
4. **Active Status**: Inactive designations are hidden from public view

### Member Assignment
1. **Unique Assignment**: One user can only have one active assignment per committee
2. **Unique Designation**: One designation can only have one active member per committee
3. **Historical Tracking**: All assignments are tracked with dates
4. **Role Inheritance**: Users inherit all roles from their active designations

### Data Integrity
1. **Soft Deletion**: Members are unassigned, not deleted
2. **Historical Preservation**: Past assignments remain for historical reference
3. **Referential Integrity**: Foreign key relationships maintained

## Usage Examples

### Creating Committee Designations
```bash
# Create President designation
curl -X POST http://localhost:3000/committee-designations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "name": "President",
    "description": "Committee President",
    "committeeId": "60f1b2b5b8b8b8b8b8b8b8b8",
    "roles": ["admin", "publisher"],
    "displayOrder": 0
  }'

# Create Vice-President designation
curl -X POST http://localhost:3000/committee-designations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "name": "Vice-President",
    "description": "Committee Vice-President", 
    "committeeId": "60f1b2b5b8b8b8b8b8b8b8b8",
    "roles": ["reviewer", "publisher"],
    "displayOrder": 1
  }'
```

### Assigning Members
```bash
# Assign user to President position
curl -X POST http://localhost:3000/committee-designations/members/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "committeeId": "60f1b2b5b8b8b8b8b8b8b8b8",
    "designationId": "60f1b2b5b8b8b8b8b8b8b8b9",
    "userId": "60f1b2b5b8b8b8b8b8b8b8ba",
    "notes": "Elected for 2024-2025 term"
  }'
```

### Viewing Committee Structure (Public)
```bash
# Get current committee structure
curl -X GET http://localhost:3000/committee-designations/committee/60f1b2b5b8b8b8b8b8b8b8b8/structure

# Get committee with historical data
curl -X GET http://localhost:3000/committee-designations/committee/60f1b2b5b8b8b8b8b8b8b8b8/full?includeInactive=true
```

### Getting User Information
```bash
# Get user's committee history
curl -X GET http://localhost:3000/committee-designations/user/60f1b2b5b8b8b8b8b8b8b8ba/history \
  -H "Authorization: Bearer <token>"

# Get user's current roles from committee assignments
curl -X GET http://localhost:3000/committee-designations/user/60f1b2b5b8b8b8b8b8b8b8ba/roles \
  -H "Authorization: Bearer <token>"
```

## Integration with Committee Feature

The committee designation feature integrates seamlessly with the main committee feature:

1. **Committee Lifecycle**: When committees are published/unpublished, designations remain but member visibility may be affected
2. **Historical Tracking**: Previous committee members remain accessible for historical reference
3. **Current vs. Previous**: Use committee dates to determine current vs. previous committee members
4. **Public Display**: Combine committee information with member designations for complete public display

## Common Use Cases

### Alumni Association Management
- **Executive Board**: President, Vice-President, Secretary, Treasurer
- **Department Heads**: Technical, Finance, Events, Publications
- **Committee Members**: General members with specific roles

### Public Website Display
- **Current Committee**: Show active committee with all positions and members
- **Alumni History**: Display previous committee members and their contributions
- **Role-based Access**: Control what different committee members can do in the system

### System Administration
- **Dynamic Roles**: Automatically assign system roles based on committee positions
- **Access Control**: Use designation roles for permission management
- **Audit Trail**: Track who held what positions when

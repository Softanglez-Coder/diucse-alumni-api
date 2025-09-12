# Enhanced Role System Documentation

## Overview

The enhanced role system now combines **static roles** (assigned directly to users) with **designation roles** (inherited from committee positions). This provides a dynamic, context-aware permission system for the alumni association.

## Role Types

### 1. Static Roles
- Assigned directly to users in the database
- Permanent until manually changed
- Examples: `member`, `admin`, `guest`

### 2. Designation Roles  
- Inherited from committee positions
- Dynamic based on active committee assignments
- Examples: User assigned as "President" gets `admin` and `publisher` roles

### 3. Combined Roles
- Union of static and designation roles
- Used for actual authorization decisions
- Automatically calculated and returned in API responses

## API Changes

### Authentication Endpoint (`/auth/me`)

**Previous Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com", 
  "name": "John Doe",
  "roles": ["member"]
}
```

**New Enhanced Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe", 
  "roles": ["member", "admin", "publisher"],
  "staticRoles": ["member"],
  "designationRoles": ["admin", "publisher"]
}
```

### User Endpoints

#### Get User by ID with All Roles
```
GET /users/:id/with-roles
```

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "roles": ["member", "admin", "publisher"],
  "staticRoles": ["member"], 
  "designationRoles": ["admin", "publisher"]
}
```

#### Get All Users with Roles (Admin Only)
```
GET /users/all/with-roles
Authorization: Bearer <admin-token>
```

**Response:**
```json
[
  {
    "id": "user1_id",
    "name": "John Doe (President)",
    "roles": ["member", "admin", "publisher"],
    "staticRoles": ["member"],
    "designationRoles": ["admin", "publisher"]
  },
  {
    "id": "user2_id", 
    "name": "Jane Smith (Vice-President)",
    "roles": ["member", "reviewer", "publisher"],
    "staticRoles": ["member"],
    "designationRoles": ["reviewer", "publisher"]
  }
]
```

## Authorization Flow

### 1. Authentication Guard
```typescript
// When user logs in or makes authenticated request:
1. JWT token is verified
2. User data is fetched from database  
3. Committee designation roles are fetched
4. Static + designation roles are combined
5. Enhanced user object is attached to request
```

### 2. Role Guard  
```typescript
// When checking permissions:
1. Required roles are extracted from route metadata
2. User's combined roles are checked
3. Access granted if user has any required role
```

### 3. Example Authorization Check
```typescript
@Roles(Role.Admin, Role.Publisher)
@Get('sensitive-data')
async getSensitiveData(@Req() req) {
  // User needs either admin OR publisher role
  // Can come from static assignment OR committee designation
  return sensitiveData;
}
```

## Committee Integration Examples

### Executive Committee Structure
```typescript
// Committee: Executive Board 2024-2025
const designations = [
  {
    name: "President",
    roles: ["admin", "publisher"],
    member: "John Doe"
  },
  {
    name: "Vice-President", 
    roles: ["reviewer", "publisher"],
    member: "Jane Smith"
  },
  {
    name: "Secretary",
    roles: ["publisher"],
    member: "Bob Johnson"
  },
  {
    name: "Treasurer",
    roles: ["accountant", "publisher"], 
    member: "Alice Brown"
  }
];
```

### Role Inheritance Timeline
```
January 2024: John assigned as President
├── Static roles: ["member"]
├── Designation roles: ["admin", "publisher"] 
└── Combined roles: ["member", "admin", "publisher"]

December 2024: John's term ends, unassigned from President
├── Static roles: ["member"] 
├── Designation roles: []
└── Combined roles: ["member"]

January 2025: Sarah assigned as new President
├── Static roles: ["member"]
├── Designation roles: ["admin", "publisher"]
└── Combined roles: ["member", "admin", "publisher"]
```

## Implementation Details

### Error Handling
- If committee designation service fails, users fall back to static roles only
- All designation role failures are logged for monitoring
- System remains functional even if committee features are unavailable

### Performance Considerations
- Designation roles are fetched once during authentication
- Results are cached in request user object
- No additional database calls during authorization checks

### Circular Dependency Prevention
- Used `forwardRef()` to handle User ↔ CommitteeDesignation module dependencies
- Proper module structure prevents initialization issues

## Frontend Integration

### React/Angular Usage
```typescript
// Get current user with all roles
const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
  
  // response.data structure:
  // {
  //   roles: ["member", "admin", "publisher"],     // Use for permission checks
  //   staticRoles: ["member"],                     // For display/audit
  //   designationRoles: ["admin", "publisher"]     // For display/audit  
  // }
};

// Check permissions
const canUserAccessAdmin = (user) => {
  return user.roles.includes('admin');
};

// Show role sources in UI
const RoleDisplay = ({ user }) => (
  <div>
    <h3>Current Roles</h3>
    <p>Static: {user.staticRoles.join(', ')}</p>
    <p>From Committee: {user.designationRoles.join(', ')}</p>
    <p>Total Access: {user.roles.join(', ')}</p>
  </div>
);
```

### Role-Based UI Components
```typescript
const AdminPanel = ({ user }) => {
  if (!user.roles.includes('admin')) {
    return <div>Access Denied</div>;
  }
  
  return (
    <div>
      <h2>Admin Panel</h2>
      {user.designationRoles.includes('admin') && (
        <p>You have admin access through your committee position</p>
      )}
      {user.staticRoles.includes('admin') && (
        <p>You have permanent admin access</p>
      )}
    </div>
  );
};
```

## Security Considerations

### Principle of Least Privilege
- Users start with minimal static roles
- Additional permissions granted through committee assignments
- Permissions automatically removed when assignments end

### Audit Trail
- All role changes are logged
- Committee assignment history is preserved
- Easy to track "who had what access when"

### Dynamic Permission Revocation
- Unassigning from committee immediately removes associated roles
- No need to manually update user permissions
- Automatic cleanup when committee terms end

## Migration Guide

### For Existing Users
1. Current user roles remain unchanged
2. Additional roles added through committee assignments
3. No breaking changes to existing functionality

### For Existing Frontend Code
1. `user.roles` array now contains combined roles
2. Permission checking logic remains the same
3. Optional: Use new `staticRoles` and `designationRoles` for enhanced UI

### Database Changes
- No changes to existing user schema
- New committee designation collections added
- All existing data preserved

This enhanced role system provides a powerful, flexible foundation for managing permissions in an alumni association context while maintaining backward compatibility and system reliability.

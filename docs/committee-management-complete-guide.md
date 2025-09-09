# Committee Management System - Complete Feature Overview

## System Architecture

The committee management system consists of two main features that work together:

1. **Committee Feature**: Manages committee periods and publication status
2. **Committee Designation Feature**: Manages positions within committees and member assignments

## Feature Integration

### Committee → Designation Relationship
- **One Committee** can have **Many Designations** (President, Vice-President, etc.)
- **One Designation** can have **One Active Member** at a time
- **One User** can have **One Active Assignment** per committee

### Data Flow
```
Committee (2024-2025) 
├── Designation: President (roles: admin, publisher)
│   └── Member: John Doe (2024-01-01 to active)
├── Designation: Vice-President (roles: reviewer, publisher)  
│   └── Member: Jane Smith (2024-01-01 to active)
└── Designation: Secretary (roles: member)
    └── Member: Bob Johnson (2024-01-01 to 2024-06-01) [previous]
    └── Member: Alice Brown (2024-06-01 to active) [current]
```

## Complete API Workflow

### 1. Create Committee Structure
```bash
# Step 1: Create Committee
POST /committees
{
  "name": "Executive Committee 2024-2025",
  "startDate": "2024-01-01",
  "endDate": "2025-12-31"
}

# Step 2: Create Designations
POST /committee-designations
{
  "name": "President",
  "committeeId": "committee_id",
  "roles": ["admin", "publisher"],
  "displayOrder": 0
}

POST /committee-designations  
{
  "name": "Vice-President",
  "committeeId": "committee_id", 
  "roles": ["reviewer", "publisher"],
  "displayOrder": 1
}

# Step 3: Assign Members
POST /committee-designations/members/assign
{
  "committeeId": "committee_id",
  "designationId": "president_designation_id", 
  "userId": "user_id"
}
```

### 2. Public Display Workflow
```bash
# Get current committee
GET /committees/current

# Get committee structure with members
GET /committee-designations/committee/{committeeId}/structure

# Get previous committees
GET /committees/previous

# For each previous committee, get their members
GET /committee-designations/committee/{committeeId}/full?includeInactive=true
```

## Role-Based Access Control

### Automatic Role Assignment
When a user is assigned to a designation, they automatically inherit all roles from that designation:

```typescript
// User assigned to President designation
user.activeRoles = ["admin", "publisher", "member"] // member is default

// User assigned to Vice-President designation  
user.activeRoles = ["reviewer", "publisher", "member"]
```

### Role Hierarchy for Alumni Association
```
┌─────────────────┬──────────────────┬─────────────────────────────┐
│ Designation     │ Roles            │ Permissions                 │
├─────────────────┼──────────────────┼─────────────────────────────┤
│ President       │ admin, publisher │ Full system access          │
│ Vice-President  │ reviewer,        │ Content management,         │
│                 │ publisher        │ member approval             │
│ Secretary       │ publisher        │ Content management          │
│ Treasurer       │ accountant,      │ Financial management,       │
│                 │ publisher        │ invoice handling            │
│ Event Manager   │ event_manager,   │ Event planning,             │
│                 │ publisher        │ content management          │
│ General Member  │ member           │ Basic access                │
└─────────────────┴──────────────────┴─────────────────────────────┘
```

## Frontend Integration Examples

### React/Next.js Component Example
```jsx
// Committee Display Component
function CommitteeDisplay({ committeeId }) {
  const [committee, setCommittee] = useState(null);
  const [structure, setStructure] = useState([]);

  useEffect(() => {
    // Get committee info
    fetch(`/api/committees/${committeeId}`)
      .then(res => res.json())
      .then(setCommittee);
    
    // Get committee structure
    fetch(`/api/committee-designations/committee/${committeeId}/structure`)
      .then(res => res.json()) 
      .then(setStructure);
  }, [committeeId]);

  return (
    <div>
      <h2>{committee?.name}</h2>
      <p>Period: {committee?.startDate} - {committee?.endDate}</p>
      
      <div className="committee-members">
        {structure.map(({ designation, member }) => (
          <div key={designation._id} className="designation">
            <h3>{designation.name}</h3>
            {member ? (
              <div className="member">
                <img src={member.userId.avatar} alt="" />
                <span>{member.userId.name}</span>
                <small>Since: {member.assignedDate}</small>
              </div>
            ) : (
              <div className="vacant">Position Vacant</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Historical Committee View
```jsx
function CommitteeHistory() {
  const [committees, setCommittees] = useState({ current: null, previous: [] });
  
  useEffect(() => {
    fetch('/api/committees/status')
      .then(res => res.json())
      .then(setCommittees);
  }, []);

  return (
    <div>
      {committees.current && (
        <section>
          <h2>Current Committee</h2>
          <CommitteeDisplay committeeId={committees.current._id} />
        </section>
      )}
      
      <section>
        <h2>Previous Committees</h2>
        {committees.previous.map(committee => (
          <CommitteeDisplay 
            key={committee._id} 
            committeeId={committee._id} 
          />
        ))}
      </section>
    </div>
  );
}
```

## Database Indexes

### Recommended Indexes for Performance
```javascript
// Committee Collection
db.committees.createIndex({ "isPublished": 1, "startDate": 1, "endDate": 1 });
db.committees.createIndex({ "startDate": 1 });
db.committees.createIndex({ "endDate": 1 });

// Committee Designations Collection  
db.committee_designations.createIndex({ "committeeId": 1, "isActive": 1 });
db.committee_designations.createIndex({ "committeeId": 1, "displayOrder": 1 });

// Committee Members Collection
db.committee_members.createIndex({ "committeeId": 1, "isActive": 1 });
db.committee_members.createIndex({ "userId": 1, "isActive": 1 });
db.committee_members.createIndex({ "designationId": 1, "isActive": 1 });
db.committee_members.createIndex({ "committeeId": 1, "userId": 1, "isActive": 1 }, { unique: true, partialFilterExpression: { "isActive": true } });
```

## Best Practices

### 1. Committee Lifecycle Management
- Always create designations after creating a committee
- Assign members only to active designations
- Maintain historical data by unassigning rather than deleting

### 2. Role Management
- Design designation roles based on actual system permissions needed
- Use role inheritance to simplify user permission management
- Regularly audit active roles and assignments

### 3. Data Consistency
- Always validate committee, designation, and user existence before assignments
- Use transactions for multi-step operations
- Implement proper error handling for constraint violations

### 4. Performance Optimization
- Use appropriate database indexes
- Implement caching for frequently accessed committee structures
- Consider pagination for large historical datasets

### 5. Security Considerations
- Validate user permissions before showing admin endpoints
- Implement rate limiting on assignment operations
- Log all administrative actions for audit trails

This complete committee management system provides a robust foundation for alumni association management with full historical tracking, role-based access control, and flexible committee structures.

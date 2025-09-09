# Committee Feature Documentation

## Overview
The Committee feature allows administrators to create, manage, and publish committees for specific time periods. Each committee has a name and a defined period (default: one year), and can be published or unpublished as needed.

## Features

### Admin Features
- **Create Committee**: Create a new committee with name and period
- **Edit Committee**: Update committee information (name, start date, end date)
- **Publish/Unpublish**: Control committee visibility
- **View All Committees**: List all committees with filtering and pagination

### Public Features
- **View Published Committees**: Access all published committees
- **View Current Committee**: Get the currently active committee (based on current date)
- **View Previous Committees**: Get all committees that have ended
- **View Upcoming Committees**: Get all committees that haven't started yet
- **View Committees by Status**: Get committees organized by current, previous, and upcoming

## API Endpoints

### Admin Endpoints (Requires Admin Role)

#### Create Committee
```
POST /committees
```
**Body:**
```json
{
  "name": "Committee Name",
  "startDate": "2024-01-01T00:00:00.000Z", // Optional, defaults to current date
  "endDate": "2025-01-01T00:00:00.000Z"    // Optional, defaults to one year from start
}
```

#### Update Committee
```
PATCH /committees/:id
```
**Body:**
```json
{
  "name": "Updated Committee Name",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2025-01-01T00:00:00.000Z",
  "isPublished": true
}
```

#### Publish/Unpublish Committee
```
PATCH /committees/:id/publish
```
**Body:**
```json
{
  "isPublished": true // or false to unpublish
}
```

#### Get All Committees (with filtering)
```
GET /committees?page=1&limit=10&search=committee&isPublished=true
```

### Public Endpoints

#### Get Published Committees
```
GET /committees/published
```

#### Get Current Committee
```
GET /committees/current
```
Returns the committee that is currently active (current date falls within its period).

#### Get Previous Committees
```
GET /committees/previous
```
Returns all committees that have ended (current date is after their end date).

#### Get Upcoming Committees
```
GET /committees/upcoming
```
Returns all committees that haven't started yet (current date is before their start date).

#### Get Committees by Status
```
GET /committees/status
```
Returns committees organized by status:
```json
{
  "current": { /* current committee or null */ },
  "previous": [ /* array of previous committees */ ],
  "upcoming": [ /* array of upcoming committees */ ]
}
```

## Data Model

### Committee Schema
```typescript
{
  name: string;           // Committee name
  startDate: Date;        // Committee start date
  endDate: Date;          // Committee end date
  isPublished: boolean;   // Publication status (default: false)
  createdAt: Date;        // Auto-generated
  updatedAt: Date;        // Auto-generated
}
```

## Business Rules

1. **Period Validation**: End date must be after start date
2. **Default Period**: If no dates provided, defaults to one year from current date
3. **No Deletion**: Committees cannot be deleted (as per requirements)
4. **Multiple Published**: Multiple committees can be published simultaneously
5. **Publication Control**: Only published committees are visible to non-admin users
6. **Current Committee**: Determined by current date falling within the committee's period
7. **Date-based Categorization**: 
   - **Current**: Published committees where current date is between start and end date
   - **Previous**: Published committees where current date is after end date
   - **Upcoming**: Published committees where current date is before start date

## Usage Examples

### Creating a Committee
```bash
curl -X POST http://localhost:3000/committees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "name": "Executive Committee 2024"
  }'
```

### Publishing a Committee
```bash
curl -X PATCH http://localhost:3000/committees/:id/publish \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "isPublished": true
  }'
```

### Getting Current Committee (Public)
```bash
curl -X GET http://localhost:3000/committees/current
```

### Getting Previous Committees (Public)
```bash
curl -X GET http://localhost:3000/committees/previous
```

### Getting All Committees by Status (Public)
```bash
curl -X GET http://localhost:3000/committees/status
```

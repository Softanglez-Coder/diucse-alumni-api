# Event Feature Documentation

## Overview

The Event feature provides comprehensive event management functionality for the DIU CSE Alumni API. It includes event creation, management, registration, and coupon systems.

## Architecture

The Event feature consists of three main modules:

1. **Event Module** - Core event management
2. **Event Registration Module** - Handles user registrations
3. **Event Coupon Module** - Manages discount coupons

## Core Features

### Event Management

#### Event Creation and Updates

- Create events with title, fee, dates, description, location, capacity
- Validate event dates (start must be before end, cannot be in the past)
- Update event details
- Publish/unpublish events
- Open/close registration

#### Event Status Management

- **Draft**: Events that are not yet published
- **Published**: Events visible to users
- **Open/Closed**: Registration status

### Event Registration

#### Registration Process

- Users can register for published and open events
- Automatic capacity management
- Waitlist functionality when capacity is reached
- Coupon code application during registration

#### Registration Status

- **Pending**: Initial status for new registrations
- **Confirmed**: Approved registrations
- **Waitlisted**: When event capacity is full
- **Cancelled**: Cancelled registrations

### Event Coupons

#### Coupon Management

- Create discount coupons for events
- Set coupon quantity and discount amount
- Track coupon usage
- Validate coupon codes

## API Endpoints

### Event Endpoints

#### Public Endpoints

```
GET /events                    # Get all events (with filters)
GET /events/published          # Get published events
GET /events/upcoming           # Get upcoming events
GET /events/past              # Get past events
GET /events/:id               # Get specific event
```

#### Event Manager Endpoints

```
POST /events                          # Create new event
PATCH /events/:id                     # Update event
PATCH /events/:id/publish             # Publish event
PATCH /events/:id/unpublish           # Unpublish event
PATCH /events/:id/registration/open   # Open registration
PATCH /events/:id/registration/close  # Close registration
```

### Event Registration Endpoints

#### Public Endpoints

```
POST /event-registrations                     # Register for event
PATCH /event-registrations/:id/cancel         # Cancel registration
GET /event-registrations/user/:userId         # Get user's registrations
```

#### Event Manager Endpoints

```
PATCH /event-registrations/:id/status         # Update registration status
PATCH /event-registrations/:id/confirm        # Confirm registration
PATCH /event-registrations/:id/waitlist       # Move to waitlist
GET /event-registrations/event/:eventId       # Get event registrations
```

### Event Coupon Endpoints

#### Event Manager Endpoints

```
POST /event-coupons                           # Create coupon
PATCH /event-coupons/:id                      # Update coupon
POST /event-coupons/:eventId/validate         # Validate coupon
PATCH /event-coupons/:id/use                  # Use coupon
GET /event-coupons/event/:eventId             # Get event coupons
GET /event-coupons/event/:eventId/available   # Get available coupons
```

## Data Transfer Objects (DTOs)

### Event DTOs

#### CreateEventDto

```typescript
{
  title: string;                    // Event title (required)
  fee: number;                      // Registration fee (required)
  start: string;                    // Start date (ISO string)
  end: string;                      // End date (ISO string)
  description?: string;             // Event description
  location?: string;                // Event location
  mapLocation?: string;             // Google Maps URL
  banner?: string;                  // Banner image URL
  capacity?: number;                // Maximum attendees
  open?: boolean;                   // Registration open status
  justificationOfClosing?: string;  // Reason if closed
  published?: boolean;              // Publication status
  memberOnly?: boolean;             // Alumni members only
}
```

#### UpdateEventDto

```typescript
// Partial version of CreateEventDto
```

#### CloseRegistrationDto

```typescript
{
  justification: string; // Required reason for closing
}
```

#### UnpublishEventDto

```typescript
{
  justification?: string; // Optional reason for unpublishing
}
```

### Event Registration DTOs

#### CreateEventRegistrationDto

```typescript
{
  event: ObjectId;    // Event ID (required)
  guest: ObjectId;    // User ID (required)
  coupon?: ObjectId;  // Optional coupon ID
}
```

#### UpdateRegistrationStatusDto

```typescript
{
  status: EventRegistrationStatus; // New status
}
```

### Event Coupon DTOs

#### CreateEventCouponDto

```typescript
{
  event: ObjectId; // Event ID (required)
  quantity: number; // Total coupon quantity
  amount: number; // Discount amount
  code: string; // Unique coupon code
}
```

#### ValidateCouponDto

```typescript
{
  code: string; // Coupon code to validate
}
```

## Business Logic

### Event Validation

- Start date must be before end date
- Start date cannot be in the past
- Published events can accept registrations if open
- Event capacity is enforced automatically

### Registration Logic

- Users cannot register twice for the same event
- Registrations are automatically waitlisted when capacity is reached
- Event managers can manually confirm or waitlist registrations

### Coupon System

- Coupon codes must be unique
- Coupons track usage count vs. total quantity
- Invalid or exhausted coupons are rejected

## Permissions

### Role-based Access Control

- **Public**: View published events, register, cancel own registrations
- **EventManager**: Full event management, registration management, coupon management

## Error Handling

The API provides comprehensive error handling:

- **400 Bad Request**: Invalid data, business rule violations
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate resources (e.g., duplicate registration)

## Query Parameters

All list endpoints support pagination and filtering:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search in name, description, tags
- `sort`: Sort order (asc/desc)
- `sortBy`: Field to sort by

Additional filters can be passed as query parameters matching the schema fields.

## Usage Examples

### Creating an Event

```typescript
POST /events
{
  "title": "Alumni Reunion 2025",
  "fee": 1500,
  "start": "2025-12-01T10:00:00Z",
  "end": "2025-12-01T18:00:00Z",
  "description": "Annual alumni gathering",
  "location": "STC, Dhaka International University",
  "capacity": 200,
  "memberOnly": true
}
```

### Registering for an Event

```typescript
POST /event-registrations
{
  "event": "event_object_id",
  "guest": "user_object_id",
  "coupon": "coupon_object_id" // optional
}
```

### Creating a Coupon

```typescript
POST /event-coupons
{
  "event": "event_object_id",
  "quantity": 50,
  "amount": 200,
  "code": "EARLY_BIRD_2025"
}
```

## Integration Points

The Event feature integrates with:

- **User Module**: For user authentication and profile data
- **Invoice Module**: For payment processing
- **Mail Module**: For event notifications (registration confirmations, etc.)

## Future Enhancements

Potential future features:

- Event categories and tags
- Recurring events
- Event templates
- Advanced reporting and analytics
- Email notifications for event updates
- Calendar integration
- QR code generation for tickets

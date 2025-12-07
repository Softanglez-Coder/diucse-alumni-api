# Auth0 Authentication Integration

This document describes how the application uses Auth0 for authentication.

## Overview

The application has been integrated with Auth0 to handle user authentication. This replaces the previous email/password authentication system with a more secure and feature-rich solution that supports:

- Regular email/password authentication
- Social login providers (Google, Facebook, Twitter, etc.)
- Multi-factor authentication (MFA)
- Enterprise SSO
- Passwordless authentication

## How It Works

### 1. Authentication Flow

1. **User initiates login**: User visits the frontend application and clicks "Login"
2. **Redirect to Auth0**: Frontend redirects to `/auth/auth0/login` endpoint
3. **Auth0 login page**: User is redirected to Auth0's Universal Login page
4. **User authenticates**: User logs in using their preferred method (email/password, social, etc.)
5. **Auth0 callback**: Auth0 redirects back to `/auth/auth0/callback` with authentication code
6. **User creation/update**: Backend validates the Auth0 token and creates or updates the user in the database
7. **JWT token generation**: Backend generates a local JWT token for the user
8. **Cookie set**: JWT token is stored in an HTTP-only cookie
9. **Redirect to frontend**: User is redirected back to the frontend with success message

### 2. Token Validation

The application supports two types of tokens:

#### Local JWT Tokens (from cookies)
- Used for web applications
- Stored in `auth_token` cookie
- Validated against `JWT_SECRET`

#### Auth0 JWT Tokens (from Authorization header)
- Used for API clients and mobile apps
- Sent in `Authorization: Bearer <token>` header
- Validated against Auth0's JWKS endpoint

### 3. User Management

#### New Users
When a user logs in via Auth0 for the first time:
- A new user record is created in the database
- User's email, name, and photo are extracted from Auth0 profile
- `auth0Id` is stored to link the user to their Auth0 identity
- Email is marked as verified (Auth0 handles email verification)
- Default role is `Guest`

#### Existing Users
When an existing user (created before Auth0 integration) logs in:
- User is found by email
- `auth0Id` is added to their record
- User's profile is updated with Auth0 information

#### System Administrator
The email `csediualumni.official@gmail.com` is automatically assigned the `Admin` role when logging in via Auth0. This replaces the previous `BOT_EMAIL`/`BOT_PASSWORD` system.

## Configuration

### Environment Variables

Add the following to your `.env` file:

```env
# Auth0 Configuration
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=your-api-identifier
```

### Auth0 Dashboard Setup

1. **Create an Application**:
   - Go to [Auth0 Dashboard](https://manage.auth0.com/)
   - Navigate to Applications → Applications
   - Click "Create Application"
   - Choose "Regular Web Application"
   - Give it a name (e.g., "DIU CSE Alumni API")

2. **Configure Application Settings**:
   - **Allowed Callback URLs**: Add your server callback URL
     - Development: `http://localhost:3000/auth/auth0/callback`
     - Production: `https://your-domain.com/auth/auth0/callback`
   - **Allowed Logout URLs**: Add your frontend URLs
     - Development: `http://localhost:3001`
     - Production: `https://your-frontend-domain.com`
   - **Allowed Web Origins**: Add your frontend URLs

3. **Create an API**:
   - Navigate to Applications → APIs
   - Click "Create API"
   - Give it a name and identifier (e.g., `https://api.csediualumni.com`)
   - Use the identifier as `AUTH0_AUDIENCE`

4. **Enable Social Connections** (Optional):
   - Navigate to Authentication → Social
   - Enable desired social providers (Google, Facebook, etc.)

## API Endpoints

### Login Initiation
```
GET /auth/auth0/login
```
Redirects to Auth0 Universal Login page.

### Auth0 Callback
```
GET /auth/auth0/callback
```
Handles callback from Auth0, creates/updates user, and redirects to frontend.

### Get Current User
```
GET /auth/me
Authorization: Bearer <token>
```
Returns the currently authenticated user.

### Logout
```
POST /auth/logout
```
Clears the authentication cookie.

## Profile Updates

Users can update their profile information after authentication. The profile update functionality remains unchanged and works with Auth0-authenticated users.

## Migration from Old System

### For New Deployments
- Simply configure Auth0 and users will authenticate via Auth0

### For Existing Deployments
- Existing users with email/password will be migrated to Auth0 when they first log in via Auth0
- Their `auth0Id` will be linked to their existing account
- All previous data and roles are preserved

## Security Considerations

1. **Token Validation**: Both local JWT and Auth0 JWT tokens are validated
2. **HTTPS Required**: In production, all authentication must happen over HTTPS
3. **HTTP-Only Cookies**: JWT tokens are stored in HTTP-only cookies to prevent XSS attacks
4. **CORS**: Ensure CORS is properly configured for your frontend domain
5. **Token Expiration**: Tokens expire after 7 days

## Troubleshooting

### "No token provided"
- Ensure you're sending the token in either:
  - Cookie: `auth_token`
  - Header: `Authorization: Bearer <token>`

### "Invalid token"
- Check that Auth0 environment variables are correctly configured
- Verify token hasn't expired
- Ensure Auth0 domain and audience match your configuration

### "User not found"
- User should be automatically created on first login
- Check Auth0 is returning email in the token

### "Auth0 not configured"
- Ensure all Auth0 environment variables are set
- Verify Auth0 application and API are properly configured

## Testing

### Manual Testing with Postman

1. **Login via Auth0**:
   - In browser, navigate to: `http://localhost:3000/auth/auth0/login`
   - Complete login on Auth0
   - You'll be redirected back with a cookie set

2. **Use the token in Postman**:
   - Get token from browser cookies
   - Add to Postman request: `Authorization: Bearer <token>`

### Frontend Integration

Frontend should:
1. Redirect to `/auth/auth0/login` for login
2. Handle callback at `/auth/callback?success=true`
3. Store token in cookies (handled by backend)
4. Include token in API requests (automatically included from cookies)

## Admin Role Assignment

The system automatically assigns the `Admin` role to any user logging in with the email `csediualumni.official@gmail.com`. This is checked and updated on every login to ensure the official account always has admin privileges.

## Next Steps

- Configure Auth0 rules for additional user metadata
- Set up Auth0 Actions for custom authentication flows
- Implement refresh token rotation for enhanced security
- Add Auth0 Management API integration for user management

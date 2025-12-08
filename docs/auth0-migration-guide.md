# Migration Guide: Local Authentication to Auth0

This guide explains how existing users with email/password authentication will transition to Auth0.

## Overview

The application has been updated to use Auth0 for all authentication. This provides:
- Enhanced security
- Social login options (Google, Facebook, etc.)
- Multi-factor authentication support
- Better password management

## What Changed

### Before (Local Authentication)
- Users registered with email/password stored in the database
- Passwords were hashed using bcrypt
- Email verification and password reset were handled locally
- Admin role was assigned via BOT_EMAIL/BOT_PASSWORD environment variables

### After (Auth0 Authentication)
- Users authenticate via Auth0 (supports email/password and social logins)
- Passwords are managed by Auth0 (not stored in our database)
- Email verification and password reset are handled by Auth0
- Admin role is automatically assigned to `csediualumni.official@gmail.com`

## For Existing Users

### Automatic Migration Process

When an existing user (who previously registered with email/password) logs in via Auth0 for the first time:

1. **User logs in via Auth0** with their email
2. **System finds existing account** by email
3. **Account is linked** - The Auth0 ID is added to the existing user record
4. **All data is preserved** - Name, photo, batch, roles, and all other information remain intact
5. **Profile update works as before** - Users can still update their profile after logging in

### What Users Need to Do

1. **First-time Auth0 Login**:
   - Click "Login" on the application
   - They'll be redirected to Auth0
   - If using the same email:
     - They may need to reset their password through Auth0 if they don't remember it
     - Or they can use social login (Google, etc.) if the email matches

2. **If Password is Different/Forgotten**:
   - On Auth0 login page, click "Forgot Password"
   - Auth0 will send a password reset email
   - Set a new password

3. **Using Social Login**:
   - Users can also log in with Google, Facebook, etc.
   - If the social account email matches their existing account email, their account will be automatically linked

### For the System Administrator

The email `csediualumni.official@gmail.com` is now the designated system administrator:
- When this email logs in via Auth0, it automatically receives the Admin role
- This replaces the old BOT_EMAIL/BOT_PASSWORD system
- No manual role assignment needed

## For New Deployments

### Prerequisites

1. **Auth0 Account**: Create an account at [auth0.com](https://auth0.com)
2. **Auth0 Application**: Set up a Regular Web Application in Auth0 Dashboard
3. **Environment Variables**: Configure Auth0 credentials in `.env`

### Setup Steps

1. **Create Auth0 Application**:
   ```
   - Go to Auth0 Dashboard → Applications → Create Application
   - Choose "Regular Web Application"
   - Note the Domain, Client ID, and Client Secret
   ```

2. **Create Auth0 API**:
   ```
   - Go to Auth0 Dashboard → Applications → APIs → Create API
   - Set a name and identifier (e.g., https://api.csediualumni.com)
   - Use this identifier as AUTH0_AUDIENCE
   ```

3. **Configure Environment Variables**:
   ```env
   AUTH0_DOMAIN=your-domain.auth0.com
   AUTH0_CLIENT_ID=your-client-id
   AUTH0_CLIENT_SECRET=your-client-secret
   AUTH0_AUDIENCE=your-api-identifier
   ```

4. **Set Allowed URLs in Auth0**:
   - **Allowed Callback URLs**: `https://your-domain.com/auth/auth0/callback`
   - **Allowed Logout URLs**: `https://your-frontend-domain.com`
   - **Allowed Web Origins**: `https://your-frontend-domain.com`

## For Developers

### Database Schema Changes

The User schema has been updated:
```typescript
// Password is now optional (not required for Auth0 users)
password?: string;  // Was: password: string (required)

// New field to link Auth0 identity
auth0Id?: string;   // Auth0 user identifier
```

### API Endpoints Changed

**Removed Endpoints**:
- `POST /auth/register` - Registration now handled by Auth0
- `POST /auth/login` - Login now handled by Auth0
- `POST /auth/token` - Token generation now via Auth0
- `PATCH /auth/verify-email` - Email verification handled by Auth0
- `POST /auth/forgot-password` - Password reset handled by Auth0
- `PATCH /auth/reset-password` - Password reset handled by Auth0
- `PATCH /auth/change-password` - Password changes handled by Auth0
- `POST /auth/resend-verification-email` - Handled by Auth0

**New Endpoints**:
- `GET /auth/auth0/login` - Initiates Auth0 login flow
- `GET /auth/auth0/callback` - Handles Auth0 callback

**Unchanged Endpoints**:
- `GET /auth/me` - Get current user (works with Auth0)
- `POST /auth/logout` - Logout (clears cookie)

### Authentication Flow

1. **Frontend** redirects to `/auth/auth0/login`
2. **Backend** redirects to Auth0 Universal Login
3. **User** authenticates on Auth0
4. **Auth0** redirects to `/auth/auth0/callback`
5. **Backend**:
   - Validates Auth0 token
   - Creates/updates user in database
   - Generates local JWT token
   - Sets cookie
   - Redirects to frontend
6. **Frontend** receives callback with success

### Token Validation

The auth guard now supports two token types:

1. **Local JWT** (from cookies):
   - Used for web applications
   - Validated against JWT_SECRET

2. **Auth0 JWT** (from Authorization header):
   - Used for API clients
   - Validated against Auth0 JWKS endpoint

## Testing

### Manual Testing

1. **Test Auth0 Login**:
   ```bash
   # In browser, visit:
   http://localhost:3000/auth/auth0/login
   
   # Complete login on Auth0
   # Should redirect back with cookie set
   ```

2. **Test API Access**:
   ```bash
   # Get token from cookie or Auth0
   curl -H "Authorization: Bearer <token>" \
        http://localhost:3000/auth/me
   ```

### Verify Migration

To verify existing users are properly migrated:

1. Have an existing user log in via Auth0
2. Check database - `auth0Id` field should be populated
3. Verify all user data is intact (name, roles, etc.)
4. Test profile updates still work

## Troubleshooting

### Issue: "User not found" after Auth0 login
**Solution**: Ensure the email used in Auth0 matches the email in the database

### Issue: Lost admin privileges
**Solution**: Ensure the admin user logs in with `csediualumni.official@gmail.com` via Auth0

### Issue: Cannot access protected routes
**Solution**: 
- Check Auth0 token is being sent in Authorization header
- Verify AUTH0_DOMAIN and AUTH0_AUDIENCE are correctly configured
- Ensure Auth0 API is properly set up

### Issue: Callback redirect fails
**Solution**: 
- Verify Allowed Callback URLs in Auth0 Dashboard
- Check SERVER_URL and FRONTEND_URL environment variables

## Security Considerations

### What's More Secure Now

1. **No Password Storage**: Passwords are not stored in our database anymore
2. **Industry-Standard Auth**: Auth0 follows OWASP security best practices
3. **MFA Support**: Multi-factor authentication can be enabled
4. **Social Login**: Reduces password reuse across sites
5. **Breach Protection**: Auth0's breach detection and password policies

### What to Monitor

1. **Auth0 Logs**: Review Auth0 dashboard for suspicious login attempts
2. **Failed Logins**: Monitor Auth0 anomaly detection
3. **Token Expiration**: Local JWT tokens expire after 7 days
4. **API Access**: Monitor API usage patterns

## Rollback Plan

If you need to rollback to local authentication (not recommended):

1. Revert to the commit before Auth0 integration
2. Ensure all users have passwords in the database
3. Users who only used Auth0 will need to reset passwords

**Note**: It's better to fix Auth0 issues than to rollback, as Auth0 provides better security.

## Support

For issues or questions:
- Check [Auth0 Authentication Guide](./auth0-authentication-guide.md)
- Review Auth0 Dashboard logs
- Open an issue in the repository
- Contact the development team

## Summary

✅ **Benefits**:
- Enhanced security
- Better user experience
- Social login support
- Professional authentication flow
- Reduced maintenance burden

✅ **What's Preserved**:
- All user data and profiles
- User roles and permissions
- Profile update functionality

✅ **What Users Need to Do**:
- Log in via Auth0 on first visit
- May need to reset password if forgotten
- Can use social login as alternative

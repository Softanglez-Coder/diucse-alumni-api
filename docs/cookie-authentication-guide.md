# Cookie-Based Authentication Implementation Guide

## Overview

This application implements cookie-based authentication that works across different environments and supports API testing tools like Postman.

## Architecture

### Production Setup
- **API**: `https://api.csediualumni.com`
- **Main App**: `https://csediualumni.com`
- **Admin App**: `https://admin.csediualumni.com`
- **Cookie Domain**: `.csediualumni.com` (shares across subdomains)

### Development Setup
- **API**: `http://localhost:3000`
- **Main App**: `http://localhost:4200`
- **Admin App**: `http://localhost:4300`
- **Cookie Domain**: None (works with exact localhost:port)

## Cookie Configuration

### Production Cookies
```typescript
{
  httpOnly: true,        // Prevents XSS attacks
  secure: true,          // HTTPS only
  sameSite: 'lax',      // CSRF protection
  maxAge: 7 days,       // 7 days expiry
  path: '/',            // Available site-wide
  domain: '.csediualumni.com'  // Shared across subdomains
}
```

### Development Cookies
```typescript
{
  httpOnly: true,        // Prevents XSS attacks
  secure: false,         // HTTP allowed
  sameSite: 'lax',      // CSRF protection
  maxAge: 7 days,       // 7 days expiry
  path: '/',            // Available site-wide
  // No domain - works with localhost:port
}
```

## Authentication Methods

The application supports two authentication methods:

### 1. Cookie-Based (Web Applications)
- Automatically set on login/register
- Sent automatically with requests
- Used by Angular applications

### 2. Bearer Token (API Testing)
- Manual token handling
- Authorization header: `Bearer <token>`
- Used by Postman, curl, etc.

## API Endpoints

### Authentication Endpoints

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  // other registration fields
}
```
- Sets `auth_token` cookie
- Returns success message

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```
- Sets `auth_token` cookie
- Returns success message

#### Get Token (For API Testing)
```
POST /auth/token
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```
- Returns raw JWT token
- Use for Postman Authorization header

#### Logout
```
POST /auth/logout
```
- Clears `auth_token` cookie
- Returns success message

#### Get Current User
```
GET /auth/me
```
- Requires authentication
- Returns current user data

## Frontend Integration

### Angular HTTP Interceptor
```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Clone request to include credentials
    const authReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json'
      },
      withCredentials: true  // Important: sends cookies
    });
    
    return next.handle(authReq);
  }
}
```

### Angular Service
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {
  private apiUrl = environment.apiUrl; // http://localhost:3000 or https://api.csediualumni.com

  constructor(private http: HttpClient) {}

  login(credentials: any) {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials, {
      withCredentials: true  // Important: includes cookies
    });
  }

  logout() {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, {
      withCredentials: true
    });
  }

  getCurrentUser() {
    return this.http.get(`${this.apiUrl}/auth/me`, {
      withCredentials: true
    });
  }
}
```

## Postman Testing

### Setup
1. **Use the token endpoint** to get a JWT token:
   ```
   POST http://localhost:3000/auth/token
   Content-Type: application/json
   
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

2. **Copy the returned token** from the response

3. **Set Authorization header** for subsequent requests:
   ```
   Authorization: Bearer <your-jwt-token-here>
   ```

### Alternative: Cookie-based testing
1. **Login first**:
   ```
   POST http://localhost:3000/auth/login
   Content-Type: application/json
   
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

2. **Enable cookie jar** in Postman settings
3. **Subsequent requests** will automatically include the cookie

## Security Features

### Protection Against Common Attacks

1. **XSS Protection**: `httpOnly` cookies can't be accessed by JavaScript
2. **CSRF Protection**: `sameSite: 'lax'` prevents cross-site request forgery
3. **Man-in-the-Middle**: `secure: true` in production ensures HTTPS only
4. **Token Expiry**: 7-day expiration limits exposure window

### CORS Configuration
- Allows specific origins only
- Enables credentials for cookie sharing
- Restricts methods and headers

## Environment Variables

Make sure to set these environment variables:

```env
# Development
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
PORT=3000

# Production
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-for-production
PORT=3000
```

## Troubleshooting

### Cookies Not Being Set
1. Check CORS configuration
2. Ensure `withCredentials: true` in frontend
3. Verify domain settings
4. Check browser dev tools > Application > Cookies

### Authentication Failing
1. Verify JWT secret is consistent
2. Check token expiration
3. Ensure proper Authorization header format
4. Validate cookie domain/path settings

### Cross-Origin Issues
1. Verify CORS origins list
2. Check `sameSite` setting
3. Ensure `credentials: true` in CORS config
4. Validate frontend `withCredentials` setting

## Production Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure proper JWT secret
- [ ] Verify CORS origins
- [ ] Test cookie sharing across subdomains
- [ ] Validate HTTPS enforcement
- [ ] Test both web app and API authentication

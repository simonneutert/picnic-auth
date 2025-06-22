---
title: "Bearer Auth"
parent: "REST Endpoints"
nav_order: 2
---

# Bearer Auth

Authenticate a user with a bearer token in the header.

## Request

Requires a `bearer` token in the header to successfully authenticate a user.

**Security Features:**
- Secure JWT decryption with proper error handling
- PBKDF2-derived encryption keys
- No rate limiting (validation only)

| URL            | Method | Description                                |
| -------------- | ------ | ------------------------------------------ |
| `/auth/bearer` | `POST` | Returns the user object, if authenticated. |

### Response (Success)

```json
{
  "exp": 1730707888,
  "iat": 1730707768,
  "username": "picnic"
}
```

## Example

[httpie](https://httpie.io) example:

```http
$ http POST ":8000/auth/bearer" Authorization:"Bearer YOUR_JWT_TOKEN"
```

### Error Response (401)

If token is invalid or expired:

```json
"Unauthorized"
```

Response includes standard security headers (HSTS, CSP, X-Frame-Options, etc.)

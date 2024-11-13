---
title: "Bearer Auth"
parent: "REST Endpoints"
nav_order: 2
---

# Bearer Auth

Authenticate a user with a bearer token in the header.

## Request

Requires a `bearer` token in the header to successfully authenticate a user.

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
$ http -A "Bearer" -a "YOUR TOKEN" POST ":8080/auth/bearer"
```

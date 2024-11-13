---
title: "User Auth"
parent: "REST Endpoints"
nav_order: 1
---

# User Auth

Initiate the authentication process for a user.

On the server, the current global `bearer` token is replaced with a new one.\
The valid time window (duration) is set to 8 hours by default.

## Request

Accepts a `username` and `password` parameter to authenticate a user.

| URL     | Method | Description                                         |
| ------- | ------ | --------------------------------------------------- |
| `/auth` | `POST` | Authenticates the user, and returns a bearer token. |

### Parameters

| Name       | Type     | Description                                |
| ---------- | -------- | ------------------------------------------ |
| `username` | `string` | The username/email specifying a user.      |
| `password` | `string` | The bcrypt encrypted password of the user. |

### Response (Success)

```json
"eyJhbGciOiJkalbmMiOiJBMTI4Q0JDLUhTMjU2In0..QUCdwTA-AkmzQ9wvbo3SUw.aO6wF-abc_a-X0Ovb1I5XqFd2YtoRk61ZEzXcwZSW1R_UVF12IgYMg"
```

## Example

[httpie](https://httpie.io) example:

```http
$ http POST ":8080/auth" username=picnic password=mypicnic
```

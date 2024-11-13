---
title: "REST Endpoints"
nav_order: 4
---

# REST Endpoints

The following endpoints are available for use with Picnic Auth.

<!-- TOC -->

## Process

The process for authenticating a user is as follows:

1. Authenticate a user with a `username` and `password` parameter.
2. Use the received bearer token to authenticate the user in subsequent
   requests.

## Endpoints

### User Auth `POST /auth`

Initiate the authentication process for a user, by issuing a `POST` request to
the `/auth` endpoint, with the `username` and `password` parameters. The
`username` parameter can be either the username or email of the user, and the
`password` parameter.

The password on the server side is expected to be encrypted with bcrypt.

It is then expected that the server will return a `200` status code, with a JSON
object containing a rich bearer token object, which can be used to authenticate
the user in subsequent requests.

### Bearer Auth `POST /auth/bearer`

Authenticate a user with a bearer token in the header, by issuing a `POST`
request to the `/auth/bearer` endpoint, with the `bearer` token in the header.

The server is expected to return a `200` status code, with a JSON object
containing the token payload, if the token is valid and did not expire.

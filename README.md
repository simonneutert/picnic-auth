# Picnic Auth<!-- omit from toc -->

A single user authentication service that is simple and fun - like a picnic.

<img src="/docs/img/picnic_auth_weblogo.webp" height="auto" width="320px" alt="Picnic Auth Logo - a lock with a smiley face locking a picnic basket">

> Auth made easy. Inspired by [Moron CMS](https://github.com/rabocalypse/moroncms). 

#### The Stupidly Simple Authentication Server<!-- omit from toc -->

This project is a [Deno 🦕](https://deno.com) server that handles authentication using bearer tokens. It includes routes for user authentication, JWT (Bearer) validation functionality.

Do not take this project too seriously. It is a simple project to demonstrate how to use JWTs for authentication in Deno.

---

Read the [Official Documentation](https://www.simon-neutert.de/picnic-auth/).

---

## Table of Contents<!-- omit from toc -->

- [Installation](#installation)
- [Usage](#usage)
- [Routes](#routes)
  - [POST `/auth`](#post-auth)
  - [POST `/auth/bearer`](#post-authbearer)
- [Environment Variables](#environment-variables)
  - [JWT Expiration Time Settings](#jwt-expiration-time-settings)
    - [Examples of valid expiration times:](#examples-of-valid-expiration-times)
- [Ideas / Todos / Not sure yet](#ideas--todos--not-sure-yet)
- [Deno Dependencies](#deno-dependencies)
  - [Main Dependencies](#main-dependencies)
  - [Documentation Generation](#documentation-generation)
- [License](#license)

## Installation

1. Clone the repository.

   ```sh
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. Install Deno if you haven't already.

3. Run the server.

   ```sh
   deno run --allow-net --allow-read --allow-env server.ts
   ```

## Usage

The server exposes three main routes for authentication:

- `/auth` - Handles user authentication.
- `/auth/bearer` - Validates bearer tokens.

## Routes

CORS is set to "*" for all routes. This means that the server will accept requests from any origin. This may not be what you want for production use.

### POST `/auth`

Authenticates the user and returns a bearer token.

- **Request Body**: JSON object containing `username` and `password`.
- **Response**: JSON object containing the bearer token.

### POST `/auth/bearer`

Validates the provided bearer token.

- **Headers**: `Authentication` header with the bearer token.
- **Response**: JSON object containing user information if the token is valid.

## Environment Variables

The server uses environment variables for configuration. You can set these
variables in a `.env` file or directly in your environment.

- `PICNIC_USERNAME` - The username for authentication.\
  (Default: "picnic")
- `PICNIC_PASSWORD_BCRYPT` - The hashed password for authentication.\
  (Default: "mypicnic")
- `PICNIC_JWT_SECRET` - The secret key for signing JWT tokens.
- `PICNIC_JWT_EXPIRATION_TIME` - The duration for which the bearer token is valid.\
  (Default: "60m")
- `PICNIC_PORT` - The port on which the server will run. (Default: 8000)
- `CORS_ORIGIN` - The origin that is allowed to access the server.\
  (Default: "*")

### JWT Expiration Time Settings

The `PICNIC_JWT_EXPIRATION_TIME` environment variable should be a string that is an Integer followed by a time unit.

<details>

<summary>Expand for more details</summary>

The time unit can be one of the following:

- "sec"
- "secs"
- "second"
- "seconds"
- "s"
- "minute"
- "minutes"
- "min"
- "mins"
- "m"
- "hour"
- "hours"
- "hr"
- "hrs"
- "h"
- "day"
- "days"
- "d"
- "week"
- "weeks"
- "w"
- "year"
- "years"
- "yr"
- "yrs"
- "y"

#### Examples of valid expiration times:

- `1m` - 1 minute
- `1h` - 1 hour
- `1d` - 1 day
- `1w` - 1 week
- `2w` - 1 weeks
- `2weeks` - 2 weeks

</details>

## Ideas / Todos / Not sure yet

- [ ] add a refresh token flow?

## Deno Dependencies

Minimal dependencies are used in this project.

### Main Dependencies

- https://github.com/panva/jose
- https://deno.land/x/bcrypt@v0.4.1

### Documentation Generation

- https://github.com/lumeland

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file
for details.

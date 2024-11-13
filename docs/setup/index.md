---
title: "Setup"
nav_order: 3
---

# Setup

<!-- TOC -->

## Environment Variables

The server uses environment variables for configuration. You can set these
variables in a `.env` file or directly in your environment.

Inspect `.env.example` for the available variables and their default values.

- `PICNIC_USERNAME` - The username for authentication.\
  (Default: "picnic")
- `PICNIC_PASSWORD_BCRYPT` - The hashed password for authentication.\
  (Default: "mypicnic")
- `PICNIC_JWT_SECRET` - The secret key for signing JWT tokens.
- `PICNIC_JWT_EXPIRATION_TIME` - The duration for which the bearer token is
  valid.\
  (Default: "60m")
- `PICNIC_PORT` - The port on which the server will run. (Default: 8000)

> **Note:** The `PICNIC_USERNAME` and `PICNIC_PASSWORD_BCRYPT` are set to
> default values for development purposes.

### Username

The `PICNIC_USERNAME` is a string that represents the username (`username`) for
authentication.

### Password

The `PICNIC_PASSWORD_BCRYPT` is a string that represents the hashed `password`
for authentication.

#### Bcrypt Password Hash

Please create your bcrypt password hash (do not use online services for this
🙏).

There's a _deno task_ to help you with this:

```bash
# single quotes around the password are important 🤓
$ deno task bcrypt 'your-secure-password'
```

**using Docker**

```bash
$ docker build -t picnic-auth .
$ docker run --rm -ti picnic-auth task bcrypt 'your-secure-password'
```

### JWT Secret

#### Generate a JWT Secret

UNIX (macOS, Linux) can generate a random 64-character hex string with the
following command:

`$ echo $(openssl rand -hex 64)`

### JWT Expiration Time

The `PICNIC_JWT_EXPIRATION_TIME` is a string that represents the duration for
which the bearer token is valid.

<div class="grid">
  <div>

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

  </div>
  <div>

#### Examples of valid expiration times:

- `1m` - 1 minute
- `1h` - 1 hour
- `1d` - 1 day
- `1w` - 1 week
- `2w` - 1 weeks
- `2weeks` - 2 weeks

  </div>

</div>

### Port

The `PICNIC_PORT` is a number that represents the port on which the server will
run.

## Rocket Start with Docker

You can use Docker to run Picnic Auth with a random JWT secret to get started
quickly.

```bash
$ docker run --rm -it -e PICNIC_JWT_SECRET="$(openssl rand -hex 64)" ...
```

## Quick Start with Deno (natively)

Please set PICNIC_JWT_SECRET in your environment variables.

Deno (run):

```bash
$ PICNIC_JWT_SECRET="$(openssl rand -hex 64)" deno run --allow-env --allow-net server.ts
```

Deno (serve):

Becase `deno serve` does spawn multiple instances, you need to set the
PICNIC_JWT_SECRET in your environment variables, using `export`.

```bash
$ export PICNIC_JWT_SECRET="$(openssl rand -hex 64)"; deno serve --allow-env --allow-net --parallel server.ts
```

### Read the deno docs

Deno run and Deno serve have more options you can use, i.e. change the port you
want to run the server on.

- [deno run docs](https://docs.deno.com/runtime/reference/cli/run/)
- [deno serve docs](https://docs.deno.com/runtime/reference/cli/serve/)

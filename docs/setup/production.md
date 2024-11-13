---
title: "Production Setup"
parent: "Setup"
nav_order: 2
---

# Production Setup

Setup your Picnic Auth instance.

<!-- TOC -->

## Initial Setup

Start by cloning the repository:

```bash
# ssh
$ git clone git@github.com:simonneutert/picnic-auth.git
# https
https://github.com/simonneutert/picnic-auth.git
```

Setup the environment variables:

```bash
$ cp .env.example .env
```

Please, create your bcrypt password hash (do not use online services for this
🙏).\
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

Finally, run the server:

```bash
$ deno run --allow-net --allow-env server.ts
```

OR

You can use `deno serve` to run the server in production mode and on all cores
(but ... let's be honest, you won't need that):

```bash
$ deno serve --allow-env --allow-net --parallel server.ts
```

More about [deno run/serve](http://localhost:3000/setup/#read-the-deno-docs).

## Hosting

You can host your Picnic Auth instance on any cloud provider that supports
Deno.\

Best you use [Deno Deploy](https://deno.com/deploy), as it's the easiest way to
get started.

[Setup Environment Variables on Deno Deploy](https://docs.deno.com/deploy/manual/environment-variables/).

## Docker

When running the container, you can use the following command:

```bash
$ docker build -t picnic-auth .
$ docker run --env-file .env --rm -ti -p8000:8000 picnic-auth
```

### Docker Compose

When using Docker Compose, you can use the following `docker-compose.yml` file:

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    env_file:
      - .env
```

#### IMPORTANT note on passing the `.env` file

In order to not run into issues with the bcrypted password hash and the JWT
secret,\
it is recommended to use the `env-file` attribute and pass the `.env` file.

Else you might run into issues with the password hash and the JWT secret.\
The server will still start running, but you won't be able to login. 😵‍💫\
A debugging nightmare.

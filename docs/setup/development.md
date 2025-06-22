---
title: "Development Setup"
parent: "Setup"
nav_order: 1
---

# Development Setup

Setup your Picnic Auth dev instance.

<!-- TOC -->

## Initial Setup

Start by cloning the repository:

```bash
# ssh
$ git clone git@github.com:simonneutert/picnic-auth.git
# https
https://github.com/simonneutert/picnic-auth.git
```

---

## Running the Server

**Optional** If you manage your `.env` file, then copy the `.env.example` file
to `.env`:

```bash
$ cp .env.example .env
```

And replace the values with your own. There are helping comments in the
`.env.example`/`.env` file.

---

Finally, run the server:

When the `.env` file is present:

```bash
$ deno run -A server.ts
```

Else, generate a random JWT secret on the fly:

```bash
$ PICNIC_JWT_SECRET="$(openssl rand -hex 64)" deno run -A server.ts
```

More about [deno run/serve](http://localhost:3000/setup/#read-the-deno-docs).

## Testing

Test with [httpie](https://httpie.io):

```bash
# httpie example for default project settings:
$ http POST ":8000/auth" username=picnic password=mypicnic
```

Copy the token value from the response (replace JWT-TOKEN with it) and test
against the protected route:

```bash
$ http -A Bearer -a 'JWT-TOKEN' POST ":8000/auth/bearer"
```

Voilà! You have a working Picnic Auth instance.

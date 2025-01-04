---
title: "Usage"
nav_order: 2
---

# Usage

The following examples are provided to help you get started with Picnic Auth.

## Schematic Overview

The process for authenticating a user is as follows:

1. Authenticate a user with a `username` and `password` parameter.
2. Use the received bearer token to authenticate the user in subsequent
   requests.

Store the bearer token in a (secure) location, and use it in subsequent requests
to authenticate the user.

This can be done using:

- a cookie
- local storage
- an abstraction of one of the above
  - your own solution
  - a solution of someone (a lib, of someone who knows what they're doing 😏)

Encapsulate your actions that should be authenticated.\
These actions should be successfully auth against `/auth/bearer`.

You can then decide how to handle `success` and `failure` of the auth process.

## Diagram

This is a simple sequence diagram of the process, when login is successful:

<pre>
  <code class="language-mermaid">
sequenceDiagram
    Frontend Client ->> Server-Part/Backend: Let me browser your resources.
    Server-Part/Backend -->> Frontend Client: Sure! Here you go. Some stuff requires authentication.

    Frontend Client ->> Server-Part/Backend: I want to edit a resource.
    Server-Part/Backend -->> Frontend Client: You need to authenticate first, please auth with `picnic-auth`.

    Frontend Client ->> Server-Part/Backend: POST `username` and `password`.
    Server-Part/Backend ->> Picnic Auth: POST to `/auth` with `username` and `password`.
    Picnic Auth ->> Server-Part/Backend: Your user is authed! This JWT (it expires in 1 hour).
    Server-Part/Backend ->> Frontend Client: You're authed! Take this JWT (it expires in 1 hour).

    Frontend Client ->> Server-Part/Backend: I want to edit a resource. I have a JWT in my header for you.
    Server-Part/Backend -->> Picnic Auth: Extract JWT from header and validate against /auth/bearer.
    Picnic Auth -->> Server-Part/Backend: This JWT is valid. Here's the user object for you to double check.
    Server-Part/Backend -->> Frontend Client: You're good to go. Here's the resource you wanted to edit.
  </code>
</pre>

## Example when storing the JWT in Session Storage

As mentioned above, you should store the JWT in a secure location. Here's a
possible way to do this using `sessionStorage`.

### Understanding Session Storage in JavaScript

Session Storage is part of the Web Storage API, enabling web applications to
store data in the browser. Unlike `localStorage`, which persists until
explicitly cleared, `sessionStorage` stores data only for the duration of a page
session. This means data is cleared as soon as the browser or tab is closed,
making it useful for storing temporary data related to a single browsing
session.

#### Key Features

- **Temporary**: Data is stored only for the current session and is cleared when
  the tab or browser is closed.
- **Scope-specific**: Data is accessible only in the tab where it was created,
  making it safer for handling sensitive information within a session.
- **Simple key-value storage**: Like `localStorage`, `sessionStorage` works with
  string key-value pairs.

#### Common Use Cases

- **Session-specific settings**: Save settings or preferences that only need to
  be available during a single session.
- **Form data**: Temporarily store form data for the session, in case the user
  navigates away and returns before submitting.
- **UI states**: Store temporary UI states like menu visibility or filter
  options, which reset after closing the tab.

#### Using Session Storage in JavaScript

1. **Setting data**: Use `sessionStorage.setItem(key, value)` to store data.
2. **Getting data**: Retrieve data with `sessionStorage.getItem(key)`.
3. **Removing data**: Use `sessionStorage.removeItem(key)` to remove a specific
   item.
4. **Clearing all data**: Clear all stored items with `sessionStorage.clear()`.

#### Example Code

```javascript
// Store data in session storage
sessionStorage.setItem("username", "JohnDoe");
sessionStorage.setItem("theme", "dark");

// Retrieve data from session storage
let username = sessionStorage.getItem("username");
let theme = sessionStorage.getItem("theme");

console.log(username); // Output: JohnDoe
console.log(theme); // Output: dark

// Remove a specific item
sessionStorage.removeItem("username");

// Clear all data in session storage
sessionStorage.clear();
```

#### Conclusion

Session Storage is a powerful tool for managing temporary, session-specific
data. It's easy to implement, lightweight, and provides a simple way to enhance
the user experience in single-session scenarios.

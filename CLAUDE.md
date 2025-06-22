# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Picnic Auth is a single-user JWT authentication service built with Deno. While maintaining simplicity, it implements production-ready security features including rate limiting, input validation, timing attack protection, and proper cryptographic key derivation. It provides two main endpoints: `/auth` for username/password authentication and `/auth/bearer` for JWT token validation.

## Development Commands

### Running the Server
- Development with watch mode: `just dev` or `deno run --allow-env --allow-net --allow-read --allow-write --watch server.ts`
- Production serve: `just serve` or `deno serve --allow-env --allow-net --parallel server.ts`

### Code Quality
- Lint: `just lint` or `deno lint --ignore=docs/_site`
- Format: `just format` or `deno fmt --ignore=docs/_site --ignore=*.md`

### Testing
- Run tests: `deno test`

### Utilities
- Generate bcrypt password: `deno task bcrypt` or `deno run encrypt-password.ts`
- Serve documentation: `just serve-docs` or `cd docs && deno task serve`

## Architecture

### Core Components
- `server.ts` - Main entry point with URL routing, request handling, and rate limiting integration
- `lib/route-auth.ts` - Handles `/auth` endpoint with input validation, timing attack protection, and authentication
- `lib/route-bearer-auth.ts` - Handles `/auth/bearer` endpoint for secure JWT validation
- `lib/picnic-jwt.ts` - JWT creation and encryption utilities using JWE
- `lib/init-from-env.ts` - Environment variable initialization, validation, and CORS configuration
- `lib/rate-limiter.ts` - In-memory sliding window rate limiter with automatic cleanup
- `lib/security-headers.ts` - Security headers (HSTS, CSP, X-Frame-Options, etc.)
- `lib/string-to-32byte-array.ts` - PBKDF2-based key derivation from JWT secret

### Key Libraries
- `jose` - JWT encryption/decryption (uses JWE, not plain JWS)
- `bcrypt` - Password hashing and verification

### Authentication Flow
1. POST to `/auth` with username/password (validates input, checks rate limits) → returns encrypted JWT
2. Use JWT in Authorization header as "Bearer {token}"
3. POST to `/auth/bearer` to validate token → returns user payload

### Security Architecture
- **Rate Limiting**: 5 attempts per 15 minutes per IP using sliding window algorithm
- **Input Validation**: Content-Type validation, request size limits (1KB), SQL injection protection
- **Timing Attack Protection**: Constant-time string comparison prevents username enumeration
- **Key Derivation**: PBKDF2 with 100,000 iterations and SHA-256 for JWT encryption keys
- **Request Protection**: 5-second timeouts, proper error handling without information disclosure

### Configuration
Environment variables (see README.md for full list):
- `PICNIC_USERNAME` - Authentication username (default: "picnic")
- `PICNIC_PASSWORD_BCRYPT` - Bcrypt hash of password (default hash for "mypicnic")
- `PICNIC_JWT_SECRET` - JWT encryption secret (must be ≥32 chars, undergoes PBKDF2 key derivation)
- `PICNIC_JWT_EXPIRATION_TIME` - Token validity period (default: "60m")
- `PICNIC_PORT` - Server port (default: 8000)
- `CORS_ORIGIN` - CORS origin setting (default: "*")

### Security Implementation Notes
- **JWT Encryption**: Uses JWE (encrypted) not JWS (signed) tokens for enhanced security
- **Password Security**: bcrypt hashing with constant-time comparison to prevent timing attacks
- **Rate Limiting**: In-memory sliding window implementation with automatic cleanup
- **Key Security**: PBKDF2 key derivation ensures cryptographically secure encryption keys
- **Headers**: All responses include comprehensive security headers (HSTS, CSP, X-Frame-Options, etc.)
- **Input Security**: Multi-layer validation including Content-Type, size limits, and pattern matching
- **CORS**: Configurable via CORS_ORIGIN environment variable (defaults to "*" with warning)

### Testing Security Features
- Rate limiting: Make 6+ rapid requests to `/auth` to trigger 429 responses
- Input validation: Send requests with wrong Content-Type or oversized payloads
- Timing attacks: Authentication always takes consistent time regardless of username validity
- Security headers: All responses include standard security headers
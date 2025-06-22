# Security Fixes Implementation Plan

This document outlines security vulnerabilities found in Picnic Auth and their fixes, organized by implementation difficulty.

## 🍎 Low-Hanging Fruit (Easy Wins)

### 1. Remove Information Disclosure Logging
**Risk**: Medium | **Effort**: Very Low | **Files**: `lib/init-from-env.ts`

**Issue**: Sensitive information logged to console
- Line 50: JWT expiration time logged
- Line 69: JWT secret generation status logged

**Implementation Steps**:
1. Remove `console.log` in `_loadJWTExpirationTimeEnv()` at line 50
2. Remove `console.log` in `_loadJWTSecretEnv()` at line 69
3. Keep error logging for invalid expiration times (security-relevant)

### 2. Implement Proper CORS Configuration
**Risk**: High | **Effort**: Low | **Files**: `lib/cors-header.ts`, `lib/init-from-env.ts`

**Issue**: CORS set to "*" despite CORS_ORIGIN env var mentioned in README

**Implementation Steps**:
1. Add CORS_ORIGIN to `initFromEnv()` function
2. Update `cors-header.ts` to use environment variable
3. Default to "*" for backward compatibility but log warning
4. Update CLAUDE.md with CORS security note

### 3. Add Request Size Limits
**Risk**: Medium | **Effort**: Low | **Files**: `lib/route-auth.ts`

**Issue**: No protection against large JSON payloads

**Implementation Steps**:
1. Add content-length header check in `routeAuth()`
2. Reject requests > 1KB (reasonable for username/password)
3. Add proper error response for oversized requests
4. Test with large payload

### 4. Reduce Error Information Leakage
**Risk**: Low | **Effort**: Very Low | **Files**: `lib/route-bearer-auth.ts`

**Issue**: JWT errors and protected headers logged to console

**Implementation Steps**:
1. Remove `console.error(protectedHeader)` at line 25
2. Keep generic error logging for debugging
3. Ensure consistent 401 responses

## 🛠️ Easy Fixes

### 5. Add Input Validation
**Risk**: Medium | **Effort**: Low | **Files**: `lib/route-auth.ts`

**Issue**: No validation of request format or content-type

**Implementation Steps**:
1. Add Content-Type: application/json validation
2. Add username/password presence validation
3. Add basic format validation (length limits, character restrictions)
4. Return 400 Bad Request for invalid input format
5. Add validation helper function

### 6. Add Security Headers
**Risk**: Medium | **Effort**: Easy | **Files**: `lib/cors-header.ts` or new `lib/security-headers.ts`

**Issue**: Missing security headers

**Implementation Steps**:
1. Create security headers utility
2. Add X-Content-Type-Options: nosniff
3. Add X-Frame-Options: DENY
4. Add X-XSS-Protection: 1; mode=block
5. Add Strict-Transport-Security for HTTPS
6. Apply to all responses

## 🔧 Medium Complexity

### 7. Fix Timing Attack Vulnerability
**Risk**: High | **Effort**: Medium | **Files**: `lib/route-auth.ts`

**Issue**: Username check timing reveals valid usernames

**Implementation Steps**:
1. Always perform bcrypt comparison regardless of username validity
2. Use constant-time comparison for username
3. Restructure authentication flow:
   - Get username/password from request
   - Always hash provided password against stored hash
   - Compare username in constant time
   - Return result based on both checks
4. Add timing attack test case

### 8. Implement Rate Limiting
**Risk**: High | **Effort**: Medium | **Files**: New `lib/rate-limiter.ts`, `server.ts`

**Issue**: No protection against brute force attacks

**Implementation Steps**:
1. Create in-memory rate limiter (Map-based)
2. Track attempts by IP address
3. Implement sliding window (5 attempts per 15 minutes)
4. Add rate limit headers to responses
5. Return 429 Too Many Requests when exceeded
6. Add cleanup for old entries
7. Integrate into auth route

## 🔨 Hard Fixes

### 9. Fix Weak Key Derivation
**Risk**: Critical | **Effort**: High | **Files**: `lib/string-to-32byte-array.ts`, `server.ts`

**Issue**: Weak key generation from JWT secret

**Implementation Steps**:
1. Research Deno crypto APIs for PBKDF2
2. Implement proper key derivation:
   - Use PBKDF2 with SHA-256
   - Use random salt (store in env or generate)
   - Use appropriate iteration count (100,000+)
3. Update `stringTo32ByteArray()` function
4. Add salt generation and storage mechanism
5. Ensure backward compatibility consideration
6. Add key derivation tests
7. Update documentation

### 10. Implement Proper Secret Management
**Risk**: High | **Effort**: High | **Files**: `lib/init-from-env.ts`, new `lib/secret-manager.ts`

**Issue**: JWT secret handling improvements

**Implementation Steps**:
1. Add secret validation (entropy check)
2. Implement secure secret generation
3. Add secret rotation capability
4. Consider external secret management integration
5. Add secret validation tests

## 🧪 Testing Requirements

For each fix, implement:
- Unit tests for new functionality
- Security-specific test cases
- Integration tests for authentication flow
- Performance impact assessment
- Backward compatibility verification

## 🚀 Implementation Priority

1. **Phase 1** (Immediate): Items 1-4 (Low-hanging fruit)
2. **Phase 2** (Week 1): Items 5-6 (Easy fixes)  
3. **Phase 3** (Week 2): Items 7-8 (Medium complexity)
4. **Phase 4** (Week 3-4): Items 9-10 (Hard fixes)

## 📋 Checklist Template

For each security fix:
- [ ] Implementation complete
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Security impact verified
- [ ] Performance impact assessed
- [ ] Backward compatibility confirmed
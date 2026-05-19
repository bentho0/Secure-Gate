# security.md
# SecureGate Security Rules

## Security Philosophy

Security is the foundation of this product.

Every feature must be designed assuming:
- malicious intent,
- automated attacks,
- edge cases,
- token abuse,
- brute-force attempts,
- and unsafe client behavior.

Never trust the client.

---

# Core Security Principles

## Principle 1 — Validate Everything

All user input must:
- be validated server-side,
- be sanitized,
- use Zod schemas.

Client-side validation is NOT security.

---

## Principle 2 — Never Expose Sensitive Data

Never expose:
- passwords,
- tokens,
- stack traces,
- database errors,
- authentication internals,
- email existence.

---

# Password Security

## Hashing Rules

Passwords MUST:
- use bcryptjs,
- use salt rounds = 12,
- never be stored in plain text.

Required:
```ts
await bcrypt.hash(password, 12)
```

---

# Token Security

## Token Generation

Use:
```ts
crypto.randomBytes(32).toString("hex")
```

For:
- verification tokens,
- password reset tokens.

---

## Token Rules

Tokens must:
- expire,
- be single-use,
- be deleted after use,
- be securely stored,
- never be reusable.

---

# Session Security

Use NextAuth.

Sessions must:
- expire correctly,
- validate user identity,
- contain minimal data,
- reject unverified users.

Never store sensitive information in sessions.

---

# Authentication Security

## Login Rules

Never reveal:
- whether email exists,
- whether password was wrong.

Bad:
```txt
Email not found
```

Good:
```txt
Invalid credentials
```

---

# Forgot Password Security

Critical rule:

Forgot password endpoint MUST always return success.

Never confirm whether an email exists.

Correct response:
```txt
If an account exists, a reset link has been sent.
```

---

# Route Protection

Protected routes require:
- authenticated session,
- verified email.

Use middleware enforcement.

---

# Rate Limiting

Apply rate limiting to:
- login,
- forgot password.

Rules:
- 5 attempts,
- per IP,
- every 10 minutes.

Use:
- Upstash Redis,
or
- custom middleware.

---

# HTTP Security Headers

Add:
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

Recommended additional headers:
- Content-Security-Policy
- Strict-Transport-Security

---

# Database Security

Rules:
- never expose raw DB errors,
- always validate queries,
- prevent token reuse,
- use unique constraints.

---

# Environment Variable Security

Secrets must:
- live in environment variables,
- never be hardcoded,
- never be committed.

Required:
```txt
.env.local
```

Must be inside:
```txt
.gitignore
```

---

# Logging Rules

Never log:
- passwords,
- tokens,
- secrets,
- API keys.

Safe logs only.

---

# Frontend Security

Frontend must:
- avoid exposing secrets,
- avoid storing sensitive data,
- avoid unsafe local storage usage.

Sensitive auth logic belongs on the server.

---

# Middleware Security

Middleware must:
- prevent unauthorized access,
- prevent redirect loops,
- verify auth state,
- verify email verification.

---

# Email Security

Emails should:
- contain expiring links,
- avoid sensitive information,
- use HTTPS links only.

---

# Deployment Security

Before deployment:
- verify environment variables,
- verify HTTPS,
- verify production DB,
- verify token expiry,
- verify rate limiting.

Always test:
- invalid tokens,
- expired tokens,
- brute-force attempts,
- unauthorized access.

---

# Security Testing Checklist

Test:
- wrong passwords,
- invalid emails,
- duplicate accounts,
- expired tokens,
- reused tokens,
- direct dashboard access,
- brute-force attempts,
- broken sessions,
- invalid reset links.

---

# Final Security Rule

If uncertain:
choose the more secure implementation.

Security always takes priority over convenience.

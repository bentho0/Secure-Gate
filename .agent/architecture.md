# architecture.md
# SecureGate Architecture

## System Overview

SecureGate is a production-grade authentication and security platform built with Next.js 14 using the App Router architecture.

The system is designed around:
- security-first engineering,
- server-centric authentication,
- modular architecture,
- isolated business logic,
- and scalable auth infrastructure.

---

# High-Level Architecture

```txt
Client UI
   ↓
Next.js App Router
   ↓
Route Handlers / Server Actions
   ↓
Validation Layer (Zod)
   ↓
Authentication Layer (NextAuth)
   ↓
Service Layer
   ↓
Prisma ORM
   ↓
PostgreSQL
```

---

# Core Architectural Principles

## 1. Server-First Security

Sensitive logic MUST remain on the server:
- password hashing,
- token generation,
- authentication checks,
- verification logic,
- session validation,
- and database operations.

Never trust the client.

---

## 2. Separation of Concerns

Keep logic separated into clear layers:

| Layer | Responsibility |
|---|---|
| UI Layer | Rendering and interaction |
| Validation Layer | Input validation |
| Auth Layer | Session and credential handling |
| Service Layer | Business logic |
| Database Layer | Persistence |
| Middleware Layer | Route protection |
| Utility Layer | Shared reusable functions |

---

# Recommended Folder Structure

```txt
src/
├── app/
│   ├── (auth)/
│   ├── dashboard/
│   ├── api/
│   └── verify-email/
│
├── components/
│   ├── forms/
│   ├── ui/
│   └── auth/
│
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── resend.ts
│   └── ratelimit.ts
│
├── actions/
├── services/
├── schemas/
├── hooks/
├── middleware/
├── emails/
├── utils/
├── types/
└── constants/
```

---

# Authentication Architecture

## Authentication Strategy

Use NextAuth Credentials Provider.

Preferred session strategy:
- JWT sessions for simplicity and scalability.

Session must contain:
- user id,
- email,
- verification status.

---

# Auth Flow Architecture

## Registration Flow

```txt
User submits form
    ↓
Zod validation
    ↓
Check email uniqueness
    ↓
Hash password
    ↓
Create user
    ↓
Generate verification token
    ↓
Store token
    ↓
Send email
```

---

## Login Flow

```txt
User submits credentials
    ↓
Rate limit check
    ↓
Lookup user
    ↓
Compare bcrypt hash
    ↓
Reject unverified users
    ↓
Create session
```

---

## Email Verification Flow

```txt
User clicks verification link
    ↓
Find token
    ↓
Validate expiry
    ↓
Mark user verified
    ↓
Delete token
    ↓
Redirect to dashboard
```

---

## Password Reset Flow

```txt
User submits email
    ↓
Generate reset token
    ↓
Store token
    ↓
Send reset email
    ↓
Validate token
    ↓
Hash new password
    ↓
Delete token
```

---

# Middleware Architecture

Middleware responsibilities:
- route protection,
- auth redirects,
- verification enforcement,
- preventing unauthorized access.

Protected routes:
```txt
/dashboard
/settings
/account
```

Public routes:
```txt
/login
/signup
/forgot-password
/reset-password
```

---

# Database Architecture

## Core Models

### User
Stores:
- credentials,
- verification status,
- timestamps.

### VerificationToken
Stores:
- verification tokens,
- expiry,
- user linkage.

### PasswordResetToken
Stores:
- reset tokens,
- expiry,
- email linkage.

---

# API Design Principles

## Rules

- Keep route handlers thin.
- Move business logic into services.
- Validate all input using Zod.
- Never expose internal errors.
- Always sanitize responses.

---

# State Management

Preferred approach:
- server-first state,
- minimal client state,
- React hooks only when necessary.

Avoid:
- unnecessary global state,
- duplicated auth state.

---

# Email System Architecture

Emails use:
- Resend,
- React Email templates.

Templates:
- verification email,
- password reset email.

---

# Security Architecture

Security is layered.

Layers:
1. Validation
2. Authentication
3. Authorization
4. Rate limiting
5. Secure hashing
6. Token expiration
7. Middleware protection
8. HTTP security headers

---

# Deployment Architecture

Deploy using Vercel.

Environment variables:
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- RESEND_API_KEY
- UPSTASH_REDIS_REST_URL
- UPSTASH_REDIS_REST_TOKEN

Never hardcode secrets.

---

# Engineering Rules

Always:
- centralize auth logic,
- centralize token logic,
- centralize validation,
- reuse utilities,
- write composable components.

Avoid:
- giant route handlers,
- duplicated validation,
- mixed concerns,
- auth logic in UI components.

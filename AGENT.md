# AGENT.md
# SecureGate — AI Engineering Context File

## Project Identity

Project Name: SecureGate  
Project Type: Production-grade Authentication & Security System  
Primary Goal: Build a standalone, security-focused authentication infrastructure using Next.js 14 and TypeScript.

This is NOT a toy login app.

This project exists to demonstrate:
- production-level authentication architecture,
- security engineering awareness,
- backend/frontend integration,
- secure token handling,
- protected routing,
- and enterprise-grade auth flows.

The implementation must prioritize:
- security,
- reliability,
- maintainability,
- accessibility,
- and realistic production standards.

---

# Core Philosophy

Murphy’s Law governs this project.

Anything that can break WILL break.
Anything exploitable WILL be exploited.

Build defensively.

Never trust:
- client input,
- query params,
- tokens,
- sessions,
- form data,
- or browser state.

Every endpoint must assume malicious intent.

Security is more important than speed of implementation.

---

# Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Authentication | NextAuth.js / Auth.js |
| Validation | Zod |
| Password Hashing | bcryptjs |
| Email Service | Resend |
| Email Templates | React Email |
| Rate Limiting | Upstash Redis |
| Deployment | Vercel |
| Styling | Tailwind CSS |

---

# Engineering Standards

## General Rules

- Use TypeScript everywhere.
- Avoid `any` unless absolutely unavoidable.
- Prefer server actions or route handlers over client-side logic for sensitive operations.
- Keep business logic on the server.
- Never expose secrets to the client.
- Never trust frontend validation alone.
- Every sensitive action must have server-side validation.
- Use async/await consistently.
- Write clean and readable code over clever code.
- Keep components modular and composable.
- Prefer explicitness over abstraction.

---

# Security Requirements

## Password Rules

Passwords MUST:
- be hashed using bcryptjs,
- use salt rounds = 12,
- never be logged,
- never be stored in plain text,
- never be returned from APIs.

Example:
```ts
await bcrypt.hash(password, 12)
```

---

## Token Rules

Use:
```ts
crypto.randomBytes(32).toString("hex")
```

For:
- email verification tokens,
- password reset tokens.

Tokens must:
- expire,
- be single-use,
- be deleted after use,
- never be reusable.

---

## Error Handling Rules

NEVER expose:
- whether an email exists,
- internal stack traces,
- database errors,
- token details,
- authentication logic.

Use safe, generic authentication responses.

Bad:
```txt
Email does not exist
```

Good:
```txt
Invalid credentials
```

---

## Rate Limiting Rules

Protect:
- login endpoint,
- forgot password endpoint.

Limit:
- 5 attempts,
- per IP,
- every 10 minutes.

Prevent brute-force attacks.

---

## Environment Variables

Never hardcode:
- API keys,
- secrets,
- tokens,
- database URLs.

Use:
- `.env.local`
- Vercel environment variables.

`.env.local` MUST be in `.gitignore`.

---

# Product Architecture

## Core Flows

### 1. User Registration
Flow:
1. Validate input with Zod
2. Check email uniqueness
3. Hash password
4. Save user
5. Generate verification token
6. Send verification email
7. Require email verification before dashboard access

---

### 2. Login
Flow:
1. Validate credentials
2. Compare bcrypt hash
3. Create session using NextAuth
4. Reject unverified users
5. Redirect authenticated users to dashboard

---

### 3. Email Verification
Flow:
1. User clicks token link
2. Validate token
3. Check expiry
4. Mark user verified
5. Delete token
6. Redirect appropriately

---

### 4. Forgot Password
Flow:
1. Accept email
2. Always return success response
3. Generate reset token
4. Send reset email
5. Validate token on reset
6. Hash new password
7. Delete token
8. Redirect to login

---

### 5. Protected Dashboard
Dashboard access requires:
- valid session,
- verified email.

Use middleware protection.

---

# Database Models

## User

Fields:
- id
- name
- email
- password
- emailVerified
- createdAt

---

## VerificationToken

Fields:
- identifier
- token
- expires

---

## PasswordResetToken

Fields:
- email
- token
- expires

---

# Folder Structure Expectations

Use scalable architecture.

Recommended structure:

```txt
src/
├── app/
├── components/
├── lib/
├── actions/
├── hooks/
├── types/
├── schemas/
├── emails/
├── middleware/
├── services/
└── utils/
```

---

# UI/UX Requirements

The UI should feel:
- modern,
- minimal,
- trustworthy,
- clean,
- secure,
- accessible.

Authentication UI should communicate confidence and safety.

---

## Form Requirements

Every form MUST have:
- accessible labels,
- loading states,
- inline validation,
- descriptive error messages,
- keyboard accessibility.

Never use generic:
```txt
Something went wrong
```

---

## Password Strength Indicator

Must support:
- Weak
- Fair
- Strong

Evaluate using:
- length,
- uppercase/lowercase,
- numbers,
- symbols.

---

# Middleware Expectations

Middleware must:
- protect private routes,
- check authentication,
- check email verification,
- redirect unauthorized users safely.

Middleware must never create redirect loops.

---

# Email System Expectations

Emails should:
- be responsive,
- work in dark/light clients,
- feel professional,
- contain secure links,
- avoid exposing sensitive information.

Use React Email templates.

---

# Code Quality Rules

Always:
- separate concerns,
- use reusable utilities,
- keep API handlers lean,
- extract validation schemas,
- centralize auth logic,
- centralize token logic.

Avoid:
- duplicated logic,
- giant components,
- insecure shortcuts,
- hidden side effects.

---

# Preferred Libraries

Preferred packages:
- zod
- react-hook-form
- @hookform/resolvers
- bcryptjs
- next-auth
- prisma
- @prisma/client
- resend
- react-email
- lucide-react
- sonner
- clsx
- tailwind-merge

---

# Deployment Requirements

Deploy on Vercel.

Before production:
- verify environment variables,
- verify rate limiting,
- verify redirects,
- test expired tokens,
- test invalid tokens,
- test wrong passwords,
- test protected routes,
- test email verification flow,
- test forgot password flow.

Always test in an incognito window.

---

# Important Engineering Priorities

Priority order:
1. Security
2. Reliability
3. Correctness
4. Accessibility
5. Maintainability
6. Performance
7. Visual polish

Never sacrifice security for convenience.

---

# Definition of Success

SecureGate succeeds if:
- authentication is secure,
- flows are production-ready,
- edge cases are handled,
- sessions are protected,
- tokens are safe,
- errors are secure,
- and the architecture is scalable.

The project should feel like a real SaaS authentication foundation — not a tutorial clone.

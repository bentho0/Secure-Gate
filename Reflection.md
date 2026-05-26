# SecureGate — Reflection & Engineering Analysis

**Name:** Bennett Emmanuel Ben-Ebong

**Cohort:** Design to MVP Bootcamp

**Live URL:** https://secure-gate-beta.vercel.app/

**GitHub Repo:** https://github.com/bentho0/Secure-Gate

---

## Part 1 — What I Built

I built SecureGate, a standalone authentication and security system using Next.js, TypeScript, Prisma, PostgreSQL, and NextAuth. The app includes user registration, login, email verification, protected dashboard access, forgot password flow, rate limiting, and secure password hashing.

## Part 2 — What Surprised Me

The hardest part was handling authentication edge cases properly. Things like expired tokens, invalid sessions, and secure error messages looked simple at first, but I learned that authentication requires a lot of defensive thinking because small mistakes can create serious security problems.

---

## Part 3 — Engineering Laws Quiz

### Q1 — Murphy's Law

**Code reference:** `src/app/api/auth/[...nextauth]/route.ts` lines 34-48

**My Answer:** Murphy's Law affected how I handled login security and token expiry. I added rate limiting to stop brute-force attacks and made verification/reset tokens expire automatically. Without those protections, attackers could spam login attempts or use old tokens to access accounts.

**What goes wrong if ignored:** Hackers could break into accounts, reuse expired tokens, or overload the system with login attempts.

---

### Q2 — Law of Leaky Abstractions

**Code reference:** `src/auth.ts` or `src/app/api/auth/[...nextauth]/route.ts`

**My Answer:** The Prisma schema looks simple, but the actual PostgreSQL database still controls things like indexes, constraints, and relations underneath. Prisma is only an abstraction layer over the real database. Without those protections, attackers could spam login attempts or use old tokens to access accounts.

**What goes wrong if ignored:** You may think authentication is working when routes are actually exposed or sessions are insecure.

---

### Q3 — Law of Leaky Abstractions

**Code reference:** `src/auth.ts` or `src/app/api/auth/[...nextauth]/route.ts`

**My Answer:** The Prisma schema looks simple, but the actual PostgreSQL database still controls things like indexes, constraints, and relations underneath. Prisma is only an abstraction layer over the real database. Without those protections, attackers could spam login attempts or use old tokens to access accounts.

**What goes wrong if ignored:** You may think authentication is working when routes are actually exposed or sessions are insecure.

---

### Q4 — Kerckhoffs's Principle

**Code reference:** `src/app/api/signup/route.ts`

**My Answer:** A salt is random data added to passwords before hashing. bcrypt handles this automatically, which makes password hashes unique even if users have the same password. Using plain SHA-256 would make passwords easier to crack with rainbow tables.

**What goes wrong if ignored:** If the database leaks, attackers could crack many user passwords quickly.

---

### Q5 — Security by Design

**Code reference:** `src/app/api/forgot-password/route.ts`

**My Answer:** The forgot-password endpoint returns the same success message whether the email exists or not. This prevents attackers from discovering which emails are registered in the system.

**What goes wrong if ignored:** Attackers could collect valid user emails and target those accounts.

---

### Q6 — Boy Scout Rule

**Code reference:** `src/lib/validators/auth-schema.ts`

**My Answer:** I cleaned up repeated validation logic and renamed unclear variables while building the auth flow. Even though it was not part of the original feature, it made the code easier to maintain.

**What goes wrong if ignored:** The codebase becomes messy and harder to understand over time.

---

### Q7 — Gall's Law

**Code reference:** `prisma/schema.prisma` and Git commit history

**My Answer:** SecureGate was built phase by phase, starting with the database and auth basics before adding email verification and security hardening. This made debugging easier and kept the system stable.

**What goes wrong if ignored:** Building everything at once creates too many bugs and makes problems harder to trace.

---

### Q8 — ORM Leaky Abstractions

**Code reference:** `prisma/schema.prisma`

**My Answer:** The Prisma schema looks simple, but the actual PostgreSQL database still controls things like indexes, constraints, and relations underneath. Prisma is only an abstraction layer over the real database.

**What goes wrong if ignored:** You may misunderstand how data is stored or accidentally create inefficient queries.

---

### Q9 — Zawinski's Law

**Code reference:** `src/lib/rate-limit.ts`

**My Answer:** Rate limiting was added as a separate security responsibility instead of stuffing everything into NextAuth. This kept SecureGate focused on authentication instead of becoming overloaded with unrelated features.

**What goes wrong if ignored:** The app becomes bloated, harder to maintain, and more difficult to secure.

---

### Q10 — Principle of Least Surprise

**Code reference:** `src/app/login/page.tsx`

**My Answer:** I used the message "Invalid credentials" for failed logins because it is simple and predictable. It avoids confusing users while also protecting sensitive information.

**What goes wrong if ignored:** Users get confused, and attackers learn whether an email exists in the system.

---

### Q11 — Defensive Programming

**Code reference:** `src/middleware.ts`

**My Answer:** The middleware checks the user session before allowing access to the dashboard. If the session cookie is deleted or invalid, the middleware redirects the user back to the login page.

**What goes wrong if ignored:** Unauthenticated users may gain access to protected pages.

---

### Q12 — Technical Debt + Security

**Code reference:** `.env.local` and `src/auth.ts`

**My Answer:** If the `NEXTAUTH_SECRET` leaked on GitHub, attackers could potentially forge sessions or tamper with authentication tokens. I would immediately rotate the secret, redeploy the app, and invalidate old sessions.

**What goes wrong if ignored:** Attackers could hijack user sessions and compromise accounts.

---

### Q13 — Conway's Law

**Code reference:** `src/app`, `src/components`, `src/lib`, and `prisma/`

**My Answer:** My folder structure reflects how I think about authentication: routes, middleware, database logic, and UI are separated clearly. The structure mirrors the way the system itself is organized.

**What goes wrong if ignored:** The project becomes harder to navigate and scale as more features are added.

---

### Q14 — Technical Debt

**Code reference:** `src/app/api/reset-password/route.ts`

**My Answer:** One technical debt was keeping some auth logic directly inside route handlers instead of extracting reusable service functions. I left it temporarily to move faster during development.

**What goes wrong if ignored:** As the app grows, duplicated logic becomes harder to maintain and debug.

---

### Q15 — Synthesis Question

**Code reference:** `src/app/api/auth`, `src/middleware.ts`, and `src/lib/rate-limit.ts`

**My Answer:** If Flutterwave payments were added, security and defensive programming would become even more important. Authentication, session handling, token validation, and error handling would all need to be extremely reliable because real money is involved.

**What goes wrong if ignored:** Users could lose trust, payments could fail, or attackers could exploit weak security to steal accounts or manipulate transactions.

---

## Part 4 — One Thing I Would Refactor

One thing I would refactor is moving repeated authentication logic out of route handlers into reusable service functions. Right now, the app works well, but separating business logic from API routes would make the code cleaner, easier to test, and more scalable as the project grows.

---

## Part 5 — How This Changes How I Build

This project changed how I think about authentication and security. I now understand that building secure systems is not just about making features work; it is about handling edge cases, protecting user data, and assuming that anything that can break eventually will. I also learned the importance of clean architecture, proper validation, and defensive programming in real-world applications.

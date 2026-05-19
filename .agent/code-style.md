# code-style.md
# SecureGate Code Style Guide

## Philosophy

Code should be:
- explicit,
- readable,
- modular,
- scalable,
- secure,
- and maintainable.

Readable code is more important than clever code.

---

# TypeScript Standards

## Rules

- Use strict TypeScript.
- Avoid `any`.
- Prefer explicit typing.
- Use interfaces for objects.
- Use type aliases for unions.

Bad:
```ts
const user: any = {}
```

Good:
```ts
interface User {
  id: string
  email: string
}
```

---

# Naming Conventions

| Type | Convention |
|---|---|
| Components | PascalCase |
| Functions | camelCase |
| Variables | camelCase |
| Constants | UPPER_SNAKE_CASE |
| Files | kebab-case |
| Hooks | useSomething |
| Types | PascalCase |
| Interfaces | PascalCase |

---

# Component Standards

## Rules

- One responsibility per component.
- Keep components small.
- Extract reusable UI.
- Prefer server components by default.
- Use client components only when needed.

---

# Function Standards

Functions should:
- do one thing,
- be predictable,
- avoid side effects,
- have explicit return types.

Bad:
```ts
function process(data) {}
```

Good:
```ts
async function createUser(
  input: CreateUserInput
): Promise<User> {}
```

---

# Import Ordering

Order imports:

1. External libraries
2. Internal modules
3. Relative imports
4. Styles

Example:
```ts
import { z } from "zod"

import { prisma } from "@/lib/prisma"

import "./styles.css"
```

---

# Validation Rules

All user input MUST:
- use Zod schemas,
- validate server-side,
- return typed errors.

Validation schemas belong in:
```txt
src/schemas/
```

---

# Error Handling

Rules:
- Never leak sensitive information.
- Never expose stack traces.
- Return safe messages.

Bad:
```ts
return res.json(error)
```

Good:
```ts
return {
  error: "Invalid credentials"
}
```

---

# File Organization

Keep files:
- focused,
- predictable,
- isolated by responsibility.

Avoid:
- giant files,
- mixed responsibilities,
- deeply nested logic.

---

# Styling Rules

Use:
- Tailwind CSS,
- utility-first styling,
- clsx,
- tailwind-merge.

Avoid:
- inline styles,
- inconsistent spacing,
- arbitrary values unless necessary.

---

# API Route Standards

Route handlers should:
- validate input,
- call services,
- return typed responses,
- avoid business logic.

Business logic belongs in:
```txt
src/services/
```

---

# Database Standards

Use Prisma consistently.

Rules:
- Never query DB directly inside UI.
- Keep queries centralized.
- Use transactions where necessary.
- Always handle null states.

---

# Security Coding Rules

Never:
- log passwords,
- expose secrets,
- trust client input,
- hardcode API keys.

Always:
- hash passwords,
- sanitize input,
- validate tokens,
- verify sessions.

---

# Commenting Standards

Comments should explain:
- WHY,
not WHAT.

Avoid:
```ts
// increment count
count++
```

Prefer:
```ts
// Prevent duplicate submissions during async requests
```

---

# Accessibility Standards

Every UI component should:
- support keyboard navigation,
- include ARIA labels where needed,
- have accessible contrast,
- support focus states.

---

# Git Standards

Commit messages:
```txt
feat: add email verification flow
fix: prevent token reuse
refactor: extract auth service
```

---

# Performance Standards

Avoid:
- unnecessary client rendering,
- excessive re-renders,
- oversized bundles.

Prefer:
- server components,
- lazy loading,
- memoization only when necessary.

---

# Final Rule

Security > Cleverness.

Always choose:
- predictable code,
- maintainable architecture,
- explicit behavior,
over shortcuts.

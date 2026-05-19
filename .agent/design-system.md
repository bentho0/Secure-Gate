# design-system.md
# SecureGate Design System

## Design Philosophy

SecureGate should feel:
- modern,
- trustworthy,
- secure,
- minimal,
- clean,
- and professional.

The UI should communicate confidence and clarity.

Avoid:
- playful interfaces,
- overly colorful UI,
- unnecessary decoration.

---

# Brand Personality

Keywords:
- Secure
- Professional
- Calm
- Technical
- Reliable
- Minimal

---

# Visual Direction

Primary inspiration:
- Linear
- Vercel
- Clerk
- Supabase
- Notion

UI should feel:
- spacious,
- polished,
- fast,
- and intentional.

---

# Color System

## Neutral-First Palette

Use neutral colors heavily.

Primary UI:
- whites,
- blacks,
- grays,
- subtle borders.

Accent colors should be minimal.

---

# Semantic Colors

## Success
Used for:
- verified states,
- successful actions.

## Warning
Used for:
- password strength,
- token expiration warnings.

## Error
Used for:
- validation issues,
- failed authentication.

---

# Typography

## Font Style

Preferred fonts:
- Inter
- Geist
- SF Pro equivalent

---

## Typography Scale

| Usage | Size |
|---|---|
| Hero | 36–48px |
| Page Title | 28–32px |
| Section Title | 20–24px |
| Body | 14–16px |
| Caption | 12–13px |

---

# Spacing System

Use consistent spacing.

Preferred spacing scale:
```txt
4
8
12
16
20
24
32
40
48
64
```

Never use random spacing values.

---

# Radius System

Use soft modern corners.

Preferred radius:
```txt
rounded-xl
rounded-2xl
```

Avoid:
- sharp edges,
- inconsistent radius values.

---

# Shadow System

Use subtle shadows only.

Shadows should:
- separate layers,
- create depth,
- never dominate UI.

---

# Layout Principles

## Content Width

Authentication pages should:
- remain compact,
- centered,
- focused.

Recommended max widths:
```txt
sm:max-w-md
md:max-w-lg
```

---

# Authentication Screens

Screens:
- Login
- Signup
- Forgot Password
- Reset Password
- Verify Email

Must:
- feel consistent,
- share layout structure,
- use reusable components.

---

# Form Design

## Input Fields

Inputs should:
- have visible labels,
- clear focus states,
- subtle borders,
- accessible contrast.

---

## Validation States

Each state should be visually clear:
- default,
- focused,
- error,
- disabled,
- loading.

---

# Button System

## Primary Button

Used for:
- sign in,
- create account,
- reset password.

Should feel:
- strong,
- clear,
- confident.

---

## Secondary Button

Used for:
- cancel,
- back,
- secondary actions.

---

# Loading States

Every async action requires:
- spinner,
- disabled button,
- visible feedback.

Never leave users uncertain.

---

# Password Strength Indicator

States:
- Weak
- Fair
- Strong

Visual treatment should be:
- subtle,
- readable,
- immediate.

---

# Dashboard Design

Dashboard should:
- feel protected,
- minimal,
- organized.

Avoid clutter.

---

# Accessibility

Must support:
- keyboard navigation,
- visible focus states,
- proper labels,
- readable contrast,
- screen readers.

---

# Animation Principles

Use subtle motion only.

Allowed:
- fade,
- scale,
- slide.

Avoid:
- exaggerated animation,
- bouncing,
- distracting transitions.

---

# Responsive Design

Design mobile-first.

Support:
- mobile,
- tablet,
- desktop.

Authentication flows must remain usable on small screens.

---

# Component Philosophy

Components should be:
- reusable,
- composable,
- isolated,
- accessible.

---

# Design Consistency Rules

Always:
- reuse spacing,
- reuse typography,
- reuse components,
- reuse button styles.

Avoid:
- one-off UI,
- inconsistent layouts,
- random styling decisions.

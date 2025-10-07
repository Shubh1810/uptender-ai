# 🔐 Authentication Flow Diagram

## Visual Flow Chart

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER JOURNEY                                │
└─────────────────────────────────────────────────────────────────────┘

1️⃣  USER VISITS HOMEPAGE
    └─→ https://yoursite.com/
         │
         ├─→ Sees "Sign in with Google" button in Header
         │
         └─→ Clicks button


2️⃣  GOOGLE SIGN-IN INITIATED
    └─→ GoogleSignInButton component
         │
         ├─→ Calls: supabase.auth.signInWithOAuth()
         │
         └─→ Redirects to: Google OAuth consent screen


3️⃣  GOOGLE OAUTH SCREEN
    └─→ accounts.google.com
         │
         ├─→ User sees: "TenderHub wants to access your Google Account"
         │
         ├─→ Shows: Email, Name, Profile picture
         │
         └─→ User clicks: "Allow"


4️⃣  GOOGLE REDIRECTS TO SUPABASE
    └─→ https://yudbacivchnfyqziisao.supabase.co/auth/v1/callback?code=xxx
         │
         ├─→ Supabase validates the code
         │
         ├─→ Creates user session
         │
         ├─→ Generates JWT tokens
         │
         └─→ Redirects to: http://localhost:3000/auth/callback?code=yyy


5️⃣  YOUR APP CALLBACK HANDLER
    └─→ /auth/callback/route.ts
         │
         ├─→ Receives authorization code
         │
         ├─→ Exchanges code for session
         │
         ├─→ Stores session in cookies
         │
         └─→ Redirects to: /dashboard


6️⃣  DASHBOARD PAGE LOADS
    └─→ /dashboard/page.tsx
         │
         ├─→ Checks if user is authenticated
         │
         ├─→ Gets user data from session
         │
         ├─→ Displays user profile in sidebar
         │
         └─→ Shows: Welcome message, stats, navigation


7️⃣  SUBSEQUENT PAGE LOADS
    └─→ Every request passes through middleware
         │
         ├─→ middleware.ts checks session
         │
         ├─→ Refreshes tokens if needed
         │
         └─→ User stays logged in


8️⃣  SIGN OUT
    └─→ User clicks "Sign Out" button
         │
         ├─→ Calls: supabase.auth.signOut()
         │
         ├─→ Clears session cookies
         │
         └─→ Redirects to: Homepage (/)
```

---

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COMPONENT ARCHITECTURE                            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│   Header.tsx    │
│                 │
│  ┌───────────┐  │      ┌──────────────────────┐
│  │  Google   │──┼─────→│ GoogleSignInButton   │
│  │  Button   │  │      │                      │
│  └───────────┘  │      │ • Handles OAuth      │
└─────────────────┘      │ • Shows loading      │
                         │ • Error handling     │
                         └──────────┬───────────┘
                                    │
                                    ↓
                         ┌──────────────────────┐
                         │  Supabase Client     │
                         │  (client.ts)         │
                         │                      │
                         │ • Browser-side auth  │
                         │ • Manages session    │
                         └──────────┬───────────┘
                                    │
                                    ↓
                         ┌──────────────────────┐
                         │   Supabase Server    │
                         │   (supabase.co)      │
                         │                      │
                         │ • Handles OAuth      │
                         │ • Creates JWT        │
                         │ • Manages users      │
                         └──────────┬───────────┘
                                    │
                                    ↓
                         ┌──────────────────────┐
                         │  Auth Callback       │
                         │  (route.ts)          │
                         │                      │
                         │ • Exchange code      │
                         │ • Set session        │
                         │ • Redirect           │
                         └──────────┬───────────┘
                                    │
                                    ↓
                         ┌──────────────────────┐
                         │  Middleware          │
                         │  (middleware.ts)     │
                         │                      │
                         │ • Check auth         │
                         │ • Refresh tokens     │
                         │ • On every request   │
                         └──────────┬───────────┘
                                    │
                                    ↓
                         ┌──────────────────────┐
                         │  Dashboard Page      │
                         │  (dashboard/page.tsx)│
                         │                      │
                         │ • Protected route    │
                         │ • Show user data     │
                         │ • Sidebar nav        │
                         └──────────────────────┘
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW                                    │
└─────────────────────────────────────────────────────────────────────┘

CLIENT SIDE                    SUPABASE                    GOOGLE
───────────                    ────────                    ──────

[User clicks button]
      │
      ├─→ signInWithOAuth()
      │         │
      │         └─→ [Supabase generates state]
      │                   │
      │                   └─→ [Redirect to Google] ────→ [Google OAuth]
      │                                                         │
      │                                                         │
      │                                           [User authorizes]
      │                                                         │
      │                   ┌──────────────────────────────────────┘
      │                   │
      │         [Redirect with code]
      │                   │
      │         [Validate & create session]
      │                   │
      │         [Generate JWT tokens]
      │                   │
      ←─────── [Redirect with code]
      │
[Exchange code]
      │
      └─→ exchangeCodeForSession()
                │
                └─→ [Store tokens in cookies]
                          │
                          └─→ [Redirect to dashboard]
                                    │
                          [User is authenticated!]
```

---

## Session Management

```
┌─────────────────────────────────────────────────────────────────────┐
│                      SESSION LIFECYCLE                               │
└─────────────────────────────────────────────────────────────────────┘

INITIAL STATE
  └─→ No session
       │
       └─→ User is redirected to "/" if accessing /dashboard

AFTER SIGN IN
  └─→ Session created
       │
       ├─→ Access token (JWT) - expires in 1 hour
       ├─→ Refresh token - expires in 7 days
       └─→ Stored in HttpOnly cookies

ON EVERY REQUEST
  └─→ Middleware runs
       │
       ├─→ Checks if session exists
       │
       ├─→ If access token expired:
       │    └─→ Uses refresh token to get new access token
       │
       └─→ Updates cookies with fresh tokens

AFTER SIGN OUT
  └─→ Session cleared
       │
       ├─→ Cookies deleted
       ├─→ Tokens revoked
       └─→ User redirected to "/"
```

---

## File Relationships

```
tenderhub/
│
├── middleware.ts ──────────────┐
│   (Runs on every request)     │
│                                │
├── .env.local ─────────────┐   │
│   (Supabase credentials)   │   │
│                            ↓   ↓
├── src/lib/supabase/
│   ├── client.ts ←──── [Used by browser components]
│   ├── server.ts ←──── [Used by server components]
│   └── middleware.ts ← [Used by root middleware.ts]
│
├── src/app/
│   ├── auth/callback/
│   │   └── route.ts ←─ [Handles OAuth redirect]
│   │                        │
│   └── dashboard/           │
│       └── page.tsx ←───────┘
│           (Protected route - checks auth)
│
└── src/components/
    ├── Header.tsx ───┐
    └── ui/           │
        └── google-signin-button.tsx ←┘
            (Triggers OAuth flow)
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│                      SECURITY ARCHITECTURE                           │
└─────────────────────────────────────────────────────────────────────┘

1. OAUTH 2.0 + PKCE
   └─→ Industry standard for secure authentication
        │
        ├─→ Code challenge prevents CSRF attacks
        └─→ State parameter prevents replay attacks

2. JWT TOKENS
   └─→ Cryptographically signed
        │
        ├─→ Cannot be tampered with
        └─→ Contains user ID, email, metadata

3. HTTPONLY COOKIES
   └─→ Not accessible via JavaScript
        │
        ├─→ Protected from XSS attacks
        └─→ Automatically sent with requests

4. MIDDLEWARE PROTECTION
   └─→ Runs on every request
        │
        ├─→ Validates session
        ├─→ Refreshes tokens
        └─→ Blocks unauthorized access

5. ROW LEVEL SECURITY (RLS)
   └─→ Database-level protection
        │
        ├─→ Users can only access their own data
        └─→ Enforced by Supabase PostgreSQL
```

---

## What Happens When...

### ❓ User tries to access /dashboard without signing in?
```
1. Dashboard page loads
2. Checks for user session
3. No session found
4. Redirects to "/" (homepage)
```

### ❓ Access token expires?
```
1. Middleware detects expired token
2. Uses refresh token to get new access token
3. Updates cookies
4. Request continues normally
5. User stays logged in ✓
```

### ❓ Refresh token expires?
```
1. Middleware cannot refresh session
2. Session is invalid
3. User is redirected to "/"
4. User needs to sign in again
```

### ❓ User closes browser?
```
1. Cookies persist (not deleted)
2. User opens browser again
3. Middleware validates session
4. User is still logged in ✓
```

### ❓ Someone tries to steal the JWT token?
```
1. Token is in HttpOnly cookie
2. JavaScript cannot access it
3. XSS attack fails ✓

IF somehow token is stolen:
1. Token expires in 1 hour
2. Attacker loses access
3. Original user still logged in
```

---

## Summary

Your authentication system is:
- ✅ **Secure** - OAuth 2.0, JWT, HttpOnly cookies
- ✅ **User-friendly** - One-click Google sign-in
- ✅ **Automatic** - Token refresh, session management
- ✅ **Protected** - Middleware guards all routes
- ✅ **Production-ready** - Follows best practices

🎉 **You're all set!**


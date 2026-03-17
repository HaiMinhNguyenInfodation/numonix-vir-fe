# Numonix FE Implementation Plan

## 1. Project Overview
This project is a reporting website with multiple resources:
- Native Angular frontend pages
- Embedded iframe content from another website

The application works in 2 main steps:
1. Login
2. Show main menu and content area

## 2. Phase 1 Scope

### 2.1 Authentication
- Use Microsoft authentication with MSAL only (no fallback login).
- Configuration source: `docs/login/loginimplementation.md`
  - App ID: `459e40d6-e96a-4c4e-833f-f43bd5d71885`
  - Redirect URL: `http://localhost:4200`
- Implement:
  - Login flow
  - Logout flow
  - Authentication callback handling
  - Route protection for all app pages except login/callback (`MsalGuard`)

### 2.2 Main Application Layout
After successful login, show the main application shell:
- Header
- Left menu
- Main content area (Angular router outlet)
- UI framework: Angular Material
- Use Angular Material components for shell and navigation:
  - `MatToolbar` for header
  - `MatSidenav` and `MatNavList` for left menu
  - `MatButton`, `MatIcon`, and `MatMenu` for interactions
  - `MatCard` and `MatProgressSpinner` for status/loading states

### 2.3 Content (Initial)
- Native FE reporting pages (placeholder pages for now)
- iframe page support (basic embed only in Phase 1)
- Advanced iframe auth/context passing is deferred to Phase 2

### 2.4 Routing Rules
- Public routes:
  - `/login`
  - `/auth/callback`
- Protected routes:
  - All other application routes
- If an unauthenticated user accesses a protected route, redirect to login.

### 2.5 Error and Session Handling
- Show authentication error state/page if login fails.
- On logout, clear session and return to unauthenticated state.
- Handle expired session by forcing re-authentication.

### 2.6 UI Technology
- Primary UI library for Phase 1: Angular Material.
- Apply a consistent Material theme for color, typography, and spacing.
- Ensure responsive behavior using Material layout patterns for desktop and mobile.

## 3. Out of Scope for Phase 1
- Role/permission-based menu
- Detailed report business logic
- iframe token/context passing and cross-window messaging
- Full UI/UX final design and advanced responsiveness tuning

## 4. Phase 1 Acceptance Criteria
- User can log in successfully with Microsoft account.
- User can access protected pages only after authentication.
- User can log out and is returned to unauthenticated state.
- Main menu and content area are displayed after login.
- Native and iframe placeholder pages are navigable.
- Main pages consistently use Angular Material components.
- Layout is responsive, with sidenav behavior working on desktop and mobile.

## 5. Phase 2 (Planned, details later)
- iframe integration enhancements (`postMessage`, origin validation, token/context passing)
- Detailed reporting features from internal APIs
- Full role/permission model
- Final menu structure and report navigation logic
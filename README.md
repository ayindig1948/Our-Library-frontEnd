# Our Library Frontend

A single-page library management app built with **Vite + React 19**, secured with **Auth0**.
Users can browse, check out, and return books; admins can add/remove books and fulfill requests.

> Part of the **[Our Library](https://github.com/users/ayindig1948/projects/1)** project.
> Backend API: **[Our-Library-backEnd](https://github.com/ayindig1948/Our-Library-backEnd)** (.NET 10 + SQL Server).

## Tech stack

- Vite 8, React 19, React Router 7
- Auth0 (`@auth0/auth0-react`) — Authorization Code + PKCE
- Tailwind CSS 4

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in VITE_API_BASE_URL
npm run dev
```

### Environment

All config is via `VITE_*` variables — see [`.env.example`](.env.example).
These are inlined into the public client bundle, so **never put secrets here**.
The only value you normally change is `VITE_API_BASE_URL` (the backend URL).

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL of the backend API (e.g. `https://localhost:7025`) |
| `VITE_*` endpoint paths | Route suffixes appended in [`src/api.js`](src/api.js) |

## Auth

Auth0 `domain`, `clientId`, and `audience` are configured in [`src/main.jsx`](src/main.jsx).
These are public SPA identifiers (PKCE flow) — security is enforced by the backend, which
validates the JWT on every request. Make sure your app's origin is in Auth0's
**Allowed Callback/Logout/Web Origin** lists.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

# Insighta Web Portal

A web interface for the Insighta Labs+ demographic intelligence platform.

## Tech Stack
- Node.js + Express
- EJS templating
- Express Session with HTTP-only cookies
- Axios

## Pages

- `/auth/login` — GitHub OAuth login page
- `/profiles` — list all profiles with filters and pagination
- `/profiles/search` — natural language search
- `/profiles/:id` — single profile detail view

## Authentication Flow

1. User clicks "Continue with GitHub"
2. Redirected to GitHub OAuth page
3. User authorizes
4. Backend processes callback and redirects to web portal with tokens
5. Tokens stored in HTTP-only session cookie
6. All subsequent requests use session cookie automatically

## Security

- HTTP-only cookies — tokens not accessible via JavaScript
- Session expires after 5 minutes matching refresh token expiry
- CSRF protection via sameSite cookie policy
- All API requests authenticated via session tokens

## Running Locally

1. Clone the repo
2. Install dependencies: `npm install`
3. Create `.env` file:
   - SESSION_SECRET
   - API_URL=https://hng-stage1-backend-production-4bcf.up.railway.app
   - CLIENT_ID
4. Start server: `node app.js`
5. Visit: `http://localhost:4000`

## Live URL

https://insighta-web-production.up.railway.app
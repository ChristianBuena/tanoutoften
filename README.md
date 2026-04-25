
# Dual-Identity Portfolio Design

This repository contains Christian Buena's dual-identity portfolio project.

## Running the code

1. Install dependencies:

```bash
npm i
```

2. Create a local environment file:

```bash
cp .env.example .env
```

3. Fill in your SMTP credentials in `.env`.

4. Start frontend + SMTP backend together:

```bash
npm run dev
```

This starts:
- Vite frontend on `http://localhost:5173`
- SMTP backend API on `http://localhost:8787`

For local development, `/api/*` requests are proxied by Vite to `http://localhost:8787`.

## Deploying on Vercel

This project includes Vercel serverless API routes in `api/`:
- `GET /api/health`
- `POST /api/contact`

Set these environment variables in Vercel (Project Settings -> Environment Variables) for the environments you use (Production/Preview):

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `CONTACT_RECEIVER`

Recommended Gmail setup:

- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=465`
- `SMTP_SECURE=true`
- `SMTP_USER=<your gmail address>`
- `SMTP_PASS=<16-character Gmail app password>`

Important:

- After changing Vercel environment variables, redeploy the project.
- Use Gmail app password (not your normal account password).
- `SMTP_PASS` can include spaces/dashes when copied; backend normalizes them for Gmail.

## SMTP API

- `POST /api/contact`
- Required JSON body:

```json
{
  "name": "Your Name",
  "email": "you@example.com",
  "message": "Your message"
}
```

The frontend contact form already uses this endpoint.

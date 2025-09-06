# Request Page Lock (Edge Middleware)

This project includes Vercel Edge Middleware to protect the request page.

## What it does
- Blocks `/music-request` and `/music-request.html` unless the cookie `req_unlocked=1` is present.
- Provides utility routes to manage the cookie:
  - `/unlock?key=PIN` (or `?pin=PIN`) – sets the cookie and redirects to the request page
  - `/lock` – clears the cookie and redirects to `maintenance.html`

## Setup
- Optional: set a Vercel env var `REQUEST_UNLOCK_KEY` to require a PIN when visiting `/unlock`.
- Deploy.

## Usage
- Unlock at the event: visit `/unlock?key=YOUR_PIN` once (from your phone). This sets `req_unlocked=1` for 8 hours.
- Share the QR that points to `/unlock?key=YOUR_PIN` so guests land on the unlocked page.
- After the gig: visit `/lock` to immediately lock again.

## Notes
- Cookie options: `SameSite=Lax`, `Secure`, 8h expiration.
- If `REQUEST_UNLOCK_KEY` is not set, `/unlock` will not require a PIN. 
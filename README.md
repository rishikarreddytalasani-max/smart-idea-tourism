# SmartTour — AI Travel Assistant

## Files
- `index.html`   — Main website (all 6 tools)
- `style.css`    — Professional CSS design system
- `script.js`    — All JS fixed + coupon backend integration
- `server.js`    — Node.js/Express coupon backend
- `admin.html`   — Admin dashboard for coupons & reviews
- `package.json` — Node dependencies

## Run the backend
```bash
npm install
node server.js
# → http://localhost:3000
```

## API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/review | Submit review, receive coupon |
| POST | /api/coupon/validate | Check if a coupon is valid |
| POST | /api/coupon/redeem | Mark coupon as used |
| GET  | /api/admin/coupons | List all coupons (admin) |
| GET  | /api/admin/reviews | List all reviews (admin) |
| DELETE | /api/admin/coupon/:code | Delete a coupon |

## Static (no server) Mode
The coupon system automatically falls back to localStorage when the backend is unavailable.

## Bug Fixes Applied
1. **Critical JS crash** — Mismatched bracket `text]` in translator section crashed ALL event listeners
2. **Itinerary invisible** — Fixed `.hidden` class not being removed; added scroll-into-view
3. **Inaccurate times** — Added per-day time tracking with 30-min travel gap on Day 1
4. **Destination clarity** — Added departure leg with accurate arrival times

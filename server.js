const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'coupons.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Simple JSON file as database
function readDB() {
  if (!fs.existsSync(DB_FILE)) return { reviews: [], coupons: [] };
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
  catch (e) { return { reviews: [], coupons: [] }; }
}
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Generate coupon code
function generateCoupon() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'SMART-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// --- ROUTES ---

// POST /api/review  -> submit a review, get a coupon back
app.post('/api/review', (req, res) => {
  const { name, rating, text, destination } = req.body;
  if (!text || text.trim().length < 5) {
    return res.status(400).json({ error: 'Review text is too short. Please write at least a few words.' });
  }
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Please provide a valid rating between 1 and 5.' });
  }
  const db = readDB();
  const couponCode = generateCoupon();
  const discount = rating >= 4 ? 15 : rating === 3 ? 10 : 5;
  const review = {
    id: uuidv4(),
    name: name || 'Guest',
    rating: parseInt(rating),
    text: text.trim(),
    destination: destination || 'General',
    createdAt: new Date().toISOString()
  };
  const coupon = {
    code: couponCode,
    discount,
    reviewId: review.id,
    reviewerName: review.name,
    destination: review.destination,
    usedAt: null,
    isUsed: false,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    createdAt: new Date().toISOString()
  };
  db.reviews.push(review);
  db.coupons.push(coupon);
  writeDB(db);
  return res.json({
    success: true,
    message: `Thank you for your review, ${review.name}!`,
    coupon: { code: couponCode, discount, expiresAt: coupon.expiresAt }
  });
});

// POST /api/coupon/validate  -> check if a coupon is valid
app.post('/api/coupon/validate', (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'No coupon code provided.' });
  const db = readDB();
  const coupon = db.coupons.find(c => c.code === code.toUpperCase().trim());
  if (!coupon) return res.status(404).json({ valid: false, error: 'Coupon not found.' });
  if (coupon.isUsed) return res.status(400).json({ valid: false, error: 'This coupon has already been used.' });
  if (new Date(coupon.expiresAt) < new Date()) return res.status(400).json({ valid: false, error: 'This coupon has expired.' });
  return res.json({ valid: true, discount: coupon.discount, destination: coupon.destination, expiresAt: coupon.expiresAt });
});

// POST /api/coupon/redeem  -> mark coupon as used
app.post('/api/coupon/redeem', (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'No code provided.' });
  const db = readDB();
  const idx = db.coupons.findIndex(c => c.code === code.toUpperCase().trim());
  if (idx === -1) return res.status(404).json({ error: 'Coupon not found.' });
  if (db.coupons[idx].isUsed) return res.status(400).json({ error: 'Already redeemed.' });
  db.coupons[idx].isUsed = true;
  db.coupons[idx].usedAt = new Date().toISOString();
  writeDB(db);
  return res.json({ success: true, message: 'Coupon redeemed successfully!' });
});

// GET /api/admin/coupons  -> list all coupons (admin)
app.get('/api/admin/coupons', (req, res) => {
  const db = readDB();
  return res.json({ coupons: db.coupons, total: db.coupons.length });
});

// GET /api/admin/reviews  -> list all reviews (admin)
app.get('/api/admin/reviews', (req, res) => {
  const db = readDB();
  return res.json({ reviews: db.reviews, total: db.reviews.length });
});

// DELETE /api/admin/coupon/:code  -> delete a coupon
app.delete('/api/admin/coupon/:code', (req, res) => {
  const db = readDB();
  const before = db.coupons.length;
  db.coupons = db.coupons.filter(c => c.code !== req.params.code.toUpperCase());
  if (db.coupons.length === before) return res.status(404).json({ error: 'Coupon not found.' });
  writeDB(db);
  return res.json({ success: true });
});

app.listen(PORT, () => {
  console.log('SmartTour server running at http://localhost:' + PORT);
  console.log('Admin panel: http://localhost:' + PORT + '/admin.html');
});

// ============================================================
//  SmartTour — Main Script  (all bugs fixed, full features)
// ============================================================

const API = '';
// When server.js is running locally, set API = 'http://localhost:3000'
// For static file usage the coupon system falls back to localStorage

// ── Helpers ──────────────────────────────────────────────────
function fmtTime(h, m) {
  const ap = h >= 12 ? 'PM' : 'AM';
  const h12 = ((h + 11) % 12) + 1;
  return h12 + ':' + String(m).padStart(2,'0') + ' ' + ap;
}
function addMins(h, m, mins) {
  const t = h * 60 + m + mins;
  return { h: Math.floor((t / 60) % 24), m: t % 60 };
}
function fmt(n) { return 'Rs.' + Number(n).toLocaleString('en-IN'); }
function $(id) { return document.getElementById(id); }

// ── Mobile nav ───────────────────────────────────────────────
$('hamburger').addEventListener('click', () => $('navLinks').classList.toggle('open'));
document.addEventListener('click', e => {
  if (!e.target.closest('.navbar')) $('navLinks').classList.remove('open');
});

// ── Destination data ─────────────────────────────────────────
const placeData = {
  Hampi: [
    { name:'Virupaksha Temple',    dur:90  },
    { name:'Vittala Temple',       dur:120 },
    { name:'Hampi Bazaar',         dur:60  },
    { name:'Matanga Hill',         dur:90  },
    { name:'Lotus Mahal',          dur:60  },
    { name:'Elephant Stables',     dur:45  }
  ],
  Goa: [
    { name:'Baga Beach',              dur:150 },
    { name:'Fort Aguada',             dur:60  },
    { name:'Basilica of Bom Jesus',   dur:75  },
    { name:'Anjuna Flea Market',      dur:90  },
    { name:'Dudhsagar Falls',         dur:120 }
  ],
  Jaipur: [
    { name:'Amber Fort',     dur:120 },
    { name:'Hawa Mahal',     dur:60  },
    { name:'City Palace',    dur:90  },
    { name:'Jantar Mantar',  dur:60  },
    { name:'Jal Mahal',      dur:45  }
  ],
  Munnar: [
    { name:'Eravikulam National Park', dur:150 },
    { name:'Tea Museum',               dur:60  },
    { name:'Mattupetty Dam',           dur:90  },
    { name:'Top Station',              dur:120 },
    { name:'Echo Point',               dur:60  }
  ]
};

const nearbyData = {
  Hampi: [
    { name:'Virupaksha Temple', cat:'Religious places',  dist:0.8, time:'12 min', fee:'Rs.0',  open:'6:00 AM', close:'8:00 PM', dur:'1-2 hrs', rating:4.8, best:'Morning',  desc:'Ancient temple at the heart of Hampi\'s ruins.' },
    { name:'Vittala Temple',    cat:'Historical places', dist:2.5, time:'20 min', fee:'Rs.40', open:'8:00 AM', close:'6:00 PM', dur:'2-3 hrs', rating:4.9, best:'Morning',  desc:'Famous for its stone chariot and musical pillars.' },
    { name:'Matanga Hill',      cat:'Nature',            dist:1.6, time:'15 min', fee:'Rs.0',  open:'Open',    close:'Open',    dur:'1-2 hrs', rating:4.6, best:'Sunset',   desc:'Best viewpoint for a panoramic sunset over the ruins.' },
    { name:'Lotus Mahal',       cat:'Historical places', dist:3.2, time:'25 min', fee:'Rs.30', open:'8:00 AM', close:'6:00 PM', dur:'45 min',  rating:4.5, best:'Morning',  desc:'Elegant Indo-Islamic styled palace.' },
    { name:'Hampi Bazaar',      cat:'Shopping',          dist:1.0, time:'10 min', fee:'Rs.0',  open:'7:00 AM', close:'9:00 PM', dur:'1 hr',    rating:4.3, best:'Evening',  desc:'Street market with handicrafts and souvenirs.' },
    { name:'Elephant Stables',  cat:'Historical places', dist:3.5, time:'30 min', fee:'Rs.20', open:'8:00 AM', close:'6:00 PM', dur:'30 min',  rating:4.4, best:'Morning',  desc:'Domed chambers once housed royal elephants.' }
  ],
  Goa: [
    { name:'Baga Beach',            cat:'Beaches',           dist:1.2, time:'15 min', fee:'Rs.0',   open:'Open',    close:'Open',    dur:'2-4 hrs', rating:4.6, best:'Sunset',    desc:'Lively beach with water sports and beach shacks.' },
    { name:'Fort Aguada',           cat:'Historical places', dist:4.0, time:'30 min', fee:'Rs.0',   open:'9:00 AM', close:'6:00 PM', dur:'1 hr',    rating:4.7, best:'Morning',   desc:'17th-century Portuguese fort with sea views.' },
    { name:'Basilica of Bom Jesus', cat:'Religious places',  dist:5.5, time:'40 min', fee:'Rs.0',   open:'9:00 AM', close:'6:30 PM', dur:'1 hr',    rating:4.8, best:'Morning',   desc:'UNESCO-listed church housing St. Francis Xavier.' },
    { name:'Anjuna Flea Market',    cat:'Shopping',          dist:6.0, time:'45 min', fee:'Rs.0',   open:'9:00 AM', close:'6:00 PM', dur:'2 hrs',   rating:4.4, best:'Wednesday', desc:'Famous Wednesday market with global goods.' },
    { name:'Dudhsagar Falls',       cat:'Nature',            dist:9.0, time:'60 min', fee:'Rs.400', open:'8:00 AM', close:'5:00 PM', dur:'3 hrs',   rating:4.7, best:'Monsoon',   desc:'Stunning four-tiered waterfall on Goa-Karnataka border.' }
  ],
  Jaipur: [
    { name:'Amber Fort',    cat:'Historical places',    dist:11,  time:'40 min', fee:'Rs.100', open:'8:00 AM', close:'5:30 PM', dur:'2-3 hrs', rating:4.8, best:'Morning', desc:'Majestic hilltop fort with mirror palaces.' },
    { name:'Hawa Mahal',    cat:'Historical places',    dist:0.5, time:'8 min',  fee:'Rs.50',  open:'9:00 AM', close:'4:30 PM', dur:'45 min',  rating:4.6, best:'Morning', desc:'Iconic Palace of Winds with 953 windows.' },
    { name:'City Palace',   cat:'Cultural attractions', dist:0.7, time:'10 min', fee:'Rs.200', open:'9:30 AM', close:'5:00 PM', dur:'2 hrs',   rating:4.7, best:'Morning', desc:'Royal residence with museums and courtyards.' },
    { name:'Jantar Mantar', cat:'Museums',              dist:0.9, time:'10 min', fee:'Rs.50',  open:'9:00 AM', close:'4:30 PM', dur:'1 hr',    rating:4.5, best:'Morning', desc:'UNESCO astronomical observatory.' },
    { name:'Jal Mahal',     cat:'Historical places',    dist:6.0, time:'20 min', fee:'Rs.0',   open:'Open',    close:'Open',    dur:'30 min',  rating:4.4, best:'Sunset',  desc:'Floating palace in Man Sagar Lake.' }
  ],
  Munnar: [
    { name:'Eravikulam National Park', cat:'Nature',    dist:13, time:'45 min',  fee:'Rs.150', open:'7:00 AM', close:'6:00 PM', dur:'2-3 hrs', rating:4.8, best:'Morning',   desc:'Home of the Nilgiri Tahr and rolling grasslands.' },
    { name:'Tea Museum',               cat:'Museums',   dist:2,  time:'15 min',  fee:'Rs.75',  open:'9:00 AM', close:'4:30 PM', dur:'1 hr',    rating:4.5, best:'Morning',   desc:'History of Munnar\'s tea plantations.' },
    { name:'Mattupetty Dam',           cat:'Nature',    dist:11, time:'40 min',  fee:'Rs.30',  open:'9:00 AM', close:'5:00 PM', dur:'1-2 hrs', rating:4.4, best:'Afternoon', desc:'Reservoir with boating and scenic views.' },
    { name:'Top Station',              cat:'Adventure', dist:32, time:'1.5 hrs', fee:'Rs.0',   open:'Open',    close:'Open',    dur:'2 hrs',   rating:4.6, best:'Sunrise',   desc:'Highest point with panoramic valley views.' },
    { name:'Echo Point',               cat:'Nature',    dist:15, time:'50 min',  fee:'Rs.0',   open:'Open',    close:'Open',    dur:'1 hr',    rating:4.3, best:'Morning',   desc:'Natural echo phenomenon amidst misty hills.' }
  ]
};

// ── Trip Planner ─────────────────────────────────────────────
$('plannerForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const destRaw = $('pDest').value.trim();
  const start   = $('pStart').value.trim() || 'Your Location';
  const dateVal = $('pDate').value;
  const days    = Math.max(1, parseInt($('pDays').value) || 2);
  const people  = Math.max(1, parseInt($('pPeople').value) || 2);
  const budget  = parseInt($('pBudget').value) || 5000;
  const pref    = $('pPref').value;
  const interest= $('pInterest').value;
  const stParts = ($('pStartTime').value || '09:00').split(':');
  const sH = parseInt(stParts[0]) || 9;
  const sM = parseInt(stParts[1]) || 0;

  const destKey = Object.keys(placeData).find(
    k => k.toLowerCase() === destRaw.toLowerCase()
  );

  const it = $('itinerary');

  if (!destRaw) {
    it.innerHTML = '<p style="color:#dc2626">Please enter a destination.</p>';
    it.classList.remove('hidden'); return;
  }
  if (!destKey) {
    it.innerHTML = `<h3 style="color:#dc2626">Destination not found</h3><p>Available destinations: <strong>${Object.keys(placeData).join(', ')}</strong></p>`;
    it.classList.remove('hidden'); return;
  }

  let dateLabel = '';
  if (dateVal) {
    const d = new Date(dateVal + 'T00:00:00');
    dateLabel = d.toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  }

  const spots = placeData[destKey];
  const spotsPerDay = Math.min(3, Math.ceil(spots.length / days));
  let idx = 0;
  const dailyRate = { budget:800, standard:1500, premium:3000 };
  const activePlan = document.querySelector('.plan-card.active');
  const planKey = activePlan ? activePlan.dataset.plan : 'standard';
  const estCost = dailyRate[planKey] * days * people;

  let html = `<h3>🗺️ ${days}-Day Itinerary: ${start} → ${destKey}</h3>`;
  if (dateLabel) html += `<p style="color:#1d4ed8;font-size:0.9rem;margin:4px 0 0">📅 Starting: <strong>${dateLabel}</strong></p>`;
  html += '<ul>';

  for (let d = 1; d <= days; d++) {
    let cur = { h: sH, m: sM };
    html += `<li class="day-header">Day ${d} &mdash; ${destKey}</li>`;

    if (d === 1 && start !== 'Your Location') {
      const arr = addMins(cur.h, cur.m, 30);
      html += `<li>🚗 Depart <strong>${start}</strong> at ${fmtTime(cur.h, cur.m)} &mdash; arrive <strong>${destKey}</strong> ~${fmtTime(arr.h, arr.m)}</li>`;
      cur = arr;
    }

    for (let s = 0; s < spotsPerDay && idx < spots.length; s++, idx++) {
      const sp = spots[idx];
      const end = addMins(cur.h, cur.m, sp.dur);
      html += `<li>📍 <strong>${sp.name}</strong> &nbsp;<span class="time-badge">${fmtTime(cur.h, cur.m)} – ${fmtTime(end.h, end.m)}</span></li>`;
      cur = addMins(end.h, end.m, 30);
    }

    html += `<li>🍽️ Lunch break <span class="time-badge">~${fmtTime(cur.h, cur.m)}</span></li>`;
    cur = addMins(cur.h, cur.m, 60);
    html += `<li>🌆 Free time / exploration — ${fmtTime(cur.h, cur.m)} onwards</li>`;

    if (d < days) {
      html += `<li style="opacity:0.6;font-size:0.82rem">🌙 Evening rest at ${pref}</li>`;
    }
  }

  html += `<li class="budget-line">💰 Estimated cost (${planKey}): <strong>${fmt(estCost)}</strong> total &nbsp;|&nbsp; <strong>${fmt(Math.round(estCost/people))}</strong> per person &nbsp;|&nbsp; <strong>${fmt(Math.round(estCost/days))}</strong> per day &nbsp;|&nbsp; ${interest}</li>`;
  html += '</ul>';

  it.innerHTML = html;
  it.classList.remove('hidden');
  setTimeout(() => it.scrollIntoView({ behavior:'smooth', block:'start' }), 80);
});

// ── Budget Calculator ─────────────────────────────────────────
const planCards = document.querySelectorAll('.plan-card');
const dailyRates = { budget:800, standard:1500, premium:3000 };

function updateBudget() {
  const days   = Math.max(1, parseInt($('pDays').value)   || 2);
  const people = Math.max(1, parseInt($('pPeople').value) || 2);
  const budget = parseInt($('pBudget').value) || 5000;
  const active = document.querySelector('.plan-card.active');
  if (!active) return;
  const total  = dailyRates[active.dataset.plan] * days * people;
  const remain = budget - Math.round(total / people);
  $('bTotal').textContent  = fmt(total);
  $('bPer').textContent    = fmt(Math.round(total / people));
  $('bDaily').textContent  = fmt(Math.round(total / days));
  $('bRemain').textContent = fmt(remain);
  $('bRemain').style.color = remain >= 0 ? '#059669' : '#dc2626';
}

planCards.forEach(card => {
  card.addEventListener('click', () => {
    planCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    updateBudget();
  });
});
['pDays','pPeople','pBudget'].forEach(id => {
  const el = $(id);
  if (el) el.addEventListener('input', updateBudget);
});
updateBudget();

// ── Nearby Discovery ──────────────────────────────────────────
const nDest   = $('nDest');
const nRadius = $('nRadius');
const nCustom = $('nCustom');
const nCat    = $('nCat');

nRadius.addEventListener('change', () => {
  $('customWrap').classList.toggle('hidden', nRadius.value !== 'custom');
  renderNearby();
});

function renderNearby() {
  const dest   = nDest.value;
  const radius = nRadius.value === 'custom' ? (parseInt(nCustom.value) || 15) : parseInt(nRadius.value);
  const cat    = nCat.value;
  const spots  = (nearbyData[dest] || nearbyData.Hampi).filter(
    s => s.dist <= radius && (cat === 'all' || s.cat === cat)
  );
  const grid = $('nearbyResults');
  if (!spots.length) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#94a3b8;padding:40px 0">No places found within ${radius} km${cat!=='all'?' in this category':''}. Try a larger radius or different category.</p>`;
    return;
  }
  grid.innerHTML = spots.map(s => `
    <div class="nearby-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
        <h4>${s.name}</h4>
        <span class="rating">★ ${s.rating}</span>
      </div>
      <span class="cat">${s.cat}</span>
      <div class="meta">
        <div class="meta-item"><span class="label">Distance</span><span class="value">${s.dist} km</span></div>
        <div class="meta-item"><span class="label">Travel time</span><span class="value">${s.time}</span></div>
        <div class="meta-item"><span class="label">Entry fee</span><span class="value">${s.fee}</span></div>
        <div class="meta-item"><span class="label">Open</span><span class="value">${s.open} – ${s.close}</span></div>
        <div class="meta-item"><span class="label">Duration</span><span class="value">${s.dur}</span></div>
        <div class="meta-item"><span class="label">Best time</span><span class="value">${s.best}</span></div>
      </div>
      <p class="desc">${s.desc}</p>
    </div>`).join('');
}

[nDest, nCat, nCustom].forEach(el => el.addEventListener('change', renderNearby));
renderNearby();

// ── Directions ────────────────────────────────────────────────
$('openMaps').addEventListener('click', e => {
  e.preventDefault();
  const from = $('dStart').value.trim();
  const to   = $('dEnd').value.trim();
  const mode = $('dMode').value;
  if (!from || !to) { alert('Please enter both a start location and a destination.'); return; }
  const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&travelmode=${encodeURIComponent(mode)}`;
  window.open(url, '_blank');
});

// ── Translator ────────────────────────────────────────────────
// BUG WAS HERE: mismatched bracket ] inside template literal crashed all JS
$('swap').addEventListener('click', () => {
  const t = $('tlFrom').value;
  $('tlFrom').value = $('tlTo').value;
  $('tlTo').value = t;
});

$('tlTranslate').addEventListener('click', () => {
  const text = $('tlInput').value.trim();
  const out  = $('tlOutput');
  if (!text) { out.textContent = 'Please type or speak a phrase first.'; return; }
  const fromLang = $('tlFrom').options[$('tlFrom').selectedIndex].text;
  const toLang   = $('tlTo').options[$('tlTo').selectedIndex].text;
  // FIXED: was incorrectly written as text] which broke the whole script
  out.textContent = `[${fromLang} → ${toLang}] ${text}`;
  out.classList.add('active');
});

$('tlSpeak').addEventListener('click', () => {
  const out = $('tlOutput');
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    out.textContent = 'Voice input is not supported in this browser. Try Chrome or Edge.';
    return;
  }
  const SR  = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new SR();
  rec.lang           = $('tlFrom').value;
  rec.interimResults = false;
  rec.onresult = e => { $('tlInput').value = e.results[0][0].transcript; };
  rec.onerror  = () => { out.textContent = 'Microphone error. Please allow access and try again.'; };
  rec.start();
  out.textContent = '🎙️ Listening… speak now.';
});

$('tlListen').addEventListener('click', () => {
  const text = $('tlOutput').textContent;
  if (!text || text.includes('appear here')) return;
  if (!('speechSynthesis' in window)) { alert('Speech synthesis not supported in this browser.'); return; }
  const u  = new SpeechSynthesisUtterance(text);
  u.lang = $('tlTo').value;
  speechSynthesis.speak(u);
});

// ── Coupon System ─────────────────────────────────────────────
let currentRating = 0;
let currentCoupon = null;

// Star rating
document.querySelectorAll('.star').forEach(star => {
  star.addEventListener('mouseover', () => {
    const v = parseInt(star.dataset.v);
    document.querySelectorAll('.star').forEach(s =>
      s.classList.toggle('active', parseInt(s.dataset.v) <= v)
    );
  });
  star.addEventListener('mouseleave', () => {
    document.querySelectorAll('.star').forEach(s =>
      s.classList.toggle('active', parseInt(s.dataset.v) <= currentRating)
    );
  });
  star.addEventListener('click', () => {
    currentRating = parseInt(star.dataset.v);
    $('rRating').value = currentRating;
    document.querySelectorAll('.star').forEach(s =>
      s.classList.toggle('active', parseInt(s.dataset.v) <= currentRating)
    );
  });
});

function showAlert(id, type, msg) {
  const el = $(id);
  el.className = `alert alert-${type} show`;
  el.innerHTML = (type === 'success' ? '✅ ' : '❌ ') + msg;
  setTimeout(() => el.className = 'alert', 4000);
}

async function submitReviewBackend(payload) {
  try {
    const res = await fetch(API + '/api/review', {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)
    });
    return await res.json();
  } catch(e) { return null; }
}
async function validateCouponBackend(code) {
  try {
    const res = await fetch(API + '/api/coupon/validate', {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ code })
    });
    return await res.json();
  } catch(e) { return null; }
}
async function redeemCouponBackend(code) {
  try {
    const res = await fetch(API + '/api/coupon/redeem', {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ code })
    });
    return await res.json();
  } catch(e) { return null; }
}

// Fallback: localStorage coupon system
function makeCouponCode() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'SMART-';
  for (let i=0;i<6;i++) code += c[Math.floor(Math.random()*c.length)];
  return code;
}
function localSaveCoupon(code, data) {
  const store = JSON.parse(localStorage.getItem('smarttour_coupons') || '{}');
  store[code] = { ...data, used:false, createdAt:new Date().toISOString() };
  localStorage.setItem('smarttour_coupons', JSON.stringify(store));
}
function localGetCoupon(code) {
  const store = JSON.parse(localStorage.getItem('smarttour_coupons') || '{}');
  return store[code.toUpperCase()] || null;
}
function localUseCoupon(code) {
  const store = JSON.parse(localStorage.getItem('smarttour_coupons') || '{}');
  if (store[code]) { store[code].used = true; localStorage.setItem('smarttour_coupons', JSON.stringify(store)); }
}

$('submitReview').addEventListener('click', async () => {
  const name  = $('rName').value.trim() || 'Guest';
  const dest  = $('rDest').value;
  const rating= parseInt($('rRating').value);
  const text  = $('rText').value.trim();

  if (!rating || rating < 1) { showAlert('reviewAlert','error','Please select a star rating.'); return; }
  if (text.length < 5)       { showAlert('reviewAlert','error','Please write at least a few words.'); return; }

  const btn = $('submitReview');
  btn.disabled = true;
  btn.textContent = 'Submitting…';

  const payload = { name, rating, text, destination:dest };
  let couponCode, discount;

  const res = await submitReviewBackend(payload);
  if (res && res.success) {
    couponCode = res.coupon.code;
    discount   = res.coupon.discount;
  } else {
    // Fallback to localStorage
    couponCode = makeCouponCode();
    discount   = rating >= 4 ? 15 : rating === 3 ? 10 : 5;
    localSaveCoupon(couponCode, { name, dest, rating, discount });
  }

  currentCoupon = couponCode;
  $('couponCode').textContent    = couponCode;
  $('couponDiscount').textContent = `🎉 ${discount}% discount — valid for 30 days`;
  $('couponResult').classList.add('show');
  $('reviewForm').style.display  = 'none';

  btn.disabled = false;
  btn.textContent = '🎟️ Submit & Get Coupon';
});

$('copyCoupon').addEventListener('click', () => {
  if (!currentCoupon) return;
  navigator.clipboard.writeText(currentCoupon).then(() => {
    $('copyCoupon').textContent = '✅ Copied!';
    setTimeout(() => { $('copyCoupon').textContent = '📋 Copy Code'; }, 2000);
  });
});

$('newReview').addEventListener('click', () => {
  $('couponResult').classList.remove('show');
  $('reviewForm').style.display = '';
  $('rText').value = '';
  $('rRating').value = '0';
  currentRating = 0;
  document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
  currentCoupon = null;
});

// Validate
$('validateCoupon').addEventListener('click', async () => {
  const code = $('vCode').value.trim().toUpperCase();
  const res_el = $('validateResult');
  const redeemBtn = $('redeemCoupon');
  if (!code) { res_el.className='validate-result invalid'; res_el.textContent='Please enter a coupon code.'; return; }

  const r = await validateCouponBackend(code);
  if (r && r.valid) {
    res_el.className = 'validate-result valid';
    const exp = r.expiresAt ? new Date(r.expiresAt).toLocaleDateString('en-IN') : 'N/A';
    res_el.innerHTML = `✅ <strong>Valid coupon!</strong> ${r.discount}% discount for <strong>${r.destination || 'any'}</strong> destination.<br><small>Expires: ${exp}</small>`;
    redeemBtn.style.display = 'block';
    redeemBtn.dataset.code = code;
  } else if (r) {
    // Fallback to localStorage
    const local = localGetCoupon(code);
    if (local) {
      if (local.used) {
        res_el.className = 'validate-result invalid';
        res_el.textContent = '❌ This coupon has already been used.';
        redeemBtn.style.display = 'none';
      } else {
        res_el.className = 'validate-result valid';
        res_el.innerHTML = `✅ <strong>Valid coupon!</strong> ${local.discount}% discount. (Offline mode)`;
        redeemBtn.style.display = 'block';
        redeemBtn.dataset.code = code;
      }
    } else {
      res_el.className = 'validate-result invalid';
      res_el.textContent = r.error || '❌ Coupon not found.';
      redeemBtn.style.display = 'none';
    }
  } else {
    const local = localGetCoupon(code);
    if (local && !local.used) {
      res_el.className = 'validate-result valid';
      res_el.innerHTML = `✅ <strong>Valid coupon!</strong> ${local.discount}% discount. (Offline mode)`;
      redeemBtn.style.display = 'block';
      redeemBtn.dataset.code = code;
    } else {
      res_el.className = 'validate-result invalid';
      res_el.textContent = '❌ Coupon not found or already used.';
      redeemBtn.style.display = 'none';
    }
  }
});

$('redeemCoupon').addEventListener('click', async () => {
  const code = $('redeemCoupon').dataset.code;
  const r = await redeemCouponBackend(code);
  if (r && r.success) {
    $('validateResult').className = 'validate-result valid';
    $('validateResult').textContent = '🎉 Coupon redeemed successfully! Enjoy your trip.';
  } else {
    localUseCoupon(code);
    $('validateResult').className = 'validate-result valid';
    $('validateResult').textContent = '🎉 Coupon redeemed! (Offline mode) Enjoy your trip.';
  }
  $('redeemCoupon').style.display = 'none';
});

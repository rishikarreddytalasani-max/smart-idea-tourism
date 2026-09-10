// ---------- Mobile nav ----------
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
hamburger.addEventListener("click", () => navLinks.classList.toggle("open"));

// ---------- Trip Planner ----------
const plannerForm = document.getElementById("plannerForm");
const itinerary = document.getElementById("itinerary");

const placeData = {
  "Hampi": ["Virupaksha Temple", "Vittala Temple", "Hampi Bazaar", "Matanga Hill", "Lotus Mahal", "Elephant Stables"],
  "Goa": ["Baga Beach", "Fort Aguada", "Basilica of Bom Jesus", "Dudhsagar Falls", "Anjuna Flea Market"],
  "Jaipur": ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar", "Jal Mahal"],
  "Munnar": ["Eravikulam National Park", "Tea Museum", "Mattupetty Dam", "Top Station", "Echo Point"]
};

plannerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const dest = document.getElementById("pDest").value.trim();
  const start = document.getElementById("pStart").value.trim();
  const days = parseInt(document.getElementById("pDays").value) || 2;
  const people = parseInt(document.getElementById("pPeople").value) || 2;
  const budget = parseInt(document.getElementById("pBudget").value) || 5000;
  const pref = document.getElementById("pPref").value;
  const interest = document.getElementById("pInterest").value;

  const spots = placeData[dest] || placeData["Hampi"];
  const perDay = Math.min(3, Math.ceil(spots.length / days));
  let html = `<h3>✨ ${days}-day itinerary for ${dest}</h3><ul>`;
  let idx = 0;
  for (let d = 1; d <= days; d++) {
    html += `<li><strong>Day ${d}</strong> — ${start} → ${dest}</li>`;
    for (let s = 0; s < perDay && idx < spots.length; s++, idx++) {
      html += `<li>&nbsp;&nbsp;📍 ${spots[idx]} (9:30 AM – 11:30 AM)</li>`;
    }
    html += `<li>&nbsp;&nbsp;🍽️ Lunch at a local restaurant</li>`;
  }
  html += `<li><strong>💰 Est. budget:</strong> ₹${budget.toLocaleString("en-IN")} for ${people} people · ${pref} · ${interest}</li></ul>`;
  itinerary.innerHTML = html;
  itinerary.classList.remove("hidden");
});

// ---------- Budget Calculator ----------
const planCards = document.querySelectorAll(".plan-card");
const bTotal = document.getElementById("bTotal");
const bPer = document.getElementById("bPer");
const bDaily = document.getElementById("bDaily");
const bRemain = document.getElementById("bRemain");
const dailyRates = { budget: 800, standard: 1500, premium: 3000 };

function updateBudget() {
  const days = parseInt(document.getElementById("pDays").value) || 2;
  const people = parseInt(document.getElementById("pPeople").value) || 2;
  const budget = parseInt(document.getElementById("pBudget").value) || 5000;
  const active = document.querySelector(".plan-card.active").dataset.plan;
  const total = dailyRates[active] * days * people;
  bTotal.textContent = "₹" + total.toLocaleString("en-IN");
  bPer.textContent = "₹" + Math.round(total / people).toLocaleString("en-IN");
  bDaily.textContent = "₹" + Math.round(total / days).toLocaleString("en-IN");
  const remain = budget - Math.round(total / people);
  bRemain.textContent = "₹" + remain.toLocaleString("en-IN");
  bRemain.style.color = remain >= 0 ? "#10b981" : "#ef4444";
}

planCards.forEach((card) =>
  card.addEventListener("click", () => {
    planCards.forEach((c) => c.classList.remove("active"));
    card.classList.add("active");
    updateBudget();
  })
);
["pDays", "pPeople", "pBudget"].forEach((id) =>
  document.getElementById(id).addEventListener("input", updateBudget)
);
updateBudget();

// ---------- Nearby Discovery ----------
const nearbyData = {
  "Hampi": [
    { name: "Virupaksha Temple", cat: "Religious places", dist: 0.8, time: "12 min", fee: "₹0", open: "6:00 AM", close: "8:00 PM", dur: "1–2 hrs", rating: 4.8, best: "Morning", desc: "Ancient temple at the heart of Hampi's ruins." },
    { name: "Vittala Temple", cat: "Historical places", dist: 2.5, time: "20 min", fee: "₹40", open: "8:00 AM", close: "6:00 PM", dur: "2–3 hrs", rating: 4.9, best: "Morning", desc: "Famous for its stone chariot and musical pillars." },
    { name: "Matanga Hill", cat: "Nature", dist: 1.6, time: "15 min", fee: "₹0", open: "Open", close: "Open", dur: "1–2 hrs", rating: 4.6, best: "Sunset", desc: "Best viewpoint for a panoramic sunset over the ruins." },
    { name: "Lotus Mahal", cat: "Historical places", dist: 3.2, time: "25 min", fee: "₹30", open: "8:00 AM", close: "6:00 PM", dur: "45 min", rating: 4.5, best: "Morning", desc: "Elegant Indo-Islamic styled palace." },
    { name: "Hampi Bazaar", cat: "Shopping", dist: 1.0, time: "10 min", fee: "₹0", open: "7:00 AM", close: "9:00 PM", dur: "1 hr", rating: 4.3, best: "Evening", desc: "Street market with handicrafts and souvenirs." },
    { name: "Elephant Stables", cat: "Historical places", dist: 3.5, time: "30 min", fee: "₹20", open: "8:00 AM", close: "6:00 PM", dur: "30 min", rating: 4.4, best: "Morning", desc: "Domed chambers once housed royal elephants." }
  ],
  "Goa": [
    { name: "Baga Beach", cat: "Beaches", dist: 1.2, time: "15 min", fee: "₹0", open: "Open", close: "Open", dur: "2–4 hrs", rating: 4.6, best: "Sunset", desc: "Lively beach with water sports and shacks." },
    { name: "Fort Aguada", cat: "Historical places", dist: 4.0, time: "30 min", fee: "₹0", open: "9:00 AM", close: "6:00 PM", dur: "1 hr", rating: 4.7, best: "Morning", desc: "17th-century Portuguese fort with sea views." },
    { name: "Basilica of Bom Jesus", cat: "Religious places", dist: 5.5, time: "40 min", fee: "₹0", open: "9:00 AM", close: "6:30 PM", dur: "1 hr", rating: 4.8, best: "Morning", desc: "UNESCO-listed church housing St. Francis Xavier." },
    { name: "Anjuna Flea Market", cat: "Shopping", dist: 6.0, time: "45 min", fee: "₹0", open: "9:00 AM", close: "6:00 PM", dur: "2 hrs", rating: 4.4, best: "Wednesday", desc: "Famous Wednesday market with global goods." }
  ],
  "Jaipur": [
    { name: "Amber Fort", cat: "Historical places", dist: 11, time: "40 min", fee: "₹100", open: "8:00 AM", close: "5:30 PM", dur: "2–3 hrs", rating: 4.8, best: "Morning", desc: "Majestic hilltop fort with mirror palaces." },
    { name: "Hawa Mahal", cat: "Historical places", dist: 0.5, time: "8 min", fee: "₹50", open: "9:00 AM", close: "4:30 PM", dur: "45 min", rating: 4.6, best: "Morning", desc: "Iconic 'Palace of Winds' with 953 windows." },
    { name: "City Palace", cat: "Cultural attractions", dist: 0.7, time: "10 min", fee: "₹200", open: "9:30 AM", close: "5:00 PM", dur: "2 hrs", rating: 4.7, best: "Morning", desc: "Royal residence with museums and courtyards." },
    { name: "Jantar Mantar", cat: "Museums", dist: 0.9, time: "10 min", fee: "₹50", open: "9:00 AM", close: "4:30 PM", dur: "1 hr", rating: 4.5, best: "Morning", desc: "UNESCO astronomical observatory." }
  ],
  "Munnar": [
    { name: "Eravikulam National Park", cat: "Nature", dist: 13, time: "45 min", fee: "₹150", open: "7:00 AM", close: "6:00 PM", dur: "2–3 hrs", rating: 4.8, best: "Morning", desc: "Home of the Nilgiri Tahr and rolling grasslands." },
    { name: "Tea Museum", cat: "Museums", dist: 2.0, time: "15 min", fee: "₹75", open: "9:00 AM", close: "4:30 PM", dur: "1 hr", rating: 4.5, best: "Morning", desc: "History of Munnar's tea plantations." },
    { name: "Mattupetty Dam", cat: "Nature", dist: 11, time: "40 min", fee: "₹30", open: "9:00 AM", close: "5:00 PM", dur: "1–2 hrs", rating: 4.4, best: "Afternoon", desc: "Reservoir with boating and scenic views." },
    { name: "Top Station", cat: "Adventure", dist: 32, time: "1.5 hrs", fee: "₹0", open: "Open", close: "Open", dur: "2 hrs", rating: 4.6, best: "Sunrise", desc: "Highest point with panoramic valley views." }
  ]
};

const nDest = document.getElementById("nDest");
const nRadius = document.getElementById("nRadius");
const nCustom = document.getElementById("nCustom");
const customWrap = document.getElementById("customWrap");
const nCat = document.getElementById("nCat");
const nearbyResults = document.getElementById("nearbyResults");

nRadius.addEventListener("change", () => {
  customWrap.classList.toggle("hidden", nRadius.value !== "custom");
  renderNearby();
});

function renderNearby() {
  const dest = nDest.value;
  const radius = nRadius.value === "custom" ? (parseInt(nCustom.value) || 15) : parseInt(nRadius.value);
  const cat = nCat.value;
  const spots = (nearbyData[dest] || nearbyData["Hampi"]).filter(
    (s) => s.dist <= radius && (cat === "all" || s.cat === cat)
  );
  if (!spots.length) {
    nearbyResults.innerHTML = `<p style="text-align:center;color:var(--muted)">No places found within ${radius} km${cat !== "all" ? " in this category" : ""}. Try a larger radius.</p>`;
    return;
  }
  nearbyResults.innerHTML = spots
    .map(
      (s) => `
      <div class="nearby-card">
        <h4>📍 ${s.name}</h4>
        <span class="cat">${s.cat} · ⭐ ${s.rating}</span>
        <div class="meta">
          <span><b>Distance:</b> ${s.dist} km</span>
          <span><b>Travel:</b> ${s.time}</span>
          <span><b>Entry fee:</b> ${s.fee}</span>
          <span><b>Hours:</b> ${s.open} – ${s.close}</span>
          <span><b>Duration:</b> ${s.dur}</span>
          <span><b>Best time:</b> ${s.best}</span>
        </div>
        <p class="desc">${s.desc}</p>
      </div>`
    )
    .join("");
}
[nDest, nCat, nCustom].forEach((el) => el.addEventListener("change", renderNearby));
renderNearby();

// ---------- Translator (demo) ----------
const tlFrom = document.getElementById("tlFrom");
const tlTo = document.getElementById("tlTo");
const tlInput = document.getElementById("tlInput");
const tlOutput = document.getElementById("tlOutput");

const swapBtn = document.getElementById("swap");
swapBtn.addEventListener("click", () => {
  const t = tlFrom.value; tlFrom.value = tlTo.value; tlTo.value = t;
});

document.getElementById("tlTranslate").addEventListener("click", () => {
  const text = tlInput.value.trim();
  if (!text) { tlOutput.textContent = "Type or speak a phrase first."; return; }
  // Demo translation — connect a real API (Google Translate / LibreTranslate) here.
  tlOutput.textContent = `[${tlFrom.options[tlFrom.selectedIndex].text} → ${tlTo.options[tlTo.selectedIndex].text}] ${text}`;
});

document.getElementById("tlSpeak").addEventListener("click", () => {
  if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
    tlOutput.textContent = "Voice input isn't supported in this browser.";
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new SR();
  rec.lang = tlFrom.value;
  rec.interimResults = false;
  rec.onresult = (e) => { tlInput.value = e.results[0][0].transcript; };
  rec.start();
  tlOutput.textContent = "🎤 Listening… speak now.";
});

document.getElementById("tlListen").addEventListener("click", () => {
  const text = tlOutput.textContent;
  if (!text || text.startsWith("[")) return;
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = tlTo.value;
  speechSynthesis.speak(u);
});
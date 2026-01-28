// ==UserScript==
// @name         Komoot → Panoramax popup (Chrome)
// @namespace    https://panoramax.xyz/
// @version      1.0.2
// @description  Bouton Panoramax sur Komoot avec popup type Street View
// @match        https://www.komoot.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  console.log("[Panoramax] Userscript chargé (Chrome OK)");

  let lastCoords = null;
  let panoUrl = null;
  let popup = null;

  /* ---------- STYLE ---------- */
  const style = document.createElement("style");
  style.textContent = `
    #panoramax-popup {
      position: fixed;
      inset: 0;
      z-index: 999999;
      background: rgba(0,0,0,0.6);
    }
    .pmx-overlay {
      position: absolute;
      inset: 5%;
      background: #000;
      border-radius: 12px;
      overflow: hidden;
    }
    .pmx-header {
      height: 40px;
      background: #111;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      font-size: 14px;
    }
    .pmx-header button {
      background: none;
      border: none;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
    }
    #panoramax-popup iframe {
      width: 100%;
      height: calc(100% - 40px);
      border: none;
    }
    .panoramax-btn {
      marginLeft: "0px",
      padding: "0px 0px",
      borderRadius: "0px",
      border: "0px solid #ccc",
      cursor: "pointer",
      fontSize: "10px"
    }
  `;
  document.head.appendChild(style);

  /* ---------- POPUP ---------- */
  function openPopup(url) {
    closePopup();

    popup = document.createElement("div");
    popup.id = "panoramax-popup";
    popup.innerHTML = `
      <div class="pmx-overlay">
        <div class="pmx-header">
          <span>Panoramax</span>
          <button>✕</button>
        </div>
        <iframe src="${url}" allowfullscreen></iframe>
      </div>
    `;

    popup.querySelector("button").onclick = closePopup;
    document.body.appendChild(popup);
  }

  function closePopup() {
    if (popup) popup.remove();
    popup = null;
  }

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closePopup();
  });

  /* ---------- BUTTON ---------- */
  function createOrGetButton() {
    const container = document.querySelector("div.css-1dm4ddc");
    if (!container) return null;

    let btn = container.querySelector(".panoramax-btn");
    if (btn) return btn;

    btn = document.createElement("button");
    btn.className = "panoramax-btn";
    btn.textContent = "📸";

    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (panoUrl) openPopup(panoUrl);
      else alert("Aucune image Panoramax trouvée");
    };

    container.appendChild(btn);
    return btn;
  }

  function distance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    const toRad = angle => angle * Math.PI / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /* ---------- OBSERVER ---------- */
  const observer = new MutationObserver(async () => {
    const coordEl = document.querySelector("p.css-n69bif");
    if (!coordEl) return;

    const m = coordEl.textContent.match(/(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)/);
    if (!m) return;

    const lat = m[1];
    const lon = m[3];
    const key = `${lon},${lat}`;
    if (key === lastCoords) return;

    lastCoords = key;
    panoUrl = null;

    const btn = createOrGetButton();
    if (btn) {
      btn.textContent = "⏳";
      btn.disabled = true;
    }

    try {
      const apiUrl = `https://api.panoramax.xyz/api/search?place_position=${lon},${lat}&place_fov_tolerance=180&sortby=-ts&place_distance=0-50&limit=100`;
      console.log("[Panoramax] API", apiUrl);

      const res = await fetch(apiUrl);
      const data = await res.json();

      if (!data.features?.length) {
        if (btn) btn.textContent = "❌";
        return;
      }

      let min_dist = 0;
      let picture_id = 'NULL';
      data.features.forEach(feature => {
        const coords = feature.geometry.coordinates;
        const type = feature.geometry.type;
        console.log(`Feature de type ${type} avec coordonnées :`, coords);

        if (type === "Point") {
          const slon = coords[0];
          const slat = coords[1];
          console.log(`Latitude : ${slat}, Longitude : ${slon}, à partir de ${lat},${lon}`);
          let distanceBetweenPoints = distance(lat,lon,slat,slon);
          if(distanceBetweenPoints < min_dist || min_dist == 0) {
            min_dist = distanceBetweenPoints;
            picture_id = feature.id;
          }
        }
      });

      panoUrl = `https://api.panoramax.xyz/?focus=pic&pic=${picture_id}`;
      if (btn) {
        btn.textContent = "📸";
        btn.disabled = false;
      }
    } catch (e) {
      console.error("[Panoramax] erreur", e);
      if (btn) btn.textContent = "⚠️";
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();

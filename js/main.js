(() => {
  "use strict";

  // ---------- Events ----------
  const listEl = document.getElementById("events-list");

  const MONTHS_IS = [
    "janúar", "febrúar", "mars", "apríl", "maí", "júní",
    "júlí", "ágúst", "september", "október", "nóvember", "desember"
  ];

  function formatDate(iso) {
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return iso;
    const day = d.getDate();
    const month = MONTHS_IS[d.getMonth()];
    return `${day}. ${month}`;
  }

  function render(events) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcoming = events
      .filter(e => new Date(e.date + "T00:00:00") >= now)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (!upcoming.length) {
      listEl.innerHTML = '<p class="events__empty">Engir viðburðir framundan. Fylgstu með á Facebook.</p>';
      return;
    }

    const mapPinSvg = `<svg class="event__map-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s-6.5-6-6.5-11.5a6.5 6.5 0 1 1 13 0C18.5 16 12 22 12 22z"/><circle cx="12" cy="10.5" r="2.2"/></svg>`;

    listEl.innerHTML = upcoming.map(e => {
      const locationHtml = e.location
        ? `${escapeHtml(e.location)}${e.mapUrl ? ` <a class="event__map" href="${encodeURI(e.mapUrl)}" target="_blank" rel="noopener" aria-label="Opna á korti" title="Opna á korti">${mapPinSvg}</a>` : ""}`
        : "";
      const priceHtml = e.price ? escapeHtml(e.price) : "";
      const metaInner = [locationHtml, priceHtml].filter(Boolean).join(" · ");

      return `
      <article class="event">
        <div class="event__when">
          ${formatDate(e.date)}
          ${e.time ? `<span class="event__when-time">kl. ${escapeHtml(e.time)}</span>` : ""}
        </div>
        <div class="event__body">
          <h3>${escapeHtml(e.title)}</h3>
          <p class="event__meta">${metaInner}</p>
          ${e.description ? `<p class="event__desc">${escapeHtml(e.description)}</p>` : ""}
        </div>
        <div class="event__cta">
          <a class="btn btn--primary" href="${encodeURI(e.bookingUrl || "#")}" target="_blank" rel="noopener">Bóka</a>
        </div>
      </article>
    `;
    }).join("");
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  fetch("data/events.json", { cache: "no-cache" })
    .then(r => {
      if (!r.ok) throw new Error("fetch failed");
      return r.json();
    })
    .then(render)
    .catch(() => {
      listEl.innerHTML = '<p class="events__empty">Ekki tókst að sækja viðburði. Fylgstu með á Facebook.</p>';
    });
})();

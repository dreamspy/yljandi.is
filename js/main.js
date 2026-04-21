(() => {
  "use strict";

  // ---------- Carousel ----------
  const track = document.getElementById("carousel-track");
  const dotsEl = document.getElementById("carousel-dots");

  if (track && dotsEl) {
    const slides = Array.from(track.querySelectorAll(".carousel__slide"));
    let current = 0;
    let timer = null;
    const INTERVAL = 5500;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "carousel__dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Mynd ${i + 1}`);
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", () => go(i, true));
      dotsEl.appendChild(dot);
    });

    const dots = Array.from(dotsEl.children);

    function go(next, manual) {
      slides[current].classList.remove("is-active");
      dots[current].classList.remove("is-active");
      current = (next + slides.length) % slides.length;
      slides[current].classList.add("is-active");
      dots[current].classList.add("is-active");
      if (manual) restart();
    }

    function tick() { go(current + 1, false); }
    function start() { timer = setInterval(tick, INTERVAL); }
    function stop()  { clearInterval(timer); }
    function restart() { stop(); start(); }

    track.addEventListener("mouseenter", stop);
    track.addEventListener("mouseleave", start);
    start();
  }

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

    listEl.innerHTML = upcoming.map(e => `
      <article class="event">
        <div class="event__when">
          ${formatDate(e.date)}
          ${e.time ? `<span class="event__when-time">kl. ${escapeHtml(e.time)}</span>` : ""}
        </div>
        <div class="event__body">
          <h3>${escapeHtml(e.title)}</h3>
          <p class="event__meta">
            ${[e.location, e.price].filter(Boolean).map(escapeHtml).join(" · ")}
          </p>
          ${e.description ? `<p class="event__desc">${escapeHtml(e.description)}</p>` : ""}
        </div>
        <div class="event__cta">
          <a class="btn btn--primary" href="${encodeURI(e.bookingUrl || "#")}" target="_blank" rel="noopener">Bóka</a>
        </div>
      </article>
    `).join("");
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

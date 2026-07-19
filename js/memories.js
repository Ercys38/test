/* ============================================================
   MEMORIES.JS — Partie 2 : Nos souvenirs
   ============================================================ */

const MEMORY_STYLE_CLASSES = ["memory--straight", "memory--tilt-left", "memory--tilt-right", "memory--polaroid", "memory--ribbon"];

function initMemories() {
  const track = document.getElementById("memoriesTrack");
  if (!track) return;

  track.innerHTML = CONFIG.MEMORIES.map((m, idx) => {
    const styleClass = MEMORY_STYLE_CLASSES[idx % MEMORY_STYLE_CLASSES.length];
    const offsetClass = idx % 2 === 0 ? "memory--up" : "memory--down";
    const caption = m.caption ? `<p class="memory__caption">${m.caption}</p>` : "";
    const type = m.type || "photo"; // par défaut "photo" si non précisé

    // "moment" = étape du chemin sans photo ni vidéo (ex : une période,
    // "aujourd'hui"...) : une petite carte décorative avec juste un texte.
    if (type === "moment") {
      return `
        <article class="memory memory--moment ${offsetClass}">
          <div class="memory__moment-card texture-orientale">
            <span class="memory__moment-icon" aria-hidden="true">✨</span>
          </div>
          <p class="memory__date">${m.date}</p>
          ${caption}
        </article>
      `;
    }

    // "video" = un souvenir filmé. On réutilise le même habillage
    // (cadre polaroid/incliné/ruban) qu'une photo, avec une vidéo dedans.
    if (type === "video") {
      return `
        <article class="memory ${styleClass} ${offsetClass}">
          <div class="memory__photo-wrap memory__photo-wrap--video">
            <video class="memory__photo" src="${m.video}" poster="${m.poster || ""}"
                   controls playsinline preload="metadata"
                   onerror="this.onerror=null;this.poster='assets/images/placeholder-photo.svg';">
            </video>
          </div>
          <p class="memory__date">${m.date}</p>
          ${caption}
        </article>
      `;
    }

    // "photo" (cas par défaut)
    return `
      <article class="memory ${styleClass} ${offsetClass}">
        <div class="memory__photo-wrap">
          <img class="memory__photo" src="${m.img}" alt=""
               loading="lazy"
               onerror="this.onerror=null;this.src='assets/images/placeholder-photo.svg';">
        </div>
        <p class="memory__date">${m.date}</p>
        ${caption}
      </article>
    `;
  }).join("");

  const items = track.querySelectorAll(".memory");

  // Apparition douce de chaque souvenir au fil du défilement
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("memory--revealed");
      });
    },
    { root: track, threshold: 0.3 }
  );
  items.forEach((item) => revealObserver.observe(item));

  // Une fois le dernier souvenir atteint, cette partie est "terminée"
  // et débloque la suite (la lettre).
  const lastItem = items[items.length - 1];
  if (lastItem) {
    const doneObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            saveProgress({ memoriesDone: true });
            if (typeof refreshMenuLocks === "function") refreshMenuLocks();
            doneObserver.disconnect();
          }
        });
      },
      { root: track, threshold: 0.55 }
    );
    doneObserver.observe(lastItem);
  }

  // Molette de souris verticale -> défilement horizontal
  // (le trackpad et le doigt sur tablette défilent nativement à l'horizontale)
  track.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        track.scrollLeft += e.deltaY;
      }
    },
    { passive: false }
  );

  initSoundToggle();
}

function initSoundToggle() {
  const btn = document.getElementById("soundToggle");
  const audio = document.getElementById("bgMusic");
  if (!btn || !audio) return;
  btn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    btn.textContent = audio.muted ? "🔇" : "🔊";
    btn.setAttribute("aria-pressed", String(!audio.muted));
  });
}

function playMemoriesMusic() {
  const audio = document.getElementById("bgMusic");
  if (!audio) return;
  audio.play().catch(() => {
    // Lecture automatique bloquée par le navigateur, ou musique pas
    // encore ajoutée : pas grave, le bouton son permet de relancer.
  });
}

function pauseMemoriesMusic() {
  const audio = document.getElementById("bgMusic");
  if (audio) audio.pause();
}

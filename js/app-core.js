/* ============================================================
   APP-CORE.JS
   Fonctions partagées par toutes les pages :
   - progression sauvegardée (localStorage)
   - passage d'un écran à l'autre (fondu enchaîné)
   - champ d'étoiles de la page d'accueil
   - petits utilitaires (pétales, message aléatoire...)
   ============================================================ */

const PROGRESS_KEY = "jasmineBirthdayProgress";

function getProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    const defaults = {
      lockPassed: false,
      introWatched: false,
      quizDone: false,
      memoriesDone: false,
      letterDone: false,
      surpriseSeen: false,
    };
    return raw ? Object.assign(defaults, JSON.parse(raw)) : defaults;
  } catch (err) {
    console.warn("Progression illisible, on repart de zéro.", err);
    return {
      lockPassed: false, introWatched: false, quizDone: false,
      memoriesDone: false, letterDone: false, surpriseSeen: false,
    };
  }
}

function saveProgress(partial) {
  const current = getProgress();
  const updated = Object.assign(current, partial);
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Impossible d'enregistrer la progression (stockage local indisponible).", err);
  }
  return updated;
}

// ------------------------------------------------------------
// NAVIGATION ENTRE ECRANS
// ------------------------------------------------------------

function showScreen(id) {
  const current = document.querySelector(".screen--active");
  const next = document.getElementById(id);
  if (!next || current === next) return;

  if (typeof pauseMemoriesMusic === "function") pauseMemoriesMusic();

  if (current) {
    current.classList.remove("screen--active");
    current.classList.add("screen--leaving");
    setTimeout(() => current.classList.remove("screen--leaving"), 700);
  }
  next.classList.add("screen--active");

  if (id === "screen-menu" && typeof refreshMenuLocks === "function") {
    refreshMenuLocks();
  }
  if (id === "screen-memories" && typeof playMemoriesMusic === "function") {
    playMemoriesMusic();
  }
  if (id === "screen-quiz" && typeof resetQuiz === "function") {
    resetQuiz();
  }
  if (id === "screen-letter" && typeof resetLetter === "function") {
    resetLetter();
  }
}

// ------------------------------------------------------------
// CHAMP D'ETOILES (page d'accueil)
// ------------------------------------------------------------

function initStars() {
  const field = document.getElementById("starsField");
  if (!field) return;
  const total = 46;
  for (let i = 0; i < total; i++) {
    const star = document.createElement("span");
    star.className = "star" + (Math.random() > 0.7 ? " star--derive" : "");
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = (Math.random() * 4).toFixed(2) + "s";
    star.style.width = star.style.height = (2 + Math.random() * 2.5).toFixed(1) + "px";
    field.appendChild(star);
  }
}

// ------------------------------------------------------------
// UTILITAIRES
// ------------------------------------------------------------

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Regroupe les émojis type "❤️" (cœur + variateur) pour que
// l'effet lettre par lettre ne les coupe pas en deux morceaux.
function splitIntoTypingUnits(text) {
  const raw = Array.from(text);
  const units = [];
  for (let i = 0; i < raw.length; i++) {
    if (raw[i + 1] === "\uFE0F") {
      units.push(raw[i] + raw[i + 1]);
      i++;
    } else {
      units.push(raw[i]);
    }
  }
  return units;
}

function spawnPetals(container, count) {
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement("span");
    petal.className = "petale";
    petal.style.left = Math.random() * 100 + "%";
    petal.style.animationDuration = (2.6 + Math.random() * 2).toFixed(2) + "s";
    petal.style.animationDelay = (Math.random() * 0.6).toFixed(2) + "s";
    petal.style.background = Math.random() > 0.5 ? "var(--dore-clair)" : "var(--bleu-turquoise-clair)";
    container.appendChild(petal);
    setTimeout(() => petal.remove(), 5200);
  }
}

// Attache le comportement "retour au menu" à tous les boutons
// portant la classe .btn-return-menu, où qu'ils soient sur le site.
function attachReturnButtons() {
  document.querySelectorAll(".btn-return-menu").forEach((btn) => {
    btn.addEventListener("click", () => showScreen("screen-menu"));
  });
}

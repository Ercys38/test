/* ============================================================
   LETTER.JS — Partie 3 : Une lettre pour toi
   ============================================================ */

let letterOpened = false;
let letterTypeInterval = null;

function resetLetter() {
  letterOpened = false;
  clearInterval(letterTypeInterval);
  const envelope = document.getElementById("envelope");
  const hint = document.getElementById("letterHint");
  const textEl = document.getElementById("letterText");
  const doneBtn = document.getElementById("btnLetterDone");
  if (envelope) envelope.classList.remove("envelope--open");
  if (hint) hint.classList.remove("letter__hint--hidden");
  if (textEl) textEl.textContent = "";
  if (doneBtn) doneBtn.hidden = true;
}

function initLetter() {
  const envelope = document.getElementById("envelope");
  const hint = document.getElementById("letterHint");
  const textEl = document.getElementById("letterText");
  const doneBtn = document.getElementById("btnLetterDone");
  if (!envelope || !textEl || !doneBtn) return;

  function openEnvelope() {
    if (letterOpened) return;
    letterOpened = true;
    envelope.classList.add("envelope--open");
    if (hint) hint.classList.add("letter__hint--hidden");

    setTimeout(() => {
      typeLetterText(textEl, CONFIG.LETTER_TEXT, () => {
        doneBtn.hidden = false;
        saveProgress({ letterDone: true });
        if (typeof refreshMenuLocks === "function") refreshMenuLocks();
      });
    }, 1050); // laisse le temps à l'animation d'ouverture de se terminer
  }

  envelope.addEventListener("click", openEnvelope);
  // L'enveloppe est un <div role="button">, donc le clavier (Entrée / Espace)
  // ne déclenche pas de clic automatiquement : on le gère nous-mêmes.
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEnvelope();
    }
  });
}

function typeLetterText(el, text, onDone) {
  el.textContent = "";
  const units = splitIntoTypingUnits(text);
  let i = 0;
  clearInterval(letterTypeInterval);
  letterTypeInterval = setInterval(() => {
    el.textContent += units[i];
    i++;
    if (i >= units.length) {
      clearInterval(letterTypeInterval);
      if (onDone) onDone();
    }
  }, CONFIG.LETTER_TYPE_SPEED_MS);
}

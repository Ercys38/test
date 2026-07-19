/* ============================================================
   SURPRISE.JS — Partie 4 : Dernière surprise
   Le verrouillage par date/heure est géré dans menu.js
   (fonctions getMenuLockReason / isSurpriseUnlockTimeReached).
   Ici on gère uniquement ce qui se passe SUR cet écran.
   ============================================================ */

function initSurprise() {
  const textEl = document.querySelector("#screen-surprise .surprise__text");
  if (textEl) textEl.textContent = CONFIG.SURPRISE_REVEAL_MESSAGE;

  const video = document.getElementById("finalVideo");
  if (video) {
    video.addEventListener("ended", () => {
      saveProgress({ surpriseSeen: true });
      if (typeof refreshMenuLocks === "function") refreshMenuLocks();
    });
  }
}

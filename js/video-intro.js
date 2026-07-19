/* ============================================================
   VIDEO-INTRO.JS — Page 3
   ============================================================ */

function initVideoIntro() {
  const video = document.getElementById("introVideo");
  const btn = document.getElementById("btnContinueAfterVideo");
  const skip = document.getElementById("introSkip");
  if (!video || !btn) return;

  function reveal() {
    btn.hidden = false;
    if (skip) skip.hidden = true;
  }

  video.addEventListener("ended", reveal);

  // Filet de sécurité : si la vidéo n'est pas encore ajoutée (ou ne
  // peut pas être lue), on affiche quand même le bouton après un
  // court délai pour ne jamais bloquer la navigation.
  video.addEventListener("error", () => setTimeout(reveal, 1200));

  if (skip) skip.addEventListener("click", reveal);

  btn.addEventListener("click", () => {
    saveProgress({ introWatched: true });
    showScreen("screen-menu");
  });
}

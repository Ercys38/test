/* ============================================================
   MAIN.JS — Point de démarrage du site
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Mise en place des écrans qui ne dépendent pas de la progression
  initLock();
  initVideoIntro();
  initMenu();
  initLetter();
  initMemories();
  initSurprise();
  attachReturnButtons();

  const progress = getProgress();

  if (progress.lockPassed && progress.introWatched) {
    // Déjà venu(e) précédemment : on va directement au menu pour ne
    // pas redemander le code à chaque visite.
    // (Pour désactiver ce comportement et toujours repartir de
    // l'accueil, supprime simplement ce bloc "if".)
    document.getElementById("screen-home").classList.remove("screen--active");
    document.getElementById("screen-menu").classList.add("screen--active");
    refreshMenuLocks();
  } else {
    initStars();
    initHome();
  }

  // Vérifie régulièrement si l'heure de la surprise finale est
  // arrivée, pour débloquer l'élément du menu sans avoir à recharger
  // la page.
  setInterval(() => {
    if (typeof refreshMenuLocks === "function") refreshMenuLocks();
  }, 30000);
});

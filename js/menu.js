/* ============================================================
   MENU.JS — Page 4 : menu principal
   Ordre de déblocage : quiz -> souvenirs -> lettre -> surprise
   ============================================================ */

function isSurpriseUnlockTimeReached() {
  return new Date() >= CONFIG.SURPRISE_UNLOCK_DATETIME;
}

// Renvoie null si l'élément est accessible, ou un message
// expliquant pourquoi il est verrouillé.
function getMenuLockReason(item, progress) {
  const requires = item.dataset.requires;
  if (requires && !progress[requires]) {
    return "Termine d'abord les étapes précédentes pour débloquer ceci ✨";
  }
  if (item.dataset.timeGated === "true" && !isSurpriseUnlockTimeReached()) {
    return CONFIG.SURPRISE_LOCKED_MESSAGE;
  }
  return null;
}

function refreshMenuLocks() {
  const progress = getProgress();
  document.querySelectorAll(".menu__item").forEach((item) => {
    const reason = getMenuLockReason(item, progress);
    item.classList.toggle("menu__item--locked", !!reason);

    const statusEl = item.querySelector("[data-status]");
    const doneKey = item.dataset.doneKey;
    if (statusEl) {
      statusEl.textContent = doneKey && progress[doneKey] ? "Terminé ✓" : "";
    }
  });
}

function showLockMessage(item, text) {
  const msgEl = item.querySelector(".menu__lockmsg");
  item.classList.add("menu__item--shake");
  setTimeout(() => item.classList.remove("menu__item--shake"), 550);
  if (!msgEl) return;
  msgEl.textContent = text;
  msgEl.classList.add("menu__lockmsg--visible");
  clearTimeout(msgEl._hideTimer);
  msgEl._hideTimer = setTimeout(() => {
    msgEl.classList.remove("menu__lockmsg--visible");
  }, 2600);
}

function initMenu() {
  const items = document.querySelectorAll(".menu__item");
  items.forEach((item) => {
    item.addEventListener("click", () => {
      const progress = getProgress();
      const reason = getMenuLockReason(item, progress);
      if (reason) {
        showLockMessage(item, reason);
        return;
      }
      showScreen(item.dataset.target);
    });
  });
  refreshMenuLocks();
}

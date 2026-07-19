/* ============================================================
   LOCK.JS — Page 2 : vérification du code secret
   ============================================================ */

function initLock() {
  const keypad = document.getElementById("lockKeypad");
  const display = document.getElementById("lockDisplay");
  const messageEl = document.getElementById("lockMessage");
  if (!keypad || !display || !messageEl) return;

  const digitEls = display.querySelectorAll(".lock__digit");
  let entered = "";

  function updateDisplay() {
    digitEls.forEach((d, i) => {
      d.textContent = entered[i] || "";
    });
  }

  function checkCode() {
    if (entered === CONFIG.SECRET_CODE) {
      messageEl.textContent = "";
      saveProgress({ lockPassed: true });
      setTimeout(() => {
        entered = "";
        updateDisplay();
        showScreen("screen-video-intro");
      }, 250);
    } else {
      display.classList.add("lock__display--shake");
      messageEl.textContent = pickRandom(CONFIG.LOCK_WRONG_MESSAGES);
      if (navigator.vibrate) navigator.vibrate(180);
      setTimeout(() => {
        display.classList.remove("lock__display--shake");
        entered = "";
        updateDisplay();
      }, 650);
    }
  }

  keypad.addEventListener("click", (e) => {
    const key = e.target.closest(".lock__key");
    if (!key) return;
    const value = key.dataset.value;

    if (value === "clear") {
      entered = entered.slice(0, -1);
      updateDisplay();
      return;
    }
    if (entered.length >= 4) return;

    entered += value;
    updateDisplay();
    if (entered.length === 4) {
      setTimeout(checkCode, 180);
    }
  });
}

/* ============================================================
   HOME.JS — Page 1 : effet d'écriture des 3 phrases
   FR -> TR -> Darija (arabe), sans boucle, la dernière reste affichée
   ============================================================ */

function initHome() {
  const el = document.getElementById("homePhrase");
  const btn = document.getElementById("btnDiscover");
  if (!el || !btn) return;

  let index = 0;

  function typeCurrentPhrase() {
    const phrase = CONFIG.HOME_PHRASES[index];
    el.setAttribute("dir", phrase.dir);
    el.setAttribute("lang", phrase.lang);
    el.classList.toggle("home__phrase--arabic", phrase.lang === "ar");
    el.classList.remove("home__phrase--fade-out");
    el.textContent = "";

    const units = splitIntoTypingUnits(phrase.text);
    let u = 0;
    const interval = setInterval(() => {
      el.textContent += units[u];
      u++;
      if (u >= units.length) {
        clearInterval(interval);
        onPhraseTyped();
      }
    }, CONFIG.HOME_TYPE_SPEED_MS);
  }

  function onPhraseTyped() {
    const isLast = index === CONFIG.HOME_PHRASES.length - 1;
    if (isLast) {
      // Dernière phrase (Darija) : elle reste affichée, on révèle le bouton
      setTimeout(revealButton, 900);
      return;
    }
    setTimeout(() => {
      el.classList.add("home__phrase--fade-out");
      setTimeout(() => {
        index++;
        typeCurrentPhrase();
      }, CONFIG.HOME_FADE_MS);
    }, CONFIG.HOME_HOLD_MS);
  }

  function revealButton() {
    btn.hidden = false;
    requestAnimationFrame(() => btn.classList.add("home__cta--visible"));
  }

  btn.addEventListener("click", () => showScreen("screen-lock"));

  typeCurrentPhrase();
}

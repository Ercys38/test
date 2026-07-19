/* ============================================================
   QUIZ.JS — Partie 1 : Notre journée
   ============================================================ */

let quizIndex = 0;

function resetQuiz() {
  quizIndex = 0;
  const card = document.getElementById("quizCard");
  const final = document.getElementById("quizFinal");
  const petals = document.getElementById("quizPetals");
  if (final) final.hidden = true;
  if (card) card.hidden = false;
  if (petals) petals.innerHTML = "";
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const card = document.getElementById("quizCard");
  if (!card) return;
  const q = CONFIG.QUIZ_QUESTIONS[quizIndex];

  card.innerHTML = `
    <p class="quiz__counter">Question ${quizIndex + 1} / ${CONFIG.QUIZ_QUESTIONS.length}</p>
    <h3 class="quiz__question">${q.question}</h3>
    <div class="quiz__answers">
      ${q.answers.map((a, i) => `<button class="quiz__answer" data-idx="${i}" type="button">${a}</button>`).join("")}
    </div>
    <p class="quiz__feedback" aria-live="polite"></p>
  `;

  card.querySelectorAll(".quiz__answer").forEach((btn) => {
    btn.addEventListener("click", onQuizAnswer);
  });
}

function onQuizAnswer(e) {
  const btn = e.currentTarget;
  const idx = Number(btn.dataset.idx);
  const q = CONFIG.QUIZ_QUESTIONS[quizIndex];
  const feedback = document.querySelector("#quizCard .quiz__feedback");

  if (idx === q.correctIndex) {
    btn.classList.add("quiz__answer--correct");
    if (feedback) feedback.textContent = "";
    setTimeout(() => {
      quizIndex++;
      if (quizIndex >= CONFIG.QUIZ_QUESTIONS.length) {
        finishQuiz();
      } else {
        renderQuizQuestion();
      }
    }, 550);
  } else {
    btn.classList.add("quiz__answer--wrong");
    if (feedback) feedback.textContent = pickRandom(CONFIG.QUIZ_WRONG_MESSAGES);
    setTimeout(() => btn.classList.remove("quiz__answer--wrong"), 450);
  }
}

function finishQuiz() {
  const card = document.getElementById("quizCard");
  const final = document.getElementById("quizFinal");
  if (card) card.hidden = true;
  if (final) {
    final.hidden = false;
    const textEl = final.querySelector(".quiz__final-text");
    if (textEl) textEl.textContent = CONFIG.QUIZ_FINAL_MESSAGE;
  }
  spawnPetals(document.getElementById("quizPetals"), 22);
  saveProgress({ quizDone: true });
  refreshMenuLocks();
}

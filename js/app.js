// ==========================================================
// Fossacava Quiz — logica applicativa
// ==========================================================

const LEVEL_LABELS = {
  junior: "10–13 anni · Apprendista Storico",
  medio: "14–16 anni · Esploratore d'Impero",
  senior: "17–18 anni · Magister Historiae"
};

const MODE_LABELS = {
  multipla: "Risposta Multipla",
  vf: "Vero o Falso",
  immagine: "Indovina l'Immagine",
  mix: "Mix"
};

// Quante domande pescare da ciascuna categoria in modalità "mix" (totale 20),
// in proporzione alla numerosità delle banche dati (10 multipla, 10 vf, 8 immagine).
const MIX_COUNTS = { multipla: 7, vf: 7, immagine: 6 };

const state = {
  level: null,
  mode: null,
  questions: [],
  index: 0,
  score: 0,
  answered: false
};

// ---------- Utilità ----------

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.hidden = true);
  document.getElementById(id).hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateTopbarStatus() {
  const bar = document.getElementById("topbar-status");
  if (!state.level) { bar.hidden = true; return; }
  bar.hidden = false;
  document.getElementById("status-level").textContent = LEVEL_LABELS[state.level].split(" · ")[0];
  document.getElementById("status-mode").textContent = state.mode ? MODE_LABELS[state.mode] : "";
  document.getElementById("status-mode").hidden = !state.mode;
}

// ---------- Navigazione ----------

function goHome() {
  state.level = null;
  state.mode = null;
  updateTopbarStatus();
  showScreen("screen-home");
}

function goModeSelect() {
  state.mode = null;
  document.getElementById("mode-level-name").textContent = LEVEL_LABELS[state.level];
  updateTopbarStatus();
  showScreen("screen-mode");
}

function buildMixQuestions(level) {
  const pools = QUESTIONS[level];
  const picked = [];
  Object.entries(MIX_COUNTS).forEach(([type, count]) => {
    picked.push(...shuffle(pools[type]).slice(0, count));
  });
  return shuffle(picked);
}

function startGame(mode) {
  state.mode = mode;
  state.questions = mode === "mix" ? buildMixQuestions(state.level) : shuffle(QUESTIONS[state.level][mode]);
  state.index = 0;
  state.score = 0;
  state.answered = false;
  updateTopbarStatus();
  document.getElementById("q-total").textContent = state.questions.length;
  showScreen("screen-game");
  renderQuestion();
}

// ---------- Rendering domanda ----------

function renderQuestion() {
  state.answered = false;
  const q = state.questions[state.index];

  document.getElementById("q-index").textContent = state.index + 1;
  document.getElementById("q-score").textContent = state.score;
  const pct = (state.index / state.questions.length) * 100;
  document.getElementById("progress-fill").style.width = pct + "%";

  document.getElementById("game-question").textContent = q.q;

  const imageWrap = document.getElementById("quiz-image-wrap");
  if (q.img) {
    imageWrap.hidden = false;
    const img = document.getElementById("quiz-image");
    img.src = q.img;
    img.alt = "Immagine relativa alla domanda";
  } else {
    imageWrap.hidden = true;
  }

  const answersEl = document.getElementById("answers");
  answersEl.innerHTML = "";

  if (q.type === "vf") {
    buildAnswerButton(answersEl, "V", "Vero", true, q, q.answer === true);
    buildAnswerButton(answersEl, "F", "Falso", false, q, q.answer === false);
  } else {
    // Rimescola l'ordine delle opzioni ad ogni visualizzazione, così la
    // risposta corretta non si trova sempre nella stessa posizione.
    const letters = ["A", "B", "C", "D"];
    const order = shuffle(q.options.map((_, i) => i));
    order.forEach((originalIndex, displayIndex) => {
      const isCorrect = originalIndex === q.answer;
      buildAnswerButton(answersEl, letters[displayIndex], q.options[originalIndex], originalIndex, q, isCorrect);
    });
  }

  document.getElementById("feedback").hidden = true;
}

function buildAnswerButton(container, letter, text, value, q, isCorrect) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "answer-btn";
  btn.dataset.correct = isCorrect ? "true" : "false";
  btn.innerHTML = `<span class="answer-letter">${letter}</span><span>${text}</span>`;
  btn.addEventListener("click", () => handleAnswer(isCorrect, btn, q));
  container.appendChild(btn);
}

function handleAnswer(isCorrect, btn, q) {
  if (state.answered) return;
  state.answered = true;

  const allBtns = document.querySelectorAll(".answer-btn");
  allBtns.forEach(b => b.disabled = true);
  allBtns.forEach(b => {
    if (b.dataset.correct === "true") b.classList.add("is-correct");
  });
  if (!isCorrect) btn.classList.add("is-wrong");

  if (isCorrect) state.score++;
  document.getElementById("q-score").textContent = state.score;

  const verdict = document.getElementById("feedback-verdict");
  verdict.textContent = isCorrect ? "Risposta corretta!" : "Risposta sbagliata.";
  verdict.className = "feedback-verdict " + (isCorrect ? "correct" : "wrong");
  document.getElementById("feedback-info").textContent = q.info || "";
  document.getElementById("feedback").hidden = false;

  const isLast = state.index === state.questions.length - 1;
  document.getElementById("btn-next").textContent = isLast ? "Vedi il risultato →" : "Avanti →";
}

function nextQuestion() {
  state.index++;
  if (state.index >= state.questions.length) {
    showResults();
  } else {
    renderQuestion();
  }
}

// ---------- Risultati ----------

function showResults() {
  const total = state.questions.length;
  const score = state.score;
  const pct = Math.round((score / total) * 100);

  document.getElementById("progress-fill").style.width = "100%";
  document.getElementById("results-score-num").textContent = score;
  document.getElementById("results-score-total").textContent = total;

  let message;
  if (pct === 100) message = "Punteggio pieno! Sei un vero magister historiae, conosci Roma e Fossacava a menadito.";
  else if (pct >= 80) message = "Ottimo lavoro! Conosci molto bene la storia di Roma e della cava di Fossacava.";
  else if (pct >= 60) message = "Buon risultato! Le basi ci sono, con un po' di ripasso puoi arrivare in cima.";
  else if (pct >= 40) message = "Un discreto inizio. Rigioca per scoprire altre curiosità su Roma e Fossacava.";
  else message = "Si può fare di meglio! Prova ancora: ogni domanda sbagliata nasconde una curiosità da scoprire.";

  document.getElementById("results-message").textContent = message;
  showScreen("screen-results");
}

// ---------- Event binding ----------

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-logo").addEventListener("click", goHome);
  document.getElementById("btn-back-home").addEventListener("click", goHome);
  document.getElementById("btn-back-mode").addEventListener("click", goModeSelect);
  document.getElementById("btn-change-mode").addEventListener("click", goModeSelect);
  document.getElementById("btn-change-level").addEventListener("click", goHome);
  document.getElementById("btn-next").addEventListener("click", nextQuestion);
  document.getElementById("btn-replay").addEventListener("click", () => startGame(state.mode));

  document.querySelectorAll(".card-level").forEach(card => {
    card.addEventListener("click", () => {
      state.level = card.dataset.level;
      goModeSelect();
    });
  });

  document.querySelectorAll(".card-mode").forEach(card => {
    card.addEventListener("click", () => {
      startGame(card.dataset.mode);
    });
  });
});

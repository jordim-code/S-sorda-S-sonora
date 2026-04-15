const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");

const playerNameInput = document.getElementById("player-name");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

const displayName = document.getElementById("display-name");
const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const livesEl = document.getElementById("lives");
const timeEl = document.getElementById("time");
const questionCategoryEl = document.getElementById("question-category");
const questionTextEl = document.getElementById("question-text");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const progressTextEl = document.getElementById("progress-text");
const progressFillEl = document.getElementById("progress-fill");

const dragAreaEl = document.getElementById("drag-area");
const wordBankEl = document.getElementById("word-bank");
const sonoraZoneEl = document.getElementById("sonora-zone");
const sordaZoneEl = document.getElementById("sorda-zone");
const checkDragBtn = document.getElementById("check-drag-btn");

const finalNameEl = document.getElementById("final-name");
const finalScoreEl = document.getElementById("final-score");
const finalCorrectEl = document.getElementById("final-correct");
const finalBestStreakEl = document.getElementById("final-best-streak");
const finalMessageEl = document.getElementById("final-message");

const VIDES_INICIALS = 3;
const TEMPS_PER_PREGUNTA = 30;
const PUNTS_PER_ENCERT = 10;
const BONUS_RATXA = 10;

let playerName = "";
let preguntesBarrejades = [];
let currentQuestionIndex = 0;
let score = 0;
let lives = VIDES_INICIALS;
let streak = 0;
let bestStreak = 0;
let correctAnswers = 0;
let timer = null;
let timeLeft = TEMPS_PER_PREGUNTA;
let bloquejat = false;
let draggedWordId = null;

function barrejaArray(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function mostrarPantalla(screen) {
  startScreen.classList.remove("active");
  gameScreen.classList.remove("active");
  endScreen.classList.remove("active");
  screen.classList.add("active");
}

function actualitzarHUD() {
  displayName.textContent = playerName;
  scoreEl.textContent = score;
  streakEl.textContent = streak;
  livesEl.textContent = "❤️".repeat(lives) + "🖤".repeat(VIDES_INICIALS - lives);
  progressTextEl.textContent = `Pregunta ${currentQuestionIndex + 1} de ${preguntesBarrejades.length}`;
  progressFillEl.style.width = `${(currentQuestionIndex / preguntesBarrejades.length) * 100}%`;
}

function iniciarPartida() {
  playerName = playerNameInput.value.trim();

  if (!playerName) {
    alert("Escriu un nom abans de començar.");
    return;
  }

  preguntesBarrejades = barrejaArray(PREGUNTES);
  currentQuestionIndex = 0;
  score = 0;
  lives = VIDES_INICIALS;
  streak = 0;
  bestStreak = 0;
  correctAnswers = 0;
  bloquejat = false;

  mostrarPantalla(gameScreen);
  carregarPregunta();
}

function carregarPregunta() {
  if (currentQuestionIndex >= preguntesBarrejades.length || lives <= 0) {
    acabarPartida();
    return;
  }

  bloquejat = false;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";

  const preguntaActual = preguntesBarrejades[currentQuestionIndex];

  actualitzarHUD();

  questionCategoryEl.textContent = preguntaActual.categoria;
  questionTextEl.textContent = preguntaActual.pregunta;

  answersEl.innerHTML = "";
  wordBankEl.innerHTML = "";
  sonoraZoneEl.innerHTML = "";
  sordaZoneEl.innerHTML = "";

  if (preguntaActual.tipus === "opcions") {
    renderPreguntaOpcions(preguntaActual);
  } else if (preguntaActual.tipus === "arrossegar") {
    renderPreguntaArrossegar(preguntaActual);
  }

  iniciarTemporitzador();
}

function renderPreguntaOpcions(preguntaActual) {
  dragAreaEl.classList.add("hidden");
  answersEl.classList.remove("hidden");

  preguntaActual.opcions.forEach((opcio, index) => {
    const btn = document.createElement("button");
    btn.classList.add("answer-btn");
    btn.textContent = opcio;
    btn.addEventListener("click", () => respondreOpcions(index));
    answersEl.appendChild(btn);
  });
}

function renderPreguntaArrossegar(preguntaActual) {
  answersEl.classList.add("hidden");
  dragAreaEl.classList.remove("hidden");

  const paraulesBarrejades = barrejaArray(preguntaActual.centre);

  paraulesBarrejades.forEach((paraula, index) => {
    const chip = document.createElement("div");
    chip.classList.add("word-chip");
    chip.textContent = paraula;
    chip.draggable = true;
    chip.id = `word-${currentQuestionIndex}-${index}`;
    chip.dataset.word = paraula;

    chip.addEventListener("dragstart", (e) => {
      draggedWordId = chip.id;
      e.dataTransfer.setData("text/plain", chip.id);
    });

    wordBankEl.appendChild(chip);
  });

  configurarZonesArrossegament();
}

function configurarZonesArrossegament() {
  const contenidors = [
    wordBankEl,
    sonoraZoneEl,
    sordaZoneEl
  ];

  contenidors.forEach((contenidor) => {
    contenedorDragEvents(contenidor);
  });
}

function contenedorDragEvents(contenidor) {
  contenedor.addEventListener("dragover", (e) => {
    e.preventDefault();
    contenedor.parentElement.classList.add("drag-over");
  });

  contenedor.addEventListener("dragleave", () => {
    contenedor.parentElement.classList.remove("drag-over");
  });

  contenedor.addEventListener("drop", (e) => {
    e.preventDefault();
    contenedor.parentElement.classList.remove("drag-over");

    const id = e.dataTransfer.getData("text/plain") || draggedWordId;
    const element = document.getElementById(id);

    if (element && !bloquejat) {
      contenedor.appendChild(element);
    }
  });
}

function iniciarTemporitzador() {
  clearInterval(timer);
  timeLeft = TEMPS_PER_PREGUNTA;
  timeEl.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      tempsEsgotat();
    }
  }, 1000);
}

function respondreOpcions(indexSeleccionat) {
  if (bloquejat) return;
  bloquejat = true;

  clearInterval(timer);

  const preguntaActual = preguntesBarrejades[currentQuestionIndex];
  const botonsResposta = document.querySelectorAll(".answer-btn");

  botonsResposta.forEach((btn, index) => {
    btn.disabled = true;
    if (index === preguntaActual.correcta) {
      btn.classList.add("correct");
    }
  });

  if (indexSeleccionat === preguntaActual.correcta) {
    gestionarRespostaCorrecta("Correcte! +10 punts.");
  } else {
    botonsResposta[indexSeleccionat].classList.add("incorrect");
    gestionarRespostaIncorrecta("Incorrecte. Perds una vida.");
  }
}

function comprovarArrossegar() {
  if (bloquejat) return;
  bloquejat = true;

  clearInterval(timer);

  const preguntaActual = preguntesBarrejades[currentQuestionIndex];

  const sonoraUsuari = [...sonoraZoneEl.querySelectorAll(".word-chip")].map(el => el.dataset.word);
  const sordaUsuari = [...sordaZoneEl.querySelectorAll(".word-chip")].map(el => el.dataset.word);
  const bancUsuari = [...wordBankEl.querySelectorAll(".word-chip")].map(el => el.dataset.word);

  const totesColocades = bancUsuari.length === 0;

  const sonoraCorrecta =
    sonoraUsuari.length === preguntaActual.s_sonora.length &&
    preguntaActual.s_sonora.every(paraula => sonoraUsuari.includes(paraula));

  const sordaCorrecta =
    sordaUsuari.length === preguntaActual.s_sorda.length &&
    preguntaActual.s_sorda.every(paraula => sordaUsuari.includes(paraula));

  if (totesColocades && sonoraCorrecta && sordaCorrecta) {
    gestionarRespostaCorrecta("Molt bé! Has classificat totes les paraules correctament.");
  } else {
    mostrarCorreccioArrossegar(preguntaActual);
    gestionarRespostaIncorrecta("Hi ha alguna paraula mal col·locada. Ara pots veure la classificació correcta. Perds una vida.", false);
  }
}

function mostrarCorreccioArrossegar(preguntaActual) {
  wordBankEl.innerHTML = "";
  sonoraZoneEl.innerHTML = "";
  sordaZoneEl.innerHTML = "";

  preguntaActual.s_sonora.forEach((paraula) => {
    const chip = document.createElement("div");
    chip.classList.add("word-chip", "locked", "correct-sonora");
    chip.textContent = paraula;
    sonoraZoneEl.appendChild(chip);
  });

  preguntaActual.s_sorda.forEach((paraula) => {
    const chip = document.createElement("div");
    chip.classList.add("word-chip", "locked", "correct-sorda");
    chip.textContent = paraula;
    sordaZoneEl.appendChild(chip);
  });
}

function gestionarRespostaCorrecta(text) {
  score += PUNTS_PER_ENCERT;
  streak++;
  correctAnswers++;

  if (streak > bestStreak) {
    bestStreak = streak;
  }

  let missatge = text;

  if (streak % 3 === 0) {
    score += BONUS_RATXA;
    missatge += ` Bonus de ratxa! +${BONUS_RATXA} punts.`;
  }

  feedbackEl.textContent = missatge;
  feedbackEl.className = "feedback ok";

  actualitzarHUD();

  setTimeout(() => {
    currentQuestionIndex++;
    carregarPregunta();
  }, 2200);
}

function gestionarRespostaIncorrecta(text, avançarDirecte = true) {
  lives--;
  streak = 0;

  feedbackEl.textContent = text;
  feedbackEl.className = "feedback error";

  actualitzarHUD();

  setTimeout(() => {
    currentQuestionIndex++;
    carregarPregunta();
  }, avançarDirecte ? 1800 : 2400);
}

function tempsEsgotat() {
  if (bloquejat) return;
  bloquejat = true;

  const preguntaActual = preguntesBarrejades[currentQuestionIndex];

  if (preguntaActual.tipus === "opcions") {
    const botonsResposta = document.querySelectorAll(".answer-btn");

    botonsResposta.forEach((btn, index) => {
      btn.disabled = true;
      if (index === preguntaActual.correcta) {
        btn.classList.add("correct");
      }
    });
  } else if (preguntaActual.tipus === "arrossegar") {
    mostrarCorreccioArrossegar(preguntaActual);
  }

  gestionarRespostaIncorrecta("S'ha acabat el temps. Perds una vida.");
}

function obtenirMissatgeFinal() {
  const total = preguntesBarrejades.length;
  const percentatge = total > 0 ? (correctAnswers / total) * 100 : 0;

  if (percentatge >= 80) {
    return "Molt bé! Tens un bon domini de la S sorda i la S sonora.";
  }

  if (percentatge >= 50) {
    return "Bona feina! Vas pel bon camí, però encara pots practicar una mica més.";
  }

  return "Has fet un bon esforç. Et convé practicar una mica més per dominar-ho millor.";
}

function acabarPartida() {
  clearInterval(timer);

  mostrarPantalla(endScreen);

  finalNameEl.textContent = playerName;
  finalScoreEl.textContent = score;
  finalCorrectEl.textContent = `${correctAnswers} de ${preguntesBarrejades.length}`;
  finalBestStreakEl.textContent = bestStreak;
  finalMessageEl.textContent = obtenirMissatgeFinal();

  progressFillEl.style.width = "100%";
}

startBtn.addEventListener("click", iniciarPartida);

restartBtn.addEventListener("click", () => {
  playerNameInput.value = "";
  mostrarPantalla(startScreen);
});

checkDragBtn.addEventListener("click", comprovarArrossegar);

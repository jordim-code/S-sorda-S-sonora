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
let preguntesActives = [];
let currentQuestionIndex = 0;
let score = 0;
let lives = VIDES_INICIALS;
let streak = 0;
let bestStreak = 0;
let correctAnswers = 0;
let timer = null;
let timeLeft = TEMPS_PER_PREGUNTA;
let bloquejat = false;
let draggedElement = null;

function barrejaArray(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function obtenirActivitatSeleccionada() {
  const seleccionada = document.querySelector('input[name="activity"]:checked');
  return seleccionada ? seleccionada.value : "1";
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
  progressTextEl.textContent = `Pregunta ${currentQuestionIndex + 1} de ${preguntesActives.length}`;
  progressFillEl.style.width = `${(currentQuestionIndex / preguntesActives.length) * 100}%`;
}

function iniciarPartida() {
  playerName = playerNameInput.value.trim();

  if (!playerName) {
    alert("Escriu un nom abans de començar.");
    return;
  }

  const activitat = obtenirActivitatSeleccionada();

  if (activitat === "1") {
    preguntesActives = barrejaArray(ACTIVITAT_1);
  } else {
    preguntesActives = barrejaArray(ACTIVITAT_2);
  }

  currentQuestionIndex = 0;
  score = 0;
  lives = VIDES_INICIALS;
  streak = 0;
  bestStreak = 0;
  correctAnswers = 0;
  bloquejat = false;
  draggedElement = null;

  mostrarPantalla(gameScreen);
  carregarPregunta();
}

function carregarPregunta() {
  if (currentQuestionIndex >= preguntesActives.length || lives <= 0) {
    acabarPartida();
    return;
  }

  bloquejat = false;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";

  const preguntaActual = preguntesActives[currentQuestionIndex];

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
    btn.className = "answer-btn";
    btn.textContent = opcio;
    btn.addEventListener("click", function () {
      respondreOpcions(index);
    });
    answersEl.appendChild(btn);
  });
}

function renderPreguntaArrossegar(preguntaActual) {
  answersEl.classList.add("hidden");
  dragAreaEl.classList.remove("hidden");

  const paraulesBarrejades = barrejaArray(preguntaActual.centre);

  paraulesBarrejades.forEach((paraula, index) => {
    const chip = document.createElement("div");
    chip.className = "word-chip";
    chip.textContent = paraula;
    chip.draggable = true;
    chip.id = `word-${currentQuestionIndex}-${index}`;
    chip.dataset.word = paraula;

    chip.addEventListener("dragstart", function () {
      draggedElement = chip;
    });

    chip.addEventListener("dragend", function () {
      draggedElement = null;
    });

    wordBankEl.appendChild(chip);
  });

  configurarDropZone(wordBankEl);
  configurarDropZone(sonoraZoneEl);
  configurarDropZone(sordaZoneEl);
}

function configurarDropZone(zone) {
  zone.ondragover = function (e) {
    e.preventDefault();
  };

  zone.ondragenter = function (e) {
    e.preventDefault();
    if (zone.parentElement) {
      zone.parentElement.classList.add("drop-highlight");
    }
  };

  zone.ondragleave = function () {
    if (zone.parentElement) {
      zone.parentElement.classList.remove("drop-highlight");
    }
  };

  zone.ondrop = function (e) {
    e.preventDefault();

    if (zone.parentElement) {
      zone.parentElement.classList.remove("drop-highlight");
    }

    if (bloquejat) return;
    if (!draggedElement) return;

    zone.appendChild(draggedElement);
  };
}

function iniciarTemporitzador() {
  clearInterval(timer);
  timeLeft = TEMPS_PER_PREGUNTA;
  timeEl.textContent = timeLeft;

  timer = setInterval(function () {
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

  const preguntaActual = preguntesActives[currentQuestionIndex];
  const botonsResposta = document.querySelectorAll(".answer-btn");

  botonsResposta.forEach(function (btn, index) {
    btn.disabled = true;
    if (index === preguntaActual.correcta) {
      btn.classList.add("correct");
    }
  });

  if (indexSeleccionat === preguntaActual.correcta) {
    gestionarRespostaCorrecta("Correcte! +10 punts.");
  } else {
    if (botonsResposta[indexSeleccionat]) {
      botonsResposta[indexSeleccionat].classList.add("incorrect");
    }
    gestionarRespostaIncorrecta("Incorrecte. Perds una vida.");
  }
}

function comprovarArrossegar() {
  if (bloquejat) return;
  bloquejat = true;

  clearInterval(timer);

  const preguntaActual = preguntesActives[currentQuestionIndex];
  const totsElsChips = document.querySelectorAll(".word-chip");

  let totCorrecte = true;

  totsElsChips.forEach(function (chip) {
    chip.draggable = false;
    chip.classList.add("locked");
    chip.classList.remove("correct-placement", "wrong-placement");

    const paraula = chip.dataset.word;
    const pare = chip.parentElement;

    const hauriaAnarSonora = preguntaActual.s_sonora.includes(paraula);
    const hauriaAnarSorda = preguntaActual.s_sorda.includes(paraula);

    const estaSonora = pare === sonoraZoneEl;
    const estaSorda = pare === sordaZoneEl;

    const correcte =
      (hauriaAnarSonora && estaSonora) ||
      (hauriaAnarSorda && estaSorda);

    if (correcte) {
      chip.classList.add("correct-placement");
    } else {
      chip.classList.add("wrong-placement");
      totCorrecte = false;
    }
  });

  if (totCorrecte) {
    gestionarRespostaCorrecta("Molt bé! Has classificat totes les paraules correctament.");
  } else {
    gestionarRespostaIncorrecta("Hi ha paraules mal col·locades o sense col·locar. Les incorrectes estan marcades en vermell.", false);
  }
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

  setTimeout(function () {
    currentQuestionIndex++;
    carregarPregunta();
  }, 2200);
}

function gestionarRespostaIncorrecta(text, avancarDirecte = true) {
  lives--;
  streak = 0;

  feedbackEl.textContent = text;
  feedbackEl.className = "feedback error";

  actualitzarHUD();

  setTimeout(function () {
    currentQuestionIndex++;
    carregarPregunta();
  }, avancarDirecte ? 1800 : 2600);
}

function tempsEsgotat() {
  if (bloquejat) return;
  bloquejat = true;

  const preguntaActual = preguntesActives[currentQuestionIndex];

  if (preguntaActual.tipus === "opcions") {
    const botonsResposta = document.querySelectorAll(".answer-btn");

    botonsResposta.forEach(function (btn, index) {
      btn.disabled = true;
      if (index === preguntaActual.correcta) {
        btn.classList.add("correct");
      }
    });
  } else if (preguntaActual.tipus === "arrossegar") {
    const totsElsChips = document.querySelectorAll(".word-chip");
    totsElsChips.forEach(function (chip) {
      chip.draggable = false;
      chip.classList.add("locked", "wrong-placement");
    });
  }

  gestionarRespostaIncorrecta("S'ha acabat el temps. Perds una vida.");
}

function obtenirMissatgeFinal() {
  const total = preguntesActives.length;
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
  finalCorrectEl.textContent = `${correctAnswers} de ${preguntesActives.length}`;
  finalBestStreakEl.textContent = bestStreak;
  finalMessageEl.textContent = obtenirMissatgeFinal();

  progressFillEl.style.width = "100%";
}

startBtn.addEventListener("click", iniciarPartida);

restartBtn.addEventListener("click", function () {
  playerNameInput.value = "";
  mostrarPantalla(startScreen);
});

checkDragBtn.addEventListener("click", comprovarArrossegar);

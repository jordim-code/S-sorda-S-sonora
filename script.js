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
const attemptNumberEl = document.getElementById("attempt-number");

const questionCategoryEl = document.getElementById("question-category");
const questionTextEl = document.getElementById("question-text");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const progressTextEl = document.getElementById("progress-text");
const progressFillEl = document.getElementById("progress-fill");

const scoreBoxEl = document.getElementById("score-box");
const streakBoxEl = document.getElementById("streak-box");
const livesBoxEl = document.getElementById("lives-box");
const timeBoxEl = document.getElementById("time-box");
const attemptBoxEl = document.getElementById("attempt-box");

const dragAreaEl = document.getElementById("drag-area");
const wordBankEl = document.getElementById("word-bank");
const sonoraZoneEl = document.getElementById("sonora-zone");
const sordaZoneEl = document.getElementById("sorda-zone");
const checkDragBtn = document.getElementById("check-drag-btn");

const dictationAreaEl = document.getElementById("dictation-area");
const dictationInputEl = document.getElementById("dictation-input");
const playAudioBtn = document.getElementById("play-audio-btn");
const checkDictationBtn = document.getElementById("check-dictation-btn");
const dictationMetaEl = document.getElementById("dictation-meta");
const dictationErrorsEl = document.getElementById("dictation-errors");
const dictationFeedbackEl = document.getElementById("dictation-feedback");
const dictationCorrectionEl = document.getElementById("dictation-correction");

const finalNameEl = document.getElementById("final-name");
const finalScoreEl = document.getElementById("final-score");
const finalCorrectEl = document.getElementById("final-correct");
const finalErrorsEl = document.getElementById("final-errors");
const finalBestStreakEl = document.getElementById("final-best-streak");
const finalMessageEl = document.getElementById("final-message");

const finalScoreRowEl = document.getElementById("final-score-row");
const finalErrorsRowEl = document.getElementById("final-errors-row");
const finalBestStreakRowEl = document.getElementById("final-best-streak-row");

const VIDES_INICIALS = 3;
const TEMPS_PER_PREGUNTA = 30;
const PUNTS_PER_ENCERT = 10;
const BONUS_RATXA = 10;
const MAX_INTENTS_DICTAT = 3;

let playerName = "";
let preguntesActives = [];
let activitatActual = "1";
let currentQuestionIndex = 0;
let score = 0;
let lives = VIDES_INICIALS;
let streak = 0;
let bestStreak = 0;
let correctAnswers = 0;
let errorsCount = 0;
let timer = null;
let timeLeft = TEMPS_PER_PREGUNTA;
let bloquejat = false;
let draggedElement = null;
let dictationAttempt = 1;
let currentAudio = null;

function barrejaArray(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function obtenirActivitatSeleccionada() {
  const marcada = document.querySelector('input[name="activity"]:checked');
  if (!marcada) return "1";
  return String(marcada.value);
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
  attemptNumberEl.textContent = dictationAttempt;
  timeEl.textContent = timeLeft;
}

function actualitzarVisibilitatHUD() {
  scoreBoxEl.classList.add("hidden");
  streakBoxEl.classList.add("hidden");
  livesBoxEl.classList.add("hidden");
  timeBoxEl.classList.add("hidden");
  attemptBoxEl.classList.add("hidden");

  if (activitatActual === "1") {
    livesBoxEl.classList.remove("hidden");
    timeBoxEl.classList.remove("hidden");
  } else if (activitatActual === "2") {
    scoreBoxEl.classList.remove("hidden");
    streakBoxEl.classList.remove("hidden");
    livesBoxEl.classList.remove("hidden");
    timeBoxEl.classList.remove("hidden");
  } else if (activitatActual === "3") {
    attemptBoxEl.classList.remove("hidden");
  }
}

function iniciarPartida() {
  playerName = playerNameInput.value.trim();

  if (!playerName) {
    alert("Escriu un nom abans de començar.");
    return;
  }

  activitatActual = obtenirActivitatSeleccionada();
  console.log("Activitat seleccionada:", activitatActual);

  if (activitatActual === "1") {
    preguntesActives = barrejaArray(ACTIVITAT_1);
  } else if (activitatActual === "2") {
    preguntesActives = barrejaArray(ACTIVITAT_2);
  } else if (activitatActual === "3") {
    preguntesActives = [...ACTIVITAT_3];
  } else {
    alert("No s'ha pogut detectar l'activitat seleccionada.");
    return;
  }

  currentQuestionIndex = 0;
  score = 0;
  lives = VIDES_INICIALS;
  streak = 0;
  bestStreak = 0;
  correctAnswers = 0;
  errorsCount = 0;
  bloquejat = false;
  draggedElement = null;
  dictationAttempt = 1;
  timeLeft = TEMPS_PER_PREGUNTA;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  actualitzarVisibilitatHUD();
  mostrarPantalla(gameScreen);
  carregarPregunta();
}

function carregarPregunta() {
  if (currentQuestionIndex >= preguntesActives.length || (activitatActual !== "3" && lives <= 0)) {
    acabarPartida();
    return;
  }

  bloquejat = false;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";

  answersEl.innerHTML = "";
  wordBankEl.innerHTML = "";
  sonoraZoneEl.innerHTML = "";
  sordaZoneEl.innerHTML = "";
  dictationInputEl.value = "";
  dictationMetaEl.classList.add("hidden");
  dictationFeedbackEl.classList.add("hidden");
  dictationCorrectionEl.innerHTML = "";

  const preguntaActual = preguntesActives[currentQuestionIndex];

  questionCategoryEl.textContent = preguntaActual.categoria;
  questionTextEl.textContent = preguntaActual.pregunta;

  actualitzarHUD();

  answersEl.classList.add("hidden");
  dragAreaEl.classList.add("hidden");
  dictationAreaEl.classList.add("hidden");

  if (preguntaActual.tipus === "opcions") {
    renderPreguntaOpcions(preguntaActual);
    iniciarTemporitzador();
  } else if (preguntaActual.tipus === "arrossegar") {
    renderPreguntaArrossegar(preguntaActual);
    iniciarTemporitzador();
  } else if (preguntaActual.tipus === "dictat") {
    renderPreguntaDictat(preguntaActual);
  }
}

function renderPreguntaOpcions(preguntaActual) {
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

function renderPreguntaDictat(preguntaActual) {
  dictationAreaEl.classList.remove("hidden");
  dictationMetaEl.classList.add("hidden");
  dictationFeedbackEl.classList.add("hidden");
  dictationCorrectionEl.innerHTML = "";
  currentAudio = new Audio(preguntaActual.audio);
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
    if (bloquejat || !draggedElement) return;
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

function normalitzarAccents(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function tokenitzaPerParaules(text) {
  const net = text.trim();
  if (!net) return [];
  return net.split(/\s+/);
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function comprovarDictat() {
  const preguntaActual = preguntesActives[currentQuestionIndex];
  const respostaUsuari = dictationInputEl.value.trim();
  const tokensUsuari = tokenitzaPerParaules(respostaUsuari);
  const tokensCorrectes = tokenitzaPerParaules(preguntaActual.frase);

  const maxLen = Math.max(tokensUsuari.length, tokensCorrectes.length);
  let errorsAquestIntent = 0;
  let html = "";

  for (let i = 0; i < maxLen; i++) {
    const userToken = tokensUsuari[i] ?? "";
    const correctToken = tokensCorrectes[i] ?? "";

    const correcte =
      userToken !== "" &&
      correctToken !== "" &&
      normalitzarAccents(userToken) === normalitzarAccents(correctToken);

    if (correcte) {
      html += `<span class="correction-token correct">${escapeHtml(userToken)}</span>`;
    } else {
      errorsAquestIntent++;
      const textMostrar = userToken !== "" ? userToken : "∅";
      html += `<span class="correction-token wrong">${escapeHtml(textMostrar)}</span>`;
    }
  }

  dictationErrorsEl.textContent = errorsAquestIntent;
  dictationCorrectionEl.innerHTML = html;
  dictationMetaEl.classList.remove("hidden");
  dictationFeedbackEl.classList.remove("hidden");

  if (errorsAquestIntent === 0) {
    correctAnswers++;
    feedbackEl.textContent = "Molt bé! Has escrit la frase correctament.";
    feedbackEl.className = "feedback ok";

    setTimeout(function () {
      currentQuestionIndex++;
      dictationAttempt = 1;
      carregarPregunta();
    }, 1800);
    return;
  }

  errorsCount += errorsAquestIntent;

  if (dictationAttempt >= MAX_INTENTS_DICTAT) {
    feedbackEl.textContent = "Has esgotat els 3 intents. Tornes a la pantalla inicial.";
    feedbackEl.className = "feedback error";

    setTimeout(function () {
      tornarAInici();
    }, 2200);
    return;
  }

  feedbackEl.textContent = `Encara hi ha errors. Pots tornar-ho a provar. Intent ${dictationAttempt} de ${MAX_INTENTS_DICTAT}.`;
  feedbackEl.className = "feedback error";

  dictationAttempt++;
  actualitzarHUD();
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
  errorsCount++;

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

  if (activitatActual === "3") {
    if (percentatge >= 80) return "Molt bé! Has resolt molt bé el dictat.";
    if (percentatge >= 50) return "Bona feina! Encara pots millorar una mica més el dictat.";
    return "Has fet un bon esforç. Et convé practicar una mica més el dictat.";
  }

  if (percentatge >= 80) return "Molt bé! Tens un bon domini de la S sorda i la S sonora.";
  if (percentatge >= 50) return "Bona feina! Vas pel bon camí, però encara pots practicar una mica més.";
  return "Has fet un bon esforç. Et convé practicar una mica més per dominar-ho millor.";
}

function acabarPartida() {
  clearInterval(timer);

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  mostrarPantalla(endScreen);

  const totalPreguntes = preguntesActives.length;

  finalNameEl.textContent = playerName;
  finalCorrectEl.textContent = `${correctAnswers} de ${totalPreguntes}`;
  finalErrorsEl.textContent = errorsCount;
  finalMessageEl.textContent = obtenirMissatgeFinal();

  if (activitatActual === "1") {
    finalScoreRowEl.style.display = "none";
    finalBestStreakRowEl.style.display = "none";
    finalErrorsRowEl.style.display = "block";
  } else if (activitatActual === "2") {
    finalScoreRowEl.style.display = "block";
    finalBestStreakRowEl.style.display = "block";
    finalErrorsRowEl.style.display = "block";
    finalScoreEl.textContent = score;
    finalBestStreakEl.textContent = bestStreak;
  } else {
    finalScoreRowEl.style.display = "none";
    finalBestStreakRowEl.style.display = "none";
    finalErrorsRowEl.style.display = "block";
  }

  progressFillEl.style.width = "100%";
}

function tornarAInici() {
  clearInterval(timer);

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  playerNameInput.value = "";
  dictationInputEl.value = "";
  feedbackEl.textContent = "";
  mostrarPantalla(startScreen);
}

startBtn.addEventListener("click", iniciarPartida);

restartBtn.addEventListener("click", function () {
  playerNameInput.value = "";
  mostrarPantalla(startScreen);
});

checkDragBtn.addEventListener("click", comprovarArrossegar);

playAudioBtn.addEventListener("click", function () {
  if (currentAudio) {
    currentAudio.currentTime = 0;
    currentAudio.play().catch(function () {
      alert("No s'ha pogut reproduir l'àudio.");
    });
  }
});

checkDictationBtn.addEventListener("click", function () {
  comprovarDictat();
});

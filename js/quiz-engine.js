/**
 * Moteur du quiz - Logique principale
 * Mode : Une question à la fois avec correction immédiate
 * Version optimisée
 */

// Configuration
const DEBUG = false; // Mettre à true pour activer les logs de debug

// Utilitaires
const log = (...args) => DEBUG && console.log(...args);
const warn = (...args) => DEBUG && console.warn(...args);
const error = (...args) => console.error(...args);

// Sélecteurs DOM - Cache pour performance
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const quizEl = $("#quiz");
const scoreEl = $("#score");
const startBtn = $("#start");
const difficultySel = $("#difficulty");
const countSel = $("#count");

// État du quiz
let current = [];
let currentIndex = 0;
let score = 0;
let answers = [];
let isProcessing = false;
let isQuizStarted = false;

/**
 * Affiche un message d'erreur utilisateur (remplace alert)
 */
function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.setAttribute("role", "alert");
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #ef4444;
    color: white;
    padding: 1rem 2rem;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    z-index: 1000;
    animation: slideDown 0.3s ease;
  `;
  document.body.appendChild(errorDiv);
  setTimeout(() => {
    errorDiv.style.animation = "slideUp 0.3s ease";
    setTimeout(() => errorDiv.remove(), 300);
  }, 3000);
}

/**
 * Normalise le texte pour la comparaison (insensible à la casse et aux accents)
 */
function normalizeText(s) {
  if (!s) return "";
  return String(s)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Mélange un tableau (algorithme Fisher-Yates optimisé)
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Sélectionne les questions selon le niveau et le nombre choisis
 */
function pickQuestions() {
  const diff = difficultySel.value;
  const n = parseInt(countSel.value, 10);
  let pool = QUESTIONS;
  
  if (diff !== "tous") {
    pool = QUESTIONS.filter((q) => q.difficulty === diff);
  }
  
  if (pool.length === 0) {
    showError("Aucune question disponible pour ce niveau.");
    return [];
  }
  
  const selected = shuffle(pool).slice(0, Math.min(n, pool.length));
  return selected;
}

/**
 * Affiche la question actuelle
 */
function renderCurrentQuestion() {
  if (currentIndex >= current.length) {
    showFinalScore();
    return;
  }

  const q = current[currentIndex];
  if (!q) {
    error("Question introuvable à l'index", currentIndex);
    return;
  }

  quizEl.innerHTML = "";
  scoreEl.textContent = "";

  const card = document.createElement("article");
  card.className = "card";
  card.dataset.qid = q.id;
  card.setAttribute("role", "article");
  card.setAttribute("aria-labelledby", `question-${q.id}`);

  // Meta informations
  const meta = document.createElement("div");
  meta.className = "meta";
  meta.innerHTML = `Question ${currentIndex + 1} / ${current.length} <span class="pill">${q.difficulty}</span> <span class="pill">${q.type}</span>`;
  card.appendChild(meta);

  // Texte de la question
  const p = document.createElement("div");
  p.className = "question-text";
  p.id = `question-${q.id}`;
  p.setAttribute("role", "heading");
  p.setAttribute("aria-level", "2");
  p.innerHTML = q.prompt.replace(/\n/g, "<br>");
  card.appendChild(p);

  // Zone de réponses
  const area = document.createElement("div");
  area.className = "opts";
  area.setAttribute("role", "group");
  area.setAttribute("aria-label", "Options de réponse");
  
  if (q.type === "mcq") {
    q.options.forEach((opt, i) => {
      const id = `${q.id}_${i}`;
      const label = document.createElement("label");
      label.setAttribute("for", id);
      label.className = "option-label answer-option";
      label.setAttribute("role", "radio");
      label.setAttribute("aria-checked", "false");
      label.setAttribute("tabindex", "0");
      
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = q.id;
      radio.id = id;
      radio.value = i;
      radio.setAttribute("aria-label", opt);
      
      const text = document.createElement("span");
      text.textContent = opt;
      text.style.flex = "1";
      text.style.textAlign = "center";
      
      label.appendChild(radio);
      label.appendChild(text);
      area.appendChild(label);
      
      // Gestion des clics et navigation clavier
      const handleSelect = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
        
        const allOptions = card.querySelectorAll('.answer-option');
        allOptions.forEach((o, idx) => {
          o.classList.remove('selected');
          o.setAttribute("aria-checked", "false");
          o.setAttribute("tabindex", idx === i ? "0" : "-1");
        });
        
        label.classList.add('selected');
        label.setAttribute("aria-checked", "true");
      };
      
      label.addEventListener('click', handleSelect);
      label.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleSelect(e);
        }
      });
    });
  } else if (q.type === "truefalse") {
    ["true", "false"].forEach((val, idx) => {
      const id = `${q.id}_tf_${idx}`;
      const label = document.createElement("label");
      label.setAttribute("for", id);
      label.className = "option-label answer-option";
      label.setAttribute("role", "radio");
      label.setAttribute("aria-checked", "false");
      label.setAttribute("tabindex", "0");
      
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = q.id;
      radio.id = id;
      radio.value = val;
      const labelText = val === "true" ? "Vrai" : "Faux";
      radio.setAttribute("aria-label", labelText);
      
      const text = document.createElement("span");
      text.textContent = labelText;
      text.style.flex = "1";
      text.style.textAlign = "center";
      text.style.fontSize = "1.1rem";
      text.style.fontWeight = "600";
      
      label.appendChild(radio);
      label.appendChild(text);
      area.appendChild(label);
      
      const handleSelect = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
        
        const allOptions = card.querySelectorAll('.answer-option');
        allOptions.forEach((o, optIdx) => {
          o.classList.remove('selected');
          o.setAttribute("aria-checked", "false");
          o.setAttribute("tabindex", optIdx === idx ? "0" : "-1");
        });
        
        label.classList.add('selected');
        label.setAttribute("aria-checked", "true");
      };
      
      label.addEventListener('click', handleSelect);
      label.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleSelect(e);
        }
      });
    });
  } else if (q.type === "short" || q.type === "fill" || q.type === "order") {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = q.type === "order" ? "Ex: 2-1-3-4" : "Ta réponse…";
    input.name = q.id;
    input.id = `input_${q.id}`;
    input.className = "answer-input";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.setAttribute("aria-label", "Champ de réponse");
    area.appendChild(input);
    
    if (q.type === "order") {
      const list = document.createElement("div");
      list.className = "hint";
      list.setAttribute("role", "note");
      list.setAttribute("aria-label", "Éléments à ordonner");
      list.innerHTML = "Éléments :<br>" + q.items.map((x, i) => `(${i + 1}) ${x}`).join("<br>");
      area.appendChild(list);
    }
  }
  card.appendChild(area);

  // Zone d'indice
  const hintArea = document.createElement("div");
  hintArea.className = "hint-area";
  const hintBtn = document.createElement("button");
  hintBtn.className = "btn-hint";
  hintBtn.type = "button";
  hintBtn.textContent = "💡 Afficher l'indice";
  hintBtn.setAttribute("aria-expanded", "false");
  hintBtn.setAttribute("aria-controls", `hint-${q.id}`);
  
  const hintText = document.createElement("div");
  hintText.className = "hint-text";
  hintText.id = `hint-${q.id}`;
  hintText.setAttribute("role", "region");
  hintText.setAttribute("aria-label", "Indice");
  hintText.textContent = q.hint ?? "";
  
  hintBtn.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    const isShowing = hintText.classList.toggle("show");
    hintBtn.setAttribute("aria-expanded", isShowing);
    hintBtn.textContent = isShowing ? "🙈 Masquer l'indice" : "💡 Afficher l'indice";
  });
  
  hintArea.appendChild(hintBtn);
  hintArea.appendChild(hintText);
  card.appendChild(hintArea);

  // Zone de feedback
  const fb = document.createElement("div");
  fb.className = "hint feedback-hidden";
  fb.dataset.role = "feedback";
  fb.setAttribute("role", "status");
  fb.setAttribute("aria-live", "polite");
  card.appendChild(fb);

  // Bouton Valider
  const validateBtn = document.createElement("button");
  validateBtn.className = "btn btn-primary btn-validate";
  validateBtn.textContent = "✓ Valider ma réponse";
  validateBtn.type = "button";
  validateBtn.setAttribute("aria-label", "Valider la réponse");
  validateBtn.addEventListener("click", validateAnswer, { passive: false });
  card.appendChild(validateBtn);

  // Bouton Question suivante
  const nextBtn = document.createElement("button");
  nextBtn.className = "btn btn-success btn-next";
  nextBtn.textContent = "➡️ Question suivante";
  nextBtn.type = "button";
  nextBtn.style.display = "none";
  nextBtn.setAttribute("aria-label", "Passer à la question suivante");
  nextBtn.addEventListener("click", nextQuestion, { passive: false });
  card.appendChild(nextBtn);

  quizEl.appendChild(card);
  
  // Focus management
  const firstInput = card.querySelector('input[type="text"]');
  if (firstInput) {
    requestAnimationFrame(() => {
      firstInput.focus();
      if (firstInput.value) firstInput.select();
    });
  }
  
  // Validation avec Enter
  const textInputs = card.querySelectorAll('input[type="text"]');
  textInputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const btn = card.querySelector(".btn-validate");
        if (btn && btn.style.display !== "none" && !btn.disabled) {
          btn.click();
        }
      }
    });
  });
}

/**
 * Valide la réponse de l'utilisateur
 */
function validateAnswer(e) {
  if (isProcessing) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    return false;
  }
  
  if (!isQuizStarted || currentIndex >= current.length) {
    return false;
  }
  
  const q = current[currentIndex];
  if (!q) return false;
  
  const card = document.querySelector(`.card[data-qid="${q.id}"]`);
  if (!card) return false;
  
  const fb = card.querySelector(`[data-role="feedback"]`);
  const validateBtn = card.querySelector(".btn-validate");
  const nextBtn = card.querySelector(".btn-next");
  
  if (!fb || !validateBtn) return false;
  
  if (!fb.classList.contains("feedback-hidden")) {
    return false;
  }
  
  isProcessing = true;
  
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  validateBtn.disabled = true;
  validateBtn.style.opacity = "0.6";
  validateBtn.style.cursor = "not-allowed";
  
  const userAnswer = getUserAnswer(q, card);
  
  if ((q.type === "short" || q.type === "fill" || q.type === "order") && (!userAnswer || userAnswer.trim() === "")) {
    showError("Veuillez saisir une réponse avant de valider.");
    isProcessing = false;
    validateBtn.disabled = false;
    validateBtn.style.opacity = "1";
    validateBtn.style.cursor = "pointer";
    return false;
  }
  
  if ((q.type === "mcq" || q.type === "truefalse") && userAnswer === null) {
    showError("Veuillez sélectionner une réponse avant de valider.");
    isProcessing = false;
    validateBtn.disabled = false;
    validateBtn.style.opacity = "1";
    validateBtn.style.cursor = "pointer";
    return false;
  }
  
  const inputs = card.querySelectorAll("input");
  inputs.forEach(input => {
    input.disabled = true;
  });

  const isCorrectAnswer = isCorrect(q, userAnswer);
  
  answers.push({
    question: q,
    userAnswer: userAnswer,
    isCorrect: isCorrectAnswer
  });
  
  if (isCorrectAnswer) {
    score++;
  }

  fb.classList.remove("feedback-hidden");
  fb.classList.add("hint", "result", isCorrectAnswer ? "ok" : "ko");
  
  if (isCorrectAnswer) {
    fb.innerHTML = `✅ <strong>Correct !</strong><br>${q.explanation || ""}`;
    fb.setAttribute("aria-label", "Réponse correcte");
  } else {
    const expected =
      q.type === "mcq"
        ? q.options[q.answer]
        : q.type === "truefalse"
        ? q.answer ? "Vrai" : "Faux"
        : q.type === "order"
        ? q.answerOrder.join("-")
        : q.answerText;
    fb.innerHTML = `❌ <strong>Incorrect.</strong> Réponse attendue : <strong>${expected}</strong><br>${q.explanation || ""}`;
    fb.setAttribute("aria-label", `Réponse incorrecte. Réponse attendue : ${expected}`);
  }

  validateBtn.style.display = "none";
  if (nextBtn) {
    nextBtn.style.display = "block";
    nextBtn.disabled = false;
    nextBtn.style.opacity = "1";
    nextBtn.style.cursor = "pointer";
    // Focus sur le bouton suivant pour l'accessibilité
    requestAnimationFrame(() => nextBtn.focus());
  }
  
  updateProgressScore();
  isProcessing = false;
}

/**
 * Passe à la question suivante
 */
function nextQuestion(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  if (isProcessing) {
    log("Déjà en cours de traitement");
    return false;
  }
  
  if (!isQuizStarted) {
    log("Le quiz n'a pas démarré");
    return false;
  }
  
  if (currentIndex >= current.length - 1) {
    log("Dernière question atteinte");
    currentIndex++;
    showFinalScore();
    return false;
  }
  
  isProcessing = true;
  
  const nextBtn = document.querySelector(".btn-next");
  if (nextBtn) {
    nextBtn.disabled = true;
    nextBtn.style.opacity = "0.6";
    nextBtn.style.cursor = "not-allowed";
  }
  
  currentIndex++;
  log(`Passage à la question ${currentIndex + 1} / ${current.length}`);
  
  requestAnimationFrame(() => {
    try {
      renderCurrentQuestion();
      isProcessing = false;
    } catch (err) {
      error("Erreur lors du rendu:", err);
      isProcessing = false;
      showError("Une erreur est survenue. Veuillez recharger la page.");
    }
  });
  
  return false;
}

/**
 * Met à jour l'affichage du score de progression
 */
function updateProgressScore() {
  if (currentIndex < current.length) {
    scoreEl.innerHTML = `<div class="progress-score" role="status" aria-live="polite">Score actuel : ${score} / ${currentIndex + 1}</div>`;
  }
}

/**
 * Affiche le score final
 */
function showFinalScore() {
  quizEl.innerHTML = "";
  
  const finalCard = document.createElement("article");
  finalCard.className = "card final-score-card";
  finalCard.setAttribute("role", "article");
  
  const percentage = Math.round((score / current.length) * 100);
  let emoji = "🎯";
  let message = "";
  let colorClass = "";
  
  if (percentage === 100) {
    emoji = "🏆";
    message = "Parfait !";
    colorClass = "perfect";
  } else if (percentage >= 80) {
    emoji = "🌟";
    message = "Excellent !";
    colorClass = "excellent";
  } else if (percentage >= 60) {
    emoji = "👍";
    message = "Bien joué !";
    colorClass = "good";
  } else if (percentage >= 40) {
    emoji = "💪";
    message = "Continue !";
    colorClass = "average";
  } else {
    emoji = "📚";
    message = "À améliorer";
    colorClass = "improve";
  }
  
  finalCard.innerHTML = `
    <div class="final-score-content ${colorClass}">
      <div class="final-emoji" aria-hidden="true">${emoji}</div>
      <h2>${message}</h2>
      <div class="final-score-text">Score final : ${score} / ${current.length}</div>
      <div class="final-percentage">${percentage}% de bonnes réponses</div>
      <button class="btn btn-primary btn-restart" onclick="location.reload()" aria-label="Recommencer le quiz">🔄 Recommencer</button>
    </div>
  `;
  
  quizEl.appendChild(finalCard);
  scoreEl.innerHTML = "";
  
  // Focus sur le bouton recommencer
  requestAnimationFrame(() => {
    const restartBtn = finalCard.querySelector(".btn-restart");
    if (restartBtn) restartBtn.focus();
  });
}

/**
 * Collecte la réponse de l'utilisateur
 */
function getUserAnswer(q, card = null) {
  const searchContext = card || document;
  
  if (q.type === "mcq") {
    const el = searchContext.querySelector(`input[name="${q.id}"]:checked`);
    return el ? parseInt(el.value, 10) : null;
  }
  if (q.type === "truefalse") {
    const el = searchContext.querySelector(`input[name="${q.id}"]:checked`);
    if (!el) return null;
    return el.value === "true";
  }
  if (q.type === "short" || q.type === "fill" || q.type === "order") {
    const el = searchContext.querySelector(`input[name="${q.id}"]`);
    return el ? el.value.trim() : "";
  }
  return null;
}

/**
 * Vérifie si la réponse est correcte
 */
function isCorrect(q, userAnsRaw) {
  if (q.type === "mcq") return userAnsRaw === q.answer;
  if (q.type === "truefalse") return userAnsRaw === q.answer;
  if (q.type === "short" || q.type === "fill") {
    return normalizeText(userAnsRaw) === normalizeText(q.answerText);
  }
  if (q.type === "order") {
    const arr = normalizeText(userAnsRaw)
      .split(/[^0-9]+/)
      .filter(Boolean)
      .map((x) => parseInt(x, 10));
    if (arr.length !== q.answerOrder.length) return false;
    return arr.every((v, i) => v === q.answerOrder[i]);
  }
  return false;
}

/**
 * Initialise le quiz
 */
function startQuiz(e) {
  if (isProcessing || isQuizStarted) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    return false;
  }
  
  try {
    isProcessing = true;
    
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    log("Démarrage du quiz...");
    
    if (startBtn) {
      startBtn.disabled = true;
      startBtn.style.opacity = "0.6";
      startBtn.style.cursor = "not-allowed";
    }
    
    current = pickQuestions();
    if (current.length === 0) {
      isProcessing = false;
      if (startBtn) {
        startBtn.disabled = false;
        startBtn.style.opacity = "1";
        startBtn.style.cursor = "pointer";
      }
      return false;
    }
    
    log(`${current.length} questions sélectionnées`);
    currentIndex = 0;
    score = 0;
    answers = [];
    isQuizStarted = true;
    
    if (difficultySel) difficultySel.disabled = true;
    if (countSel) countSel.disabled = true;
    
    requestAnimationFrame(() => {
      renderCurrentQuestion();
      isProcessing = false;
    });
    
    return false;
  } catch (err) {
    error("Erreur lors du démarrage:", err);
    isProcessing = false;
    isQuizStarted = false;
    
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.style.opacity = "1";
      startBtn.style.cursor = "pointer";
    }
    
    showError("Une erreur est survenue lors du démarrage du quiz. Veuillez recharger la page.");
    return false;
  }
}

// Initialisation
function initQuiz() {
  if (!startBtn) {
    error("Bouton 'start' introuvable");
    return;
  }
  
  if (!difficultySel || !countSel) {
    error("Éléments de contrôle introuvables");
    return;
  }
  
  startBtn.addEventListener("click", startQuiz, { passive: false });
}

// DOM Ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuiz);
} else {
  initQuiz();
}

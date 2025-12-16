/**
 * Moteur du quiz - Logique principale
 * Mode : Une question à la fois avec correction immédiate
 */

// Sélecteurs DOM
const $ = (sel) => document.querySelector(sel);
const quizEl = $("#quiz");
const scoreEl = $("#score");
const startBtn = $("#start");
const difficultySel = $("#difficulty");
const countSel = $("#count");

let current = [];
let currentIndex = 0;
let score = 0;
let answers = []; // Stocke les réponses pour le score final
let isProcessing = false; // Protection contre les double-clics
let isQuizStarted = false; // État du quiz

/**
 * Normalise le texte pour la comparaison (insensible à la casse et aux accents)
 * @param {string} s - Texte à normaliser
 * @returns {string} Texte normalisé
 */
function normalizeText(s) {
  return (s ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Mélange un tableau (algorithme Fisher-Yates)
 * @param {Array} arr - Tableau à mélanger
 * @returns {Array} Tableau mélangé
 */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Sélectionne les questions selon le niveau et le nombre choisis
 * @returns {Array} Tableau de questions sélectionnées
 */
function pickQuestions() {
  const diff = difficultySel.value;
  const n = parseInt(countSel.value, 10);
  let pool = QUESTIONS;
  if (diff !== "tous") {
    pool = QUESTIONS.filter((q) => q.difficulty === diff);
  }
  const selected = shuffle(pool).slice(0, Math.min(n, pool.length));
  
  // Validation : vérifier qu'on a des questions
  if (selected.length === 0) {
    alert("Aucune question disponible pour ce niveau.");
    return [];
  }
  
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
  quizEl.innerHTML = "";
  scoreEl.textContent = "";

  const card = document.createElement("div");
  card.className = "card";
  card.dataset.qid = q.id;

  // Meta informations
  const meta = document.createElement("div");
  meta.className = "meta";
  meta.innerHTML = `Question ${currentIndex + 1} / ${current.length} <span class="pill">${q.difficulty}</span> <span class="pill">${q.type}</span>`;
  card.appendChild(meta);

  // Texte de la question
  const p = document.createElement("div");
  p.className = "question-text";
  p.innerHTML = q.prompt.replace(/\n/g, "<br>");
  card.appendChild(p);

  // Zone de réponses
  const area = document.createElement("div");
  area.className = "opts";
  
  if (q.type === "mcq") {
    q.options.forEach((opt, i) => {
      const id = `${q.id}_${i}`;
      const label = document.createElement("label");
      label.setAttribute("for", id);
      label.className = "option-label answer-option";
      
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = q.id;
      radio.id = id;
      radio.value = i;
      
      const text = document.createElement("span");
      text.textContent = opt;
      text.style.flex = "1";
      text.style.textAlign = "center";
      
      label.appendChild(radio);
      label.appendChild(text);
      area.appendChild(label);
      
      // Rendre toute la zone cliquable
      label.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Cocher le radio button
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Retirer la classe selected de toutes les options
        const allOptions = card.querySelectorAll('.answer-option');
        allOptions.forEach(o => o.classList.remove('selected'));
        
        // Ajouter la classe selected à l'option cliquée
        label.classList.add('selected');
      });
    });
  } else if (q.type === "truefalse") {
    ["true", "false"].forEach((val, idx) => {
      const id = `${q.id}_tf_${idx}`;
      const label = document.createElement("label");
      label.setAttribute("for", id);
      label.className = "option-label answer-option";
      
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = q.id;
      radio.id = id;
      radio.value = val;
      
      const text = document.createElement("span");
      text.textContent = val === "true" ? "Vrai" : "Faux";
      text.style.flex = "1";
      text.style.textAlign = "center";
      text.style.fontSize = "1.1rem";
      text.style.fontWeight = "600";
      
      label.appendChild(radio);
      label.appendChild(text);
      area.appendChild(label);
      
      // Rendre toute la zone cliquable
      label.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Cocher le radio button
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Retirer la classe selected de toutes les options
        const allOptions = card.querySelectorAll('.answer-option');
        allOptions.forEach(o => o.classList.remove('selected'));
        
        // Ajouter la classe selected à l'option cliquée
        label.classList.add('selected');
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
    area.appendChild(input);
    if (q.type === "order") {
      const list = document.createElement("div");
      list.className = "hint";
      list.innerHTML =
        "Éléments :<br>" +
        q.items.map((x, i) => `(${i + 1}) ${x}`).join("<br>");
      area.appendChild(list);
    }
  }
  card.appendChild(area);

  // Zone d'indice + bouton
  const hintArea = document.createElement("div");
  hintArea.className = "hint-area";
  const hintBtn = document.createElement("button");
  hintBtn.className = "btn-hint";
  hintBtn.type = "button";
  hintBtn.textContent = "💡 Afficher l'indice";
  const hintText = document.createElement("div");
  hintText.className = "hint-text";
  hintText.textContent = q.hint ?? "";
  
  hintBtn.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    hintText.classList.toggle("show");
    hintBtn.textContent = hintText.classList.contains("show")
      ? "🙈 Masquer l'indice"
      : "💡 Afficher l'indice";
  });
  
  hintArea.appendChild(hintBtn);
  hintArea.appendChild(hintText);
  card.appendChild(hintArea);

  // Zone de feedback (cachée au début)
  const fb = document.createElement("div");
  fb.className = "hint feedback-hidden";
  fb.dataset.role = "feedback";
  card.appendChild(fb);

  // Bouton Valider
  const validateBtn = document.createElement("button");
  validateBtn.className = "btn btn-primary btn-validate";
  validateBtn.textContent = "✓ Valider ma réponse";
  validateBtn.type = "button";
  validateBtn.addEventListener("click", validateAnswer, { passive: false });
  card.appendChild(validateBtn);

  // Bouton Question suivante (caché au début)
  const nextBtn = document.createElement("button");
  nextBtn.className = "btn btn-success btn-next";
  nextBtn.textContent = "➡️ Question suivante";
  nextBtn.type = "button";
  nextBtn.style.display = "none";
  nextBtn.addEventListener("click", nextQuestion, { passive: false });
  card.appendChild(nextBtn);

  quizEl.appendChild(card);
  
  // Focus sur le premier input si c'est un champ texte
  const firstInput = card.querySelector('input[type="text"]');
  if (firstInput) {
    setTimeout(() => {
      firstInput.focus();
      firstInput.select(); // Sélectionner le texte si déjà présent
    }, 200);
  }
  
  // Ajouter un listener pour valider avec Enter
  const textInputs = card.querySelectorAll('input[type="text"]');
  textInputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const validateBtn = card.querySelector(".btn-validate");
        if (validateBtn && validateBtn.style.display !== "none") {
          validateBtn.click();
        }
      }
    });
  });
}

/**
 * Valide la réponse de l'utilisateur
 */
function validateAnswer(e) {
  // Protection contre les double-clics
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
  
  // Si le feedback est déjà affiché, ne rien faire
  if (!fb.classList.contains("feedback-hidden")) {
    return false;
  }
  
  isProcessing = true;
  
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  // Désactiver le bouton immédiatement
  validateBtn.disabled = true;
  validateBtn.style.opacity = "0.6";
  validateBtn.style.cursor = "not-allowed";
  
  // Vérifier qu'une réponse a été donnée
  const userAnswer = getUserAnswer(q, card);
  
  // Pour les champs texte, vérifier qu'ils ne sont pas vides
  if ((q.type === "short" || q.type === "fill" || q.type === "order") && (!userAnswer || userAnswer.trim() === "")) {
    alert("Veuillez saisir une réponse avant de valider.");
    isProcessing = false;
    validateBtn.disabled = false;
    validateBtn.style.opacity = "1";
    validateBtn.style.cursor = "pointer";
    return false;
  }
  
  // Pour les QCM et Vrai/Faux, vérifier qu'une option a été sélectionnée
  if ((q.type === "mcq" || q.type === "truefalse") && userAnswer === null) {
    alert("Veuillez sélectionner une réponse avant de valider.");
    isProcessing = false;
    validateBtn.disabled = false;
    validateBtn.style.opacity = "1";
    validateBtn.style.cursor = "pointer";
    return false;
  }
  
  // Désactiver les inputs
  const inputs = card.querySelectorAll("input");
  inputs.forEach(input => {
    input.disabled = true;
  });

  // Vérifier si la réponse est correcte
  const isCorrectAnswer = isCorrect(q, userAnswer);
  
  // Stocker le résultat
  answers.push({
    question: q,
    userAnswer: userAnswer,
    isCorrect: isCorrectAnswer
  });
  
  if (isCorrectAnswer) {
    score++;
  }

  // Afficher le feedback
  fb.classList.remove("feedback-hidden");
  fb.classList.add("hint", "result", isCorrectAnswer ? "ok" : "ko");
  
  if (isCorrectAnswer) {
    fb.innerHTML = `✅ <strong>Correct !</strong><br>${q.explanation || ""}`;
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
  }

  // Masquer le bouton Valider, afficher Question suivante
  validateBtn.style.display = "none";
  if (nextBtn) {
    nextBtn.style.display = "block";
    nextBtn.disabled = false;
  }
  
  // Afficher le score actuel
  updateProgressScore();
  
  // Réinitialiser le flag de traitement après un court délai
  setTimeout(() => {
    isProcessing = false;
  }, 300);
}

/**
 * Passe à la question suivante
 */
function nextQuestion(e) {
  // Protection contre les double-clics
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
  
  isProcessing = true;
  
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  const nextBtn = document.querySelector(".btn-next");
  if (nextBtn) {
    nextBtn.disabled = true;
    nextBtn.style.opacity = "0.6";
  }
  
  currentIndex++;
  
  // Petit délai pour éviter les bugs visuels
  setTimeout(() => {
    renderCurrentQuestion();
    isProcessing = false;
  }, 200);
  
  return false;
}

/**
 * Met à jour l'affichage du score de progression
 */
function updateProgressScore() {
  if (currentIndex < current.length) {
    scoreEl.innerHTML = `<div class="progress-score">Score actuel : ${score} / ${currentIndex + 1}</div>`;
  }
}

/**
 * Affiche le score final
 */
function showFinalScore() {
  quizEl.innerHTML = "";
  
  const finalCard = document.createElement("div");
  finalCard.className = "card final-score-card";
  
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
      <div class="final-emoji">${emoji}</div>
      <h2>${message}</h2>
      <div class="final-score-text">Score final : ${score} / ${current.length}</div>
      <div class="final-percentage">${percentage}% de bonnes réponses</div>
      <button class="btn btn-primary btn-restart" onclick="location.reload()">🔄 Recommencer</button>
    </div>
  `;
  
  quizEl.appendChild(finalCard);
  
  scoreEl.innerHTML = "";
}

/**
 * Collecte la réponse de l'utilisateur pour une question
 * @param {Object} q - Question
 * @param {HTMLElement} card - Élément de la carte (optionnel, pour chercher dans le bon contexte)
 * @returns {*} Réponse de l'utilisateur
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
 * @param {Object} q - Question
 * @param {*} userAnsRaw - Réponse brute de l'utilisateur
 * @returns {boolean} True si correct
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
  // Protection contre les double-clics et les appels multiples
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
    
    console.log("Démarrage du quiz...");
    
    // Désactiver le bouton immédiatement
    if (startBtn) {
      startBtn.disabled = true;
      startBtn.style.opacity = "0.6";
      startBtn.style.cursor = "not-allowed";
    }
    
    current = pickQuestions();
    if (current.length === 0) {
      console.warn("Aucune question sélectionnée");
      isProcessing = false;
      if (startBtn) {
        startBtn.disabled = false;
        startBtn.style.opacity = "1";
        startBtn.style.cursor = "pointer";
      }
      return false;
    }
    
    console.log(`${current.length} questions sélectionnées`);
    currentIndex = 0;
    score = 0;
    answers = [];
    isQuizStarted = true;
    
    if (difficultySel) difficultySel.disabled = true;
    if (countSel) countSel.disabled = true;
    
    // Petit délai pour éviter les bugs visuels
    setTimeout(() => {
      renderCurrentQuestion();
      isProcessing = false;
    }, 100);
    
    return false;
  } catch (error) {
    console.error("Erreur lors du démarrage du quiz:", error);
    isProcessing = false;
    isQuizStarted = false;
    
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.style.opacity = "1";
      startBtn.style.cursor = "pointer";
    }
    
    alert("Une erreur est survenue lors du démarrage du quiz. Veuillez recharger la page.");
    return false;
  }
}

// Event listeners
// S'assurer que le DOM est chargé avant d'attacher les listeners
function initQuiz() {
  if (!startBtn) {
    console.error("Bouton 'start' introuvable dans le DOM");
    return;
  }
  
  if (!difficultySel || !countSel) {
    console.error("Éléments de contrôle introuvables dans le DOM");
    return;
  }
  
  // Attacher le listener avec once: false pour permettre plusieurs clics (mais protégé par isProcessing)
  startBtn.addEventListener("click", startQuiz, { passive: false });
}

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuiz);
} else {
  // DOM déjà chargé
  initQuiz();
}

// Permettre la validation avec Enter pour les champs texte
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && e.target.tagName === "INPUT" && e.target.type === "text") {
    const validateBtn = document.querySelector(".btn-validate");
    if (validateBtn && validateBtn.style.display !== "none") {
      validateBtn.click();
    }
  }
});

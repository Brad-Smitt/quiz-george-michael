# Quiz George Michael

Quiz interactif sur George Michael avec différents niveaux de difficulté et système d'indices.

## 🎯 Fonctionnalités

- **5 types de questions** :
  - QCM (choix multiples)
  - Vrai/Faux
  - Réponse courte (texte)
  - Texte à trous
  - Remettre dans l'ordre

- **3 niveaux de difficulté** :
  - Facile (10 questions)
  - Moyen (10 questions)
  - Difficile (10 questions)
  - Tous (30 questions)

- **Système d'indices** : Chaque question possède un indice que vous pouvez afficher

- **Feedback détaillé** : Explications après correction

- **Normalisation intelligente** : Les réponses texte sont insensibles à la casse et aux accents

## 📁 Structure du projet

```
quiz-george-michael/
├── index.html          # Page principale
├── css/
│   └── style.css       # Styles
├── js/
│   ├── questions.js    # Base de données des questions
│   └── quiz-engine.js  # Logique du quiz
└── README.md           # Documentation
```

## 🚀 Utilisation

### Installation locale

1. Clonez ou téléchargez ce repository
2. Ouvrez `index.html` dans votre navigateur
3. C'est tout ! Aucune dépendance requise

### Déploiement sur GitHub Pages

1. Créez un nouveau repository sur GitHub
2. Uploadez tous les fichiers du dossier `quiz-george-michael`
3. Allez dans **Settings** > **Pages**
4. Sélectionnez la branche `main` (ou `master`)
5. Votre quiz sera accessible à l'adresse : `https://votre-username.github.io/quiz-george-michael/`

## 🛠️ Technologies

- HTML5
- CSS3 (Flexbox)
- JavaScript (Vanilla, ES6+)
- Aucune dépendance externe

## 📝 Ajouter des questions

Pour ajouter des questions, éditez le fichier `js/questions.js` :

```javascript
{
  id: "N1",                    // Identifiant unique
  difficulty: "facile",        // "facile", "moyen", "difficile"
  type: "mcq",                 // "mcq", "truefalse", "short", "fill", "order"
  prompt: "Votre question ?",
  options: ["A", "B", "C", "D"], // Pour type "mcq"
  answer: 0,                   // Index de la bonne réponse
  hint: "Votre indice",
  explanation: "Explication de la réponse"
}
```

## 🎨 Personnalisation

### Modifier les styles

Éditez `css/style.css` pour personnaliser l'apparence du quiz.

### Modifier les couleurs

Les couleurs principales sont définies dans `css/style.css` :
- `.ok` : couleur des réponses correctes (#0a7)
- `.ko` : couleur des réponses incorrectes (#c22)

## 📄 Licence

Ce projet est libre d'utilisation pour un usage personnel ou éducatif.

## 👤 Auteur

Créé pour tester vos connaissances sur George Michael et Wham!

---

**Note** : Ce quiz est un projet éducatif. Les informations sont basées sur des sources publiques.


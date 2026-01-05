# Instructions de déploiement sur GitHub

## 📦 Méthode 1 : Via l'interface GitHub (recommandé)

### Étape 1 : Créer le repository
1. Allez sur [GitHub](https://github.com)
2. Cliquez sur le bouton **"New"** (ou **"+"** > **"New repository"**)
3. Nommez votre repository (ex: `quiz-george-michael`)
4. Choisissez **Public** ou **Private**
5. **Ne cochez pas** "Initialize with README" (vous avez déjà un README)
6. Cliquez sur **"Create repository"**

### Étape 2 : Uploader les fichiers
1. Sur la page de votre nouveau repository, cliquez sur **"uploading an existing file"**
2. Glissez-déposez tous les fichiers du dossier `quiz-george-michael` :
   - `index.html`
   - `README.md`
   - `.gitignore`
   - Le dossier `css/` avec `style.css`
   - Le dossier `js/` avec `questions.js` et `quiz-engine.js`
3. Ajoutez un message de commit (ex: "Initial commit")
4. Cliquez sur **"Commit changes"**

### Étape 3 : Activer GitHub Pages
1. Allez dans **Settings** (en haut du repository)
2. Dans le menu de gauche, cliquez sur **"Pages"**
3. Sous **"Source"**, sélectionnez :
   - Branch: `main` (ou `master` selon votre repository)
   - Folder: `/ (root)`
4. Cliquez sur **"Save"**
5. Attendez quelques minutes (1-2 min généralement)
6. Votre site sera accessible à : `https://votre-username.github.io/quiz-george-michael/`

---

## 💻 Méthode 2 : Via Git en ligne de commande

### Prérequis
- Git installé sur votre machine
- Compte GitHub

### Commandes

```bash
# 1. Naviguer dans le dossier du quiz
cd quiz-george-michael

# 2. Initialiser Git
git init

# 3. Ajouter tous les fichiers
git add .

# 4. Faire le premier commit
git commit -m "Initial commit: Quiz George Michael"

# 5. Créer le repository sur GitHub (via l'interface web)
# Puis connecter votre repo local au repo distant
git remote add origin https://github.com/VOTRE-USERNAME/quiz-george-michael.git

# 6. Renommer la branche en main (si nécessaire)
git branch -M main

# 7. Pousser le code
git push -u origin main
```

Ensuite, suivez l'**Étape 3** de la méthode 1 pour activer GitHub Pages.

---

## ✅ Vérification

Une fois déployé, vérifiez que :
- ✅ Le quiz s'affiche correctement
- ✅ Les styles CSS sont appliqués
- ✅ Les questions se chargent
- ✅ Le bouton "Démarrer" fonctionne
- ✅ La correction fonctionne

---

## 🔄 Mettre à jour le site

Après chaque modification :

```bash
git add .
git commit -m "Description de vos modifications"
git push
```

Le site se mettra à jour automatiquement en quelques minutes.

---

## 🐛 Dépannage

### Le site ne s'affiche pas
- Vérifiez que GitHub Pages est activé dans Settings > Pages
- Attendez 2-3 minutes après l'activation
- Vérifiez que `index.html` est à la racine du repository

### Les styles ne s'appliquent pas
- Vérifiez que le chemin dans `index.html` est correct : `css/style.css`
- Vérifiez que le fichier `css/style.css` existe bien dans le repository

### Les scripts ne fonctionnent pas
- Vérifiez que les chemins dans `index.html` sont corrects
- Ouvrez la console du navigateur (F12) pour voir les erreurs

---

## 📝 Note importante

Assurez-vous que tous les fichiers sont bien à la racine du repository GitHub, pas dans un sous-dossier, pour que GitHub Pages fonctionne correctement.






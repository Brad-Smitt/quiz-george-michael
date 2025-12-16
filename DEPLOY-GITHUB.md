# 🚀 Déploiement sur GitHub Pages

## Méthode rapide (recommandée)

### Étape 1 : Créer le repository sur GitHub

1. Allez sur [GitHub](https://github.com) et connectez-vous
2. Cliquez sur le bouton **"+"** en haut à droite > **"New repository"**
3. Configurez le repository :
   - **Repository name** : `quiz-george-michael`
   - **Description** : "Quiz interactif sur George Michael"
   - **Visibilité** : **Public** (nécessaire pour GitHub Pages gratuit)
   - **NE cochez PAS** "Add a README file"
   - **NE cochez PAS** "Add .gitignore"
   - **NE cochez PAS** "Choose a license"
4. Cliquez sur **"Create repository"**

### Étape 2 : Connecter votre dépôt local à GitHub

Dans le terminal, exécutez ces commandes (remplacez `VOTRE_USERNAME` par votre nom d'utilisateur GitHub) :

```bash
cd /Users/bradleyschmitt/Downloads/n8n-workflows-main/quiz-george-michael

# Ajouter le remote GitHub
git remote add origin https://github.com/VOTRE_USERNAME/quiz-george-michael.git

# Renommer la branche en main si nécessaire
git branch -M main

# Pousser le code
git push -u origin main
```

### Étape 3 : Activer GitHub Pages

1. Sur la page de votre repository GitHub, allez dans **Settings** (en haut)
2. Dans le menu de gauche, cliquez sur **"Pages"**
3. Sous **"Source"** :
   - **Branch** : sélectionnez `main`
   - **Folder** : sélectionnez `/ (root)`
4. Cliquez sur **"Save"**
5. Attendez 1-2 minutes

### Étape 4 : Accéder à votre quiz

Votre quiz sera accessible à l'adresse :
```
https://VOTRE_USERNAME.github.io/quiz-george-michael/
```

---

## Méthode avec le script

Vous pouvez aussi utiliser le script fourni :

```bash
cd /Users/bradleyschmitt/Downloads/n8n-workflows-main/quiz-george-michael
./deploy-github.sh VOTRE_USERNAME
```

Puis suivez les instructions affichées.

---

## 🔄 Mettre à jour le site

Après chaque modification, pour mettre à jour le site :

```bash
git add .
git commit -m "Description de vos modifications"
git push
```

Le site se mettra à jour automatiquement en quelques minutes.

---

## ✅ Vérification

Une fois déployé, vérifiez que :
- ✅ Le quiz s'affiche correctement
- ✅ Les styles CSS sont appliqués
- ✅ Les questions se chargent
- ✅ Le bouton "Démarrer" fonctionne
- ✅ Les options sont cliquables
- ✅ La validation fonctionne

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
- Ouvrez la console du navigateur (F12) pour voir les erreurs
- Vérifiez que les chemins dans `index.html` sont corrects

---

## 📝 Note importante

Assurez-vous que tous les fichiers sont bien à la racine du repository GitHub, pas dans un sous-dossier, pour que GitHub Pages fonctionne correctement.


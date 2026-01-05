# 🔧 Activer GitHub Pages - Guide étape par étape

## ✅ Vérification rapide

1. **Vérifiez que le code est bien sur GitHub** :
   - Allez sur : https://github.com/Brad-Smitt/quiz-george-michael
   - Vous devriez voir tous les fichiers (index.html, css/, js/, etc.)

2. **Activez GitHub Pages** :
   - Cliquez sur **Settings** (en haut du repository)
   - Dans le menu de gauche, cliquez sur **Pages**
   - Sous **"Build and deployment"** > **"Source"** :
     - Sélectionnez **"Deploy from a branch"**
     - **Branch** : `main`
     - **Folder** : `/ (root)`
   - Cliquez sur **Save**

3. **Attendez 1-2 minutes** puis allez sur :
   ```
   https://brad-smitt.github.io/quiz-george-michael/
   ```

## 🐛 Si ça ne fonctionne pas

### Problème : "404 Not Found"
- **Solution** : Attendez 2-3 minutes après l'activation
- Vérifiez que la branche `main` existe bien
- Vérifiez que `index.html` est à la racine

### Problème : Page blanche
- Ouvrez la console du navigateur (F12)
- Vérifiez les erreurs dans l'onglet "Console"
- Vérifiez que les chemins des fichiers CSS/JS sont corrects

### Problème : Styles ne s'appliquent pas
- Vérifiez que `css/style.css` existe bien
- Vérifiez le chemin dans `index.html` : `href="css/style.css"`

## 📝 Vérification des fichiers sur GitHub

Assurez-vous que ces fichiers sont présents à la racine :
- ✅ `index.html`
- ✅ `css/style.css`
- ✅ `js/questions.js`
- ✅ `js/quiz-engine.js`

## 🔄 Si vous devez repousser le code

```bash
cd /Users/bradleyschmitt/Downloads/n8n-workflows-main/quiz-george-michael
git add .
git commit -m "Mise à jour"
git push
```






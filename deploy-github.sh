#!/bin/bash

# Script de déploiement sur GitHub
# Usage: ./deploy-github.sh VOTRE_USERNAME

if [ -z "$1" ]; then
    echo "❌ Erreur: Vous devez fournir votre nom d'utilisateur GitHub"
    echo "Usage: ./deploy-github.sh VOTRE_USERNAME"
    exit 1
fi

USERNAME=$1
REPO_NAME="quiz-george-michael"

echo "🚀 Déploiement du quiz sur GitHub..."
echo ""

# Vérifier si le remote existe déjà
if git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  Le remote 'origin' existe déjà."
    read -p "Voulez-vous le remplacer? (o/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Oo]$ ]]; then
        git remote remove origin
    else
        echo "❌ Annulé"
        exit 1
    fi
fi

# Ajouter le remote
echo "📡 Ajout du remote GitHub..."
git remote add origin https://github.com/$USERNAME/$REPO_NAME.git

# Vérifier la branche
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo "🔄 Renommage de la branche en 'main'..."
    git branch -M main
fi

echo ""
echo "✅ Configuration terminée!"
echo ""
echo "📋 Prochaines étapes:"
echo ""
echo "1. Créez le repository sur GitHub:"
echo "   - Allez sur https://github.com/new"
echo "   - Nom du repository: $REPO_NAME"
echo "   - Visibilité: Public (pour GitHub Pages gratuit)"
echo "   - NE cochez PAS 'Initialize with README'"
echo "   - Cliquez sur 'Create repository'"
echo ""
echo "2. Poussez le code:"
echo "   git push -u origin main"
echo ""
echo "3. Activez GitHub Pages:"
echo "   - Allez dans Settings > Pages"
echo "   - Source: Branch 'main'"
echo "   - Folder: / (root)"
echo "   - Cliquez sur Save"
echo ""
echo "4. Votre quiz sera accessible à:"
echo "   https://$USERNAME.github.io/$REPO_NAME/"
echo ""






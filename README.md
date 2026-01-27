# Komoot → Panoramax Userscript

Ce script ajoute un **bouton Panoramax** sur Komoot pour afficher la photo panoramique la plus proche d’un point sur la carte, directement dans une **popup type Street View**.  

Il fonctionne sur **Chrome** avec Tampermonkey.

---

## 🚀 Prérequis

1. **Navigateur Chrome** ou tout navigateur compatible avec Tampermonkey.
2. **Tampermonkey** installé :

   - Chrome : [https://www.tampermonkey.net/](https://www.tampermonkey.net/)
   - Edge / Firefox / Opera : même site, choisir la version correspondante.

3. **Activer le mode développeur Chrome** (obligatoire pour l’injection du script) :

   1. Ouvre `chrome://extensions/`  
   2. Active le **Mode développeur** (en haut à droite)  
   3. Recharge la page Komoot

---

## 📥 Installation du script

1. Ouvre Tampermonkey → **Create a new script…**
2. Supprime le contenu par défaut
3. Colle ce lien directement comme script remote (ou en téléchargement) : [TamperMonkey Komoot Panoramax](https://github.com/qhess34/tampermonkey-komoot-panoramax/raw/refs/heads/main/Komoot_panoramax.user.js)
4. Sauvegarde (`Ctrl+S` ou bouton “File → Save”)
5. Assure-toi que le script est **Enabled** dans Tampermonkey

---

## ⚡ Utilisation

1. Ouvre Komoot : [https://www.komoot.com/](https://www.komoot.com/)
2. Clique sur la carte pour sélectionner un point
3. Un **bouton 📸 Panoramax** apparaîtra à côté des coordonnées
4. Clique sur le bouton :
   - Une **popup type Street View** s’ouvre avec la photo panoramique la plus proche
   - Tu peux fermer la popup avec **✖** ou la touche **ESC**

---

## 🧩 Notes

- Le script fonctionne avec la dernière version de Komoot (SPA React)
- Aucune installation supplémentaire n’est nécessaire pour Panoramax
- Si le bouton n’apparaît pas :
  - Vérifie que **Tampermonkey est activé**
  - Vérifie que **mode développeur Chrome** est bien activé
  - Recharge la page Komoot
- Compatible SPA : chaque clic sur la carte actualise le bouton et la photo

---

## 📄 Source du script

[Komoot Panoramax Userscript](https://github.com/qhess34/tampermonkey-komoot-panoramax/raw/refs/heads/main/Komoot_panoramax.user.js)

---

## 🔧 Support / Debug

- Console Chrome : `F12` → onglet **Console**
- Vérifie les logs :
  [Panoramax] Userscript chargé
  [Panoramax] API: https://api.panoramax.xyz/api/search?place_position=LAT,LON
  [Panoramax] URL photo: https://api.panoramax.xyz/?focus=pic&pic=IMAGE_ID
  
- Pas de logs → Tampermonkey ou mode développeur non actif



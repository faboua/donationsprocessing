# Traitement des dons par paiement de factures

Application web pour extraire et organiser les informations de dons à partir de relevés bancaires et de rapports de paiement.

## Fonctionnalités

- Téléversement de fichiers de relevés bancaires (`.CSV`) et de rapports de paiement (`.TXT`)
- Extraction automatique des informations de dons (numéro de don, montant, catégorie, ville)
- Regroupement des dons par ville (Québec, Toronto, Edmonton, Sherbrooke, etc.)
- Génération de fichiers CSV de résultats :
  - Un fichier par ville dans un dossier `dons/`
  - Un fichier récapitulatif (`summary.csv`)
  - Un fichier des lignes rejetées (`rejectedinput.csv`)
- Téléchargement individuel par fichier ou global en `.zip`

## Prérequis

- [Node.js](https://nodejs.org/) (v18 ou supérieur)
- npm

## Installation

```bash
npm install
```

## Démarrage

```bash
npm run dev
```

L'application sera disponible à `http://localhost:5173`.

## Build

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`.

## Utilisation

1. Glisser-déposer ou sélectionner les fichiers de relevés bancaires (`.CSV`) dans la zone de gauche
2. Glisser-déposer ou sélectionner les rapports de paiement (`.TXT`) dans la zone de droite
3. Cliquer sur **Traiter les fichiers**
4. Consulter les résultats (montant total, nombre de paiements, lignes rejetées)
5. Télécharger les fichiers individuellement ou cliquer **Tout télécharger** pour obtenir un fichier `.zip`

## Structure du projet

```
src/
├── components/          # Composants React réutilisables
│   ├── FileUploadZone/  # Zone de glisser-déposer pour fichiers
│   ├── ProcessButton/   # Bouton de traitement
│   └── ResultsPanel/    # Panneau de résultats et téléchargements
├── constants/           # Constantes (correspondance codes ville)
├── hooks/               # Hooks React personnalisés
├── pages/               # Pages de l'application
│   └── Landing/         # Page principale
├── services/            # Logique métier
│   ├── fileParser.ts    # Lecture et parsing des fichiers
│   ├── donationProcessor.ts  # Regroupement et calcul des dons
│   └── csvGenerator.ts  # Génération CSV et téléchargement ZIP
├── types/               # Interfaces TypeScript
└── utils/               # Fonctions utilitaires
```

## Stack technique

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) 5.9
- [Vite](https://vite.dev/) 8
- [Tailwind CSS](https://tailwindcss.com/) 4
- [PapaParse](https://www.papaparse.com/) — parsing CSV
- [JSZip](https://stuk.github.io/jszip/) — génération de fichiers ZIP

## Formats de fichiers

### Relevés bancaires (`.CSV`)

Fichiers CSV avec les colonnes : `Account Number`, `Currency`, `Date`, `Description`, `Withdrawals`, `Deposits`, `Balance`, `Backdated`. Le numéro de paiement est extrait de la colonne `Description` (préfixe `EDI#` ou `BPY#`).

### Rapports de paiement (`.TXT`)

Fichiers texte à largeur fixe contenant les détails de paiement : numéro de compte (code ville + numéro de don + catégorie), nom du client, numéro de référence et montant.

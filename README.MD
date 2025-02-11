# Système de Gestion d'une LIbrairie

## Description

Un système de gestion d'une librairie développé avec Node.js et Sequelize ORM. Ce projet permet de gérer les livres, les auteurs, les clients et les emprunts d'une librairie.

## Structure de la Base de Données

Le système comprend les entités suivantes :

- Livres (avec ISBN unique)
- Auteurs
- Clients (avec numéro SSN)
- Emprunts
- AuteurLivres (table de jonction entre Auteurs et Livres)

## Prérequis

- Node.js
- MySQL
- npm

## Installation

1. Cloner le projet

```bash
git clone [url-du-projet]
cd [nom-du-projet]
```

2. Installer les dépendances

```bash
npm install sequelize sequelize-cli mysql2
```

3. Initialiser Sequelize

```bash
npx sequelize init
```

## Structure du Projet

```bash
project/
│
├── config/
│   └── config.json               # Configuration de la base de données
│
├── models/
│   ├── client/
│   │   └── client.model.js       # Modèle Client
│   ├── livre/
│   │   └── livre.model.js        # Modèle Livre
│   │   └── auteur.model.js       # Modèle Auteur
│   │   └── emprunt.model.js      # Modèle Emprunt
│   │   └── auteur-livre.model.js # Modèle de jonction AuteurLivre
│   ├── index.js                  # Point d'entrée des modèles
│
└── server.js                     # Point d'entrée de l'application
```

# Modèles

## Livre

- ISBN (PK)

  - Type: STRING
  - Unique, Non null

- titre

  - Type: STRING
  - Non null

- auteurs

  - Type: JSON
  - Non null

- dateAchat
  - Type: DATE
  - Non null

## Auteur

- id (PK)

  - Type: UUID
  - Généré automatiquement

- nom

  - Type: STRING
  - Non null

- prenom

  - Type: STRING
  - Non null

- dateNaissance
  - Type: DATE
  - Nullable

## Client

- SSN (PK)

  - Type: STRING
  - Unique, Non null

- nom

  - Type: STRING
  - Non null

- prenom

  - Type: STRING
  - Non null

- rue

  - Type: STRING
  - Non null

- numero

  - Type: STRING
  - Non null

- codePostal

  - Type: STRING
  - Non null

- ville
  - Type: STRING
  - Non null

## Emprunt

- numero (PK)

  - Type: INTEGER
  - Auto-increment

- dateEmprunt

  - Type: DATE
  - Non null

- dateRetour

  - Type: DATE
  - Nullable

- livreISBN (FK)

  - Type: STRING
  - Non null

- clientSSN (FK)
  - Type: STRING
  - Non null

## AuteurLivre (Table de jonction)

- auteurId (FK)

  - Type: UUID
  - Non null

- livreISBN (FK)

  - Type: STRING
  - Non null

- role
  - Type: ENUM
  - Valeurs: 'principal', 'co-auteur', 'contributeur'
  - Défaut: 'principal'

# Configuration

1. Configurer la base de données dans `config/config.json` :

```json
{
  "development": {
    "username": "votre_username",
    "password": "votre_password",
    "database": "db_librairie_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

2. Lancer le serveur :

```bash
npm run start
```

3. Scripts npm disponibles :

```bash
npm i nodemon
```

```json
{
  "scripts": {
    "start": "nodemon server.js"
  }
}
```

# Fonctionnalités

- Gestion complète des livres (CRUD)
- Gestion des auteurs avec relations multiples vers les livres
- Gestion des clients
- Système d'emprunt avec dates de retour
- Association multiple entre auteurs et livres avec rôles définis

# Technologies Utilisées

- Node.js
- Sequelize ORM
- MySQL
- Nodemon (pour le développement)

# Documentation des Modèles

Chaque modèle est documenté avec JSDoc pour une meilleure maintenabilité et compréhension du code. La documentation inclut :

- Description des propriétés
- Types de données
- Validations
- Relations entre modèles
- Commentaires explicatifs

# Développement

Pour contribuer au projet :

1. Créer une branche pour votre fonctionnalité
2. Développer la fonctionnalité
3. Créer une Pull Request

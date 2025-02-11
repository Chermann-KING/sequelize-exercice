/**
 * @fileoverview Point d'entrée principal du serveur Node.js avec configuration Sequelize
 * @module server
 * @requires http
 * @requires ./models/index
 */

import http from "http";
import db from "./models/index.js";

/**
 * Instance Sequelize extraite de l'objet db
 * @type {import('sequelize').Sequelize}
 */
const { sequelize } = db;

/**
 * Démarre le serveur HTTP et initialise la connexion à la base de données
 * Cette fonction :
 * 1. Vérifie la connexion à la base de données
 * 2. Synchronise les modèles avec la base de données
 * 3. Démarre le serveur HTTP sur le port spécifié
 *
 * @async
 * @function startServer
 * @throws {Error} Si la connexion à la base de données échoue
 * @returns {Promise<void>}
 */
const startServer = async () => {
  try {
    // Teste la connexion à la base de données
    await sequelize.authenticate();
    console.log("DB: Connecté avec succès");

    /**
     * Synchronise les modèles avec la base de données
     * @param {Object} options - Options de synchronisation
     * @param {boolean} options.alter - Modifie les tables existantes pour correspondre aux modèles
     * @warning Utiliser {alter: true} en production peut causer des pertes de données
     */
    await sequelize.sync({ alter: true });
    console.log("Modèles synchronisés avec la DB.");

    /**
     * Création du serveur HTTP
     * @type {http.Server}
     */
    const server = http.createServer((req, res) => {
      // Configuration des en-têtes de réponse
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Serveur en ligne");
    });

    /**
     * Port sur lequel le serveur écoutera les requêtes
     * @type {number}
     * @constant
     */
    const port = 3000;

    /**
     * Démarre le serveur sur le port spécifié
     * @listens {port}
     */
    server.listen(port, () => {
      console.log(`Serveur démarré sur : http://localhost:${port}`);
    });
  } catch (error) {
    /**
     * Log les erreurs de connexion à la base de données
     * @param {Error} error - L'erreur capturée
     */
    console.error(`Erreur de connexion a la DB : ${error}`);
    // Il est recommandé de sortir du processus en cas d'erreur de connexion
    process.exit(1);
  }
};

// Démarrage du serveur
startServer();

/**
 * @fileoverview Point d'entrée principal du serveur Node.js avec configuration Sequelize
 * @module server
 */

import http from "http";
import db from "./models/index.js";

const { sequelize } = db;

/**
 * Configuration du serveur
 * @type {Object}
 */
const CONFIG = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  syncOptions: {
    // Force: true va supprimer et recréer les tables (dangereux en production)
    force: false,
    // Alter: true modifie les tables existantes (utiliser avec précaution en production)
    alter: process.env.NODE_ENV !== "production",
  },
};

/**
 * Gère les requêtes entrantes du serveur
 * @param {http.IncomingMessage} req - La requête HTTP entrante
 * @param {http.ServerResponse} res - La réponse HTTP
 */
const requestHandler = (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "X-Powered-By": "Node.js",
  });
  res.end("Serveur en ligne");
};

/**
 * Initialise la connexion à la base de données
 * @async
 * @throws {Error} Si la connexion échoue
 * @returns {Promise<void>}
 */
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB: Connexion établie avec succès");

    if (CONFIG.env === "production" && CONFIG.syncOptions.alter) {
      console.warn(
        "⚠️ Warning: alter:true en production peut causer des pertes de données"
      );
    }

    await sequelize.sync(CONFIG.syncOptions);
    console.log("✅ DB: Modèles synchronisés avec succès");
  } catch (error) {
    console.error("❌ DB: Erreur de connexion:", error);
    throw error; // Propage l'erreur pour la gestion dans startServer
  }
};

/**
 * Démarre le serveur HTTP
 * @async
 * @function startServer
 * @returns {Promise<void>}
 */
const startServer = async () => {
  try {
    // Initialisation de la base de données
    await initDatabase();

    // Création et configuration du serveur
    const server = http.createServer(requestHandler);

    // Gestion des erreurs serveur
    server.on("error", (error) => {
      console.error("❌ Erreur serveur:", error);
      process.exit(1);
    });

    // Démarrage du serveur
    server.listen(CONFIG.port, () => {
      console.log(`✅ Serveur démarré sur : http://localhost:${CONFIG.port}`);
      console.log(`📝 Environnement : ${CONFIG.env}`);
    });

    // Gestion de l'arrêt gracieux
    process.on("SIGTERM", () => {
      console.log("🛑 Signal SIGTERM reçu. Arrêt gracieux...");
      server.close(() => {
        sequelize.close();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Erreur fatale lors du démarrage:", error);
    process.exit(1);
  }
};

// Démarrage de l'application
startServer();

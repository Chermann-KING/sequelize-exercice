/**
 * @fileoverview Configuration principale de Sequelize pour l'application.
 * Gère la connexion à la base de données, l'initialisation des modèles et leurs associations.
 * @module models/index
 */

import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import { fileURLToPath } from "url";

/**
 * @constant {string} __dirname - Chemin absolu du répertoire courant
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @constant {string} configPath - Chemin vers le fichier de configuration
 */
const configPath = path.join(__dirname, "../config/config.json");

/**
 * @constant {Object} configJson - Configuration de la base de données pour tous les environnements
 * @throws {Error} Si le fichier de configuration est invalide ou inaccessible
 */
const configJson = JSON.parse(fs.readFileSync(configPath, "utf-8"));

/**
 * @constant {string} env - Environnement d'exécution actuel (development, test, production)
 */
const env = process.env.NODE_ENV || "development";

/**
 * @constant {Object} config - Configuration spécifique à l'environnement actuel
 * @property {string} [database] - Nom de la base de données
 * @property {string} [username] - Nom d'utilisateur
 * @property {string} [password] - Mot de passe
 * @property {string} [host] - Hôte de la base de données
 * @property {string} [dialect] - Dialecte SQL (postgres, mysql, etc.)
 * @property {string} [use_env_variable] - Variable d'environnement contenant l'URL de connexion
 */
const config = configJson[env];

/**
 * Instance Sequelize principale
 * @type {import('sequelize').Sequelize}
 */
export const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

/**
 * Objet contenant tous les modèles de l'application
 * @type {Object.<string, import('sequelize').Model>}
 */
export const db = {};

// Import des modèles
/**
 * @typedef {import('./livre/auteur.model.js').default} AuteurModel
 * @typedef {import('./livre/livre.model.js').default} LivreModel
 * @typedef {import('./livre/auteur-livre.model.js').default} AuteurLivreModel
 * @typedef {import('./livre/emprunt.model.js').default} EmpruntModel
 * @typedef {import('./client/client.model.js').default} ClientModel
 */
import Auteur from "./livre/auteur.model.js";
import Livre from "./livre/livre.model.js";
import AuteurLivre from "./livre/auteur-livre.model.js";
import Emprunt from "./livre/emprunt.model.js";
import Client from "./client/client.model.js";

/**
 * Initialisation des modèles avec l'instance Sequelize
 * @type {Object.<string, import('sequelize').Model>}
 */
db.Auteur = Auteur(sequelize);
db.Livre = Livre(sequelize);
db.AuteurLivre = AuteurLivre(sequelize);
db.Emprunt = Emprunt(sequelize);
db.Client = Client(sequelize);

/**
 * Configuration des associations entre les modèles
 * Appelle la méthode associate() de chaque modèle si elle existe
 */
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Logging des modèles chargés
console.log("- Modèles chargés :", Object.keys(db));

/**
 * Ajoute les instances Sequelize à l'objet db
 * @property {import('sequelize').Sequelize} sequelize - Instance Sequelize
 * @property {typeof import('sequelize').Sequelize} Sequelize - Classe Sequelize
 */
db.sequelize = sequelize;
db.Sequelize = Sequelize;

/**
 * Exporte l'objet db contenant tous les modèles et instances Sequelize
 * @exports db
 * @type {Object.<string, import('sequelize').Model | import('sequelize').Sequelize>}
 */
export default db;

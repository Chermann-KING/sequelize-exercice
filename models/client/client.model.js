/**
 * @fileoverview Modèle Sequelize représentant un client de la librairie
 * @module models/client
 * @requires sequelize
 */

import { Model, DataTypes } from "sequelize";

/**
 * Fonction de création du modèle Client
 * @param {import('sequelize').Sequelize} sequelize - L'instance Sequelize
 * @returns {typeof Model} Le modèle Client configuré
 */
export default (sequelize) => {
  /**
   * Classe représentant un client de la librairie
   * @class Client
   * @extends Model
   * @property {string} SSN - Numéro de sécurité sociale du client
   * @property {string} nom - Nom de famille du client
   * @property {string} prenom - Prénom du client
   * @property {string} rue - Nom de la rue de l'adresse
   * @property {string} numero - Numéro de rue
   * @property {string} code_postal - Code postal
   * @property {string} ville - Nom de la ville
   * @property {Date} createdAt - Date de création de l'enregistrement
   * @property {Date} updatedAt - Date de dernière modification
   */
  class Client extends Model {
    /**
     * Définit les associations du modèle Client avec les autres modèles
     * @static
     * @param {Object} models - Les modèles de l'application
     * @param {import('sequelize').Model} models.Emprunt - Le modèle Emprunt
     */
    static associate(models) {
      /**
       * Association avec le modèle Emprunt
       * Un client peut avoir plusieurs emprunts
       */
      Client.hasMany(models.Emprunt, {
        foreignKey: {
          name: "clientSSN",
          allowNull: false,
        },
      });
    }
  }

  /**
   * Configuration des attributs du modèle Client
   * @type {import('sequelize').ModelAttributes}
   */
  const attributes = {
    /**
     * Numéro de sécurité sociale du client
     * @type {import('sequelize').ModelAttributeColumnOptions}
     */
    SSN: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        /**
         * Valide le format du numéro de sécurité sociale
         * @param {string} value - La valeur à valider
         */
        isValidSSN(value) {
          if (!/^\d{15}$/.test(value)) {
            throw new Error("Le SSN doit contenir exactement 15 chiffres");
          }
        },
      },
      comment: "Numéro de sécurité sociale servant d'identifiant unique",
    },
    /**
     * Nom de famille du client
     * @type {import('sequelize').ModelAttributeColumnOptions}
     */
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: "Nom de famille du client",
    },
    /**
     * Prénom du client
     * @type {import('sequelize').ModelAttributeColumnOptions}
     */
    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: "Prénom du client",
    },
    /**
     * Nom de la rue
     * @type {import('sequelize').ModelAttributeColumnOptions}
     */
    rue: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: "Nom de la rue de l'adresse du client",
    },
    /**
     * Numéro de rue
     * @type {import('sequelize').ModelAttributeColumnOptions}
     */
    numero: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: "Numéro de rue de l'adresse du client",
    },
    /**
     * Code postal
     * @type {import('sequelize').ModelAttributeColumnOptions}
     */
    code_postal: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        /**
         * Valide le format du code postal
         * @param {string} value - La valeur à valider
         */
        isValidPostalCode(value) {
          if (!/^\d{5}$/.test(value)) {
            throw new Error(
              "Le code postal doit contenir exactement 5 chiffres"
            );
          }
        },
      },
      comment: "Code postal de l'adresse du client",
    },
    /**
     * Ville
     * @type {import('sequelize').ModelAttributeColumnOptions}
     */
    ville: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: "Ville de résidence du client",
    },
  };

  /**
   * Options de configuration du modèle
   * @type {import('sequelize').ModelOptions}
   */
  const options = {
    sequelize,
    modelName: "Client",
    timestamps: true, // Active createdAt et updatedAt
  };

  // Initialisation du modèle avec ses attributs et options
  Client.init(attributes, options);

  return Client;
};

/**
 * @fileoverview Modèle Sequelize représentant un emprunt de livre dans le système de bibliothèque
 * @module models/emprunt
 * @requires sequelize
 */

import { Model, DataTypes } from "sequelize";

/**
 * Fonction de création du modèle Emprunt
 * @param {import('sequelize').Sequelize} sequelize - L'instance Sequelize
 * @returns {typeof Model} Le modèle Emprunt configuré
 */
export default (sequelize) => {
  /**
   * Classe représentant un emprunt dans la bibliothèque
   * @class Emprunt
   * @extends Model
   * @property {number} numero - Identifiant unique de l'emprunt
   * @property {Date} dateEmprunt - Date de l'emprunt
   * @property {Date} dateRetour - Date de retour du livre (null si non retourné)
   * @property {string} clientSSN - Référence vers le client (clé étrangère)
   * @property {string} livreISBN - Référence vers le livre (clé étrangère)
   * @property {Date} createdAt - Date de création de l'enregistrement
   * @property {Date} updatedAt - Date de dernière modification
   */
  class Emprunt extends Model {
    /**
     * Définit les associations du modèle Emprunt avec les autres modèles
     * @static
     * @param {Object} models - Les modèles de l'application
     * @param {import('sequelize').Model} models.Client - Le modèle Client
     * @param {import('sequelize').Model} models.Livre - Le modèle Livre
     */
    static associate(models) {
      /**
       * Association avec le modèle Client
       * Un emprunt appartient à un client
       */
      Emprunt.belongsTo(models.Client, {
        foreignKey: {
          name: "clientSSN",
          allowNull: false,
        },
      });

      /**
       * Association avec le modèle Livre
       * Un emprunt concerne un livre
       */
      Emprunt.belongsTo(models.Livre, {
        foreignKey: {
          name: "livreISBN",
          allowNull: false,
        },
      });
    }
  }

  /**
   * Configuration des attributs du modèle Emprunt
   * @type {import('sequelize').ModelAttributes}
   */
  const attributes = {
    /**
     * Numéro unique de l'emprunt
     * @type {import('sequelize').ModelAttributeColumnOptions}
     */
    numero: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Identifiant unique auto-incrémenté de l'emprunt",
    },
    /**
     * Date de l'emprunt
     * @type {import('sequelize').ModelAttributeColumnOptions}
     */
    dateEmprunt: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        notEmpty: true,
      },
      comment: "Date à laquelle le livre a été emprunté",
    },
    /**
     * Date de retour du livre
     * @type {import('sequelize').ModelAttributeColumnOptions}
     */
    dateRetour: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true,
        /**
         * Vérifie que la date de retour est postérieure à la date d'emprunt
         * @param {Date} value - La date de retour à valider
         */
        isAfterEmprunt(value) {
          if (value && value < this.dateEmprunt) {
            throw new Error(
              "La date de retour doit être postérieure à la date d'emprunt"
            );
          }
        },
      },
      comment: "Date à laquelle le livre a été retourné (null si non retourné)",
    },
  };

  /**
   * Options de configuration du modèle
   * @type {import('sequelize').ModelOptions}
   */
  const options = {
    sequelize,
    modelName: "Emprunt",
    timestamps: true, // Active createdAt et updatedAt
  };

  // Initialisation du modèle avec ses attributs et options
  Emprunt.init(attributes, options);

  return Emprunt;
};

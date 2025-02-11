/**
 * @fileoverview Modèle Sequelize représentant un auteur et sa relation avec les livres
 * @module models/auteur
 * @requires sequelize
 */

import { Model, DataTypes } from "sequelize";

/**
 * Fonction de création du modèle Auteur
 * @param {import('sequelize').Sequelize} sequelize - L'instance Sequelize
 * @returns {typeof Model} Le modèle Auteur configuré
 */
export default (sequelize) => {
  /**
   * Classe représentant un auteur de livre
   * @class Auteur
   * @extends Model
   * @property {string} id - Identifiant unique de l'auteur
   * @property {string} nom - Nom de l'auteur
   * @property {string} prenom - Prénom de l'auteur
   * @property {Date} dateNaissance - Date de naissance de l'auteur
   * @property {Date} createdAt - Date de création de l'enregistrement
   * @property {Date} updatedAt - Date de dernière modification
   */
  class Auteur extends Model {
    /**
     * Définit les associations du modèle Auteur avec les autres modèles
     * @static
     * @param {Object} models - Les modèles de l'application
     * @param {import('sequelize').Model} models.Livre - Le modèle Livre
     * @param {import('sequelize').Model} models.AuteurLivre - Le modèle de liaison
     */
    static associate(models) {
      /**
       * Association Many-to-Many (N:M) entre Auteur et Livre via la table de jonction AuteurLivre
       * @description
       * - Un auteur peut avoir écrit plusieurs livres
       * - Un livre peut être écrit par plusieurs auteurs
       * - La relation est stockée dans la table AuteurLivre avec :
       *   - auteurId : référence l'auteur
       *   - livreISBN : référence le livre
       *   - role : précise le rôle de l'auteur (principal, co-auteur, contributeur)
       */
      Auteur.belongsToMany(models.Livre, {
        through: models.AuteurLivre,
        foreignKey: "auteurId",
        otherKey: "livreISBN",
      });
    }
  }

  /**
   * Configuration des attributs du modèle Auteur
   * @type {import('sequelize').ModelAttributes}
   */
  const attributes = {
    /**
     * Identifiant unique de l'auteur
     * @type {import('sequelize').ModelAttributeColumnOptions}
     */
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      comment: "Identifiant unique de l'auteur",
    },
    /**
     * Nom de l'auteur
     * @type {import('sequelize').ModelAttributeColumnOptions}
     */
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: "Nom de l'auteur",
    },
    /**
     * Prénom de l'auteur
     * @type {import('sequelize').ModelAttributeColumnOptions}
     */
    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: "Prénom de l'auteur",
    },
    /**
     * Date de naissance de l'auteur
     * @type {import('sequelize').ModelAttributeColumnOptions}
     */
    dateNaissance: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true,
        isPast(value) {
          if (value && value > new Date()) {
            throw new Error("La date de naissance doit être dans le passé");
          }
        },
      },
      comment: "Date de naissance de l'auteur",
    },
  };

  /**
   * Options de configuration du modèle
   * @type {import('sequelize').ModelOptions}
   */
  const options = {
    sequelize,
    modelName: "Auteur",
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ["nom", "prenom"],
      },
    ],
  };

  // Initialisation du modèle avec ses attributs et options
  Auteur.init(attributes, options);

  return Auteur;
};

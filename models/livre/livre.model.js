/**
 * @fileoverview Modèle Sequelize représentant un livre dans le système de librairie
 * @module models/livre
 * @requires sequelize
 */

import { Model, DataTypes } from "sequelize";

/**
 * Fonction de création du modèle Livre
 * @param {import('sequelize').Sequelize} sequelize - L'instance Sequelize
 * @returns {typeof Model} Le modèle Livre configuré
 */
export default (sequelize) => {
  /**
   * Classe représentant un livre dans la librairie
   * @class Livre
   * @extends Model
   * @property {string} ISBN - Identifiant unique du livre (ISBN)
   * @property {string} titre - Titre du livre
   * @property {Objet[]} auteurs - Liste des auteurs du livre
   * @property {Date} dateAchat - Date d'acquisition du livre
   * @property {Date} createdAt - Date de création de l'enregistrement
   * @property {Date} updatedAt - Date de dernière modification
   */
  class Livre extends Model {
    /**
     * Définit les associations du modèle Livre avec les autres modèles
     * @static
     * @param {Object} models - Les modèles de l'application
     * @param {import('sequelize').Model} models.Emprunt - Le modèle Emprunt
     */
    static associate(models) {
      // Un livre peut avoir plusieurs emprunts (relation One-to-Many)
      // Un emprunt ne peut concerner qu'un seul livre
      Livre.hasMany(models.Emprunt, {
        foreignKey: {
          name: "livreISBN",
          allowNull: false,
        },
      });
      /**
       * Association Many-to-Many (N:M) entre Livre et Auteur via la table de jonction AuteurLivre
       * @description
       * - Un livre peut être écrit par plusieurs auteurs
       * - Un auteur peut avoir écrit plusieurs livres
       * - La relation est stockée dans la table AuteurLivre avec :
       *   - livreISBN : référence le livre
       *   - auteurId : référence l'auteur
       */
      Livre.belongsToMany(models.Auteur, {
        through: models.AuteurLivre,
        foreignKey: "livreISBN",
        otherKey: "auteurId",
      });
    }
  }

  /**
   * Configuration des attributs du modèle Livre
   * @type {import('sequelize').ModelAttributes}
   */
  const attributes = {
    /**
     * Identifiant unique du livre
     * @type {import('sequelize').ModelAttributeColumnOptions}
     */
    ISBN: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
      comment: "Numéro ISBN unique servant d'identifiant pour le livre",
    },
    /**
     * Titre du livre
     * @type {import('sequelize').ModelAttributeColumnOptions}
     */
    titre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: "Titre complet du livre",
    },
    /**
     * Liste des auteurs du livre
     * @type {import('sequelize').ModelAttributeColumnOptions}
     */
    auteurs: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment:
        "Liste des auteurs stockée au format JSON (utilisé pour la recherche rapide)",
    },
    /**
     * Date d'acquisition du livre
     * @type {import('sequelize').ModelAttributeColumnOptions}
     */
    dateAchat: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        notEmpty: true,
      },
      comment: "Date à laquelle le livre a été acquis par la librairie",
    },
  };

  /**
   * Options de configuration du modèle
   * @type {import('sequelize').ModelOptions}
   */
  const options = {
    sequelize,
    modelName: "Livre",
    timestamps: true, // Active createdAt et updatedAt
  };

  // Initialisation du modèle avec ses attributs et options
  Livre.init(attributes, options);

  return Livre;
};

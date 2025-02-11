/**
 * @fileoverview Modèle Sequelize de jonction entre Auteur et Livre
 * @module models/auteur-livre
 * @requires sequelize
 */

import { Model, DataTypes } from "sequelize";

/**
 * Fonction de création du modèle de jonction AuteurLivre
 * @param {import('sequelize').Sequelize} sequelize - L'instance Sequelize
 * @returns {typeof Model} Le modèle AuteurLivre configuré
 */
export default (sequelize) => {
  /**
   * Classe représentant la relation entre un auteur et un livre
   * @class AuteurLivre
   * @extends Model
   * @property {string} auteurId - ID de l'auteur
   * @property {string} livreISBN - ISBN du livre
   * @property {string} role - Rôle de l'auteur sur le livre
   * @property {Date} createdAt - Date de création de l'enregistrement
   * @property {Date} updatedAt - Date de dernière modification
   */
  class AuteurLivre extends Model {
    /**
     * Définit les associations du modèle AuteurLivre
     * Cette table de jonction n'a pas besoin de définir d'associations directes
     * car elles sont gérées par les modèles Auteur et Livre
     * @static
     * @param {Object} models - Les modèles de l'application
     */
    static associate(models) {}
  }

  /**
   * Configuration des attributs du modèle AuteurLivre
   * @type {import('sequelize').ModelAttributes}
   */
  const attributes = {
    /**
     * Identifiant de l'auteur
     * @type {import('sequelize').ModelAttributeColumnOptions}
     */
    auteurId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Auteurs",
        key: "id",
      },
      validate: {
        notNull: true,
        notEmpty: true,
      },
      comment: "Référence vers l'ID de l'auteur",
    },
    /**
     * ISBN du livre
     * @type {import('sequelize').ModelAttributeColumnOptions}
     */
    livreISBN: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Livres",
        key: "ISBN",
      },
      validate: {
        notNull: true,
        notEmpty: true,
      },
      comment: "Référence vers l'ISBN du livre",
    },
    /**
     * Rôle de l'auteur sur le livre
     * @type {import('sequelize').ModelAttributeColumnOptions}
     */
    role: {
      type: DataTypes.ENUM("principal", "co-auteur", "contributeur"),
      defaultValue: "principal",
      allowNull: false,
      validate: {
        isIn: {
          args: [["principal", "co-auteur", "contributeur"]],
          msg: "Le rôle doit être 'principal', 'co-auteur' ou 'contributeur'",
        },
      },
      comment: "Rôle de l'auteur sur le livre",
    },
  };

  /**
   * Options de configuration du modèle
   * @type {import('sequelize').ModelOptions}
   */
  const options = {
    sequelize,
    modelName: "AuteurLivre",
    timestamps: true,
    // Index unique pour éviter les doublons d'association auteur-livre
    indexes: [
      {
        unique: true,
        fields: ["auteurId", "livreISBN"],
        name: "unique_auteur_livre",
      },
    ],
    freezeTableName: true,
    tableName: "auteurlivres",
  };

  // Initialisation du modèle avec ses attributs et options
  AuteurLivre.init(attributes, options);

  return AuteurLivre;
};

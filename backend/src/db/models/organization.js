const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const organization = sequelize.define(
    'organization',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  organization.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.organization.hasMany(db.users, {
      as: 'users_organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.organization.hasMany(db.answers, {
      as: 'answers_organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.organization.hasMany(db.practice_exams, {
      as: 'practice_exams_organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.organization.hasMany(db.questions, {
      as: 'questions_organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.organization.hasMany(db.study_materials, {
      as: 'study_materials_organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.organization.hasMany(db.study_plans, {
      as: 'study_plans_organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    //end loop

    db.organization.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.organization.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return organization;
};

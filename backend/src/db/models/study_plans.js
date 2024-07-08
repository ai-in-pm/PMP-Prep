const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const study_plans = sequelize.define(
    'study_plans',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      title: {
        type: DataTypes.TEXT,
      },

      start_date: {
        type: DataTypes.DATE,
      },

      end_date: {
        type: DataTypes.DATE,
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

  study_plans.associate = (db) => {
    db.study_plans.belongsToMany(db.study_materials, {
      as: 'study_materials',
      foreignKey: {
        name: 'study_plans_study_materialsId',
      },
      constraints: false,
      through: 'study_plansStudy_materialsStudy_materials',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.study_plans.belongsTo(db.organization, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.study_plans.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.study_plans.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return study_plans;
};

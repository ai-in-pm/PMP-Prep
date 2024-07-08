const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const study_materials = sequelize.define(
    'study_materials',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      title: {
        type: DataTypes.TEXT,
      },

      description: {
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

  study_materials.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.study_materials.belongsTo(db.organization, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.study_materials.hasMany(db.file, {
      as: 'files',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: db.study_materials.getTableName(),
        belongsToColumn: 'files',
      },
    });

    db.study_materials.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.study_materials.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return study_materials;
};

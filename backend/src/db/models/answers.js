const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const answers = sequelize.define(
    'answers',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      answer_text: {
        type: DataTypes.TEXT,
      },

      is_correct: {
        type: DataTypes.BOOLEAN,

        allowNull: false,
        defaultValue: false,
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

  answers.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.answers.belongsTo(db.organization, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.answers.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.answers.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return answers;
};

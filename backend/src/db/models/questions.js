const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const questions = sequelize.define(
    'questions',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      question_text: {
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

  questions.associate = (db) => {
    db.questions.belongsToMany(db.answers, {
      as: 'answers',
      foreignKey: {
        name: 'questions_answersId',
      },
      constraints: false,
      through: 'questionsAnswersAnswers',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.questions.belongsTo(db.organization, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.questions.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.questions.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return questions;
};

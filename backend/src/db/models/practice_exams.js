const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const practice_exams = sequelize.define(
    'practice_exams',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      title: {
        type: DataTypes.TEXT,
      },

      difficulty: {
        type: DataTypes.INTEGER,
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

  practice_exams.associate = (db) => {
    db.practice_exams.belongsToMany(db.questions, {
      as: 'questions',
      foreignKey: {
        name: 'practice_exams_questionsId',
      },
      constraints: false,
      through: 'practice_examsQuestionsQuestions',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.practice_exams.belongsTo(db.organization, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.practice_exams.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.practice_exams.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return practice_exams;
};

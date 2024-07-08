const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class QuestionsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const questions = await db.questions.create(
      {
        id: data.id || undefined,

        question_text: data.question_text || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await questions.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    await questions.setAnswers(data.answers || [], {
      transaction,
    });

    return questions;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const questionsData = data.map((item, index) => ({
      id: item.id || undefined,

      question_text: item.question_text || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const questions = await db.questions.bulkCreate(questionsData, {
      transaction,
    });

    // For each item created, replace relation files

    return questions;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const questions = await db.questions.findByPk(id, {}, { transaction });

    await questions.update(
      {
        question_text: data.question_text || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await questions.setOrganization(
      (globalAccess ? data.organization : currentUser.organization.id) || null,
      {
        transaction,
      },
    );

    await questions.setAnswers(data.answers || [], {
      transaction,
    });

    return questions;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const questions = await db.questions.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of questions) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of questions) {
        await record.destroy({ transaction });
      }
    });

    return questions;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const questions = await db.questions.findByPk(id, options);

    await questions.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await questions.destroy({
      transaction,
    });

    return questions;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const questions = await db.questions.findOne({ where }, { transaction });

    if (!questions) {
      return questions;
    }

    const output = questions.get({ plain: true });

    output.answers = await questions.getAnswers({
      transaction,
    });

    output.organization = await questions.getOrganization({
      transaction,
    });

    return output;
  }

  static async findAll(filter, globalAccess, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.organization,
        as: 'organization',
      },

      {
        model: db.answers,
        as: 'answers',
        through: filter.answers
          ? {
              where: {
                [Op.or]: filter.answers.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.answers ? true : null,
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.question_text) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'questions',
            'question_text',
            filter.question_text,
          ),
        };
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.organization) {
        var listItems = filter.organization.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          organizationId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.questions.count({
            where: globalAccess ? {} : where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.questions.findAndCountAll({
          where: globalAccess ? {} : where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit, globalAccess, organizationId) {
    let where = {};

    if (!globalAccess && organizationId) {
      where.organizationId = organizationId;
    }

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('questions', 'question_text', query),
        ],
      };
    }

    const records = await db.questions.findAll({
      attributes: ['id', 'question_text'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['question_text', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.question_text,
    }));
  }
};

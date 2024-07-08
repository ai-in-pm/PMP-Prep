const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Practice_examsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const practice_exams = await db.practice_exams.create(
      {
        id: data.id || undefined,

        title: data.title || null,
        difficulty: data.difficulty || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await practice_exams.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    await practice_exams.setQuestions(data.questions || [], {
      transaction,
    });

    return practice_exams;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const practice_examsData = data.map((item, index) => ({
      id: item.id || undefined,

      title: item.title || null,
      difficulty: item.difficulty || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const practice_exams = await db.practice_exams.bulkCreate(
      practice_examsData,
      { transaction },
    );

    // For each item created, replace relation files

    return practice_exams;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const practice_exams = await db.practice_exams.findByPk(
      id,
      {},
      { transaction },
    );

    await practice_exams.update(
      {
        title: data.title || null,
        difficulty: data.difficulty || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await practice_exams.setOrganization(
      (globalAccess ? data.organization : currentUser.organization.id) || null,
      {
        transaction,
      },
    );

    await practice_exams.setQuestions(data.questions || [], {
      transaction,
    });

    return practice_exams;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const practice_exams = await db.practice_exams.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of practice_exams) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of practice_exams) {
        await record.destroy({ transaction });
      }
    });

    return practice_exams;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const practice_exams = await db.practice_exams.findByPk(id, options);

    await practice_exams.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await practice_exams.destroy({
      transaction,
    });

    return practice_exams;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const practice_exams = await db.practice_exams.findOne(
      { where },
      { transaction },
    );

    if (!practice_exams) {
      return practice_exams;
    }

    const output = practice_exams.get({ plain: true });

    output.questions = await practice_exams.getQuestions({
      transaction,
    });

    output.organization = await practice_exams.getOrganization({
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
        model: db.questions,
        as: 'questions',
        through: filter.questions
          ? {
              where: {
                [Op.or]: filter.questions.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.questions ? true : null,
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.title) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('practice_exams', 'title', filter.title),
        };
      }

      if (filter.difficultyRange) {
        const [start, end] = filter.difficultyRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            difficulty: {
              ...where.difficulty,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            difficulty: {
              ...where.difficulty,
              [Op.lte]: end,
            },
          };
        }
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
          count: await db.practice_exams.count({
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
      : await db.practice_exams.findAndCountAll({
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
          Utils.ilike('practice_exams', 'title', query),
        ],
      };
    }

    const records = await db.practice_exams.findAll({
      attributes: ['id', 'title'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['title', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.title,
    }));
  }
};

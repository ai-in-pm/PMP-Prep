const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class AnswersDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const answers = await db.answers.create(
      {
        id: data.id || undefined,

        answer_text: data.answer_text || null,
        is_correct: data.is_correct || false,

        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await answers.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    return answers;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const answersData = data.map((item, index) => ({
      id: item.id || undefined,

      answer_text: item.answer_text || null,
      is_correct: item.is_correct || false,

      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const answers = await db.answers.bulkCreate(answersData, { transaction });

    // For each item created, replace relation files

    return answers;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const answers = await db.answers.findByPk(id, {}, { transaction });

    await answers.update(
      {
        answer_text: data.answer_text || null,
        is_correct: data.is_correct || false,

        updatedById: currentUser.id,
      },
      { transaction },
    );

    await answers.setOrganization(
      (globalAccess ? data.organization : currentUser.organization.id) || null,
      {
        transaction,
      },
    );

    return answers;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const answers = await db.answers.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of answers) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of answers) {
        await record.destroy({ transaction });
      }
    });

    return answers;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const answers = await db.answers.findByPk(id, options);

    await answers.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await answers.destroy({
      transaction,
    });

    return answers;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const answers = await db.answers.findOne({ where }, { transaction });

    if (!answers) {
      return answers;
    }

    const output = answers.get({ plain: true });

    output.organization = await answers.getOrganization({
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
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.answer_text) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('answers', 'answer_text', filter.answer_text),
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

      if (filter.is_correct) {
        where = {
          ...where,
          is_correct: filter.is_correct,
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
          count: await db.answers.count({
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
      : await db.answers.findAndCountAll({
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
          Utils.ilike('answers', 'answer_text', query),
        ],
      };
    }

    const records = await db.answers.findAll({
      attributes: ['id', 'answer_text'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['answer_text', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.answer_text,
    }));
  }
};

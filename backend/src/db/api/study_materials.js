const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Study_materialsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const study_materials = await db.study_materials.create(
      {
        id: data.id || undefined,

        title: data.title || null,
        description: data.description || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await study_materials.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.study_materials.getTableName(),
        belongsToColumn: 'files',
        belongsToId: study_materials.id,
      },
      data.files,
      options,
    );

    return study_materials;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const study_materialsData = data.map((item, index) => ({
      id: item.id || undefined,

      title: item.title || null,
      description: item.description || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const study_materials = await db.study_materials.bulkCreate(
      study_materialsData,
      { transaction },
    );

    // For each item created, replace relation files

    for (let i = 0; i < study_materials.length; i++) {
      await FileDBApi.replaceRelationFiles(
        {
          belongsTo: db.study_materials.getTableName(),
          belongsToColumn: 'files',
          belongsToId: study_materials[i].id,
        },
        data[i].files,
        options,
      );
    }

    return study_materials;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const study_materials = await db.study_materials.findByPk(
      id,
      {},
      { transaction },
    );

    await study_materials.update(
      {
        title: data.title || null,
        description: data.description || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await study_materials.setOrganization(
      (globalAccess ? data.organization : currentUser.organization.id) || null,
      {
        transaction,
      },
    );

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.study_materials.getTableName(),
        belongsToColumn: 'files',
        belongsToId: study_materials.id,
      },
      data.files,
      options,
    );

    return study_materials;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const study_materials = await db.study_materials.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of study_materials) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of study_materials) {
        await record.destroy({ transaction });
      }
    });

    return study_materials;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const study_materials = await db.study_materials.findByPk(id, options);

    await study_materials.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await study_materials.destroy({
      transaction,
    });

    return study_materials;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const study_materials = await db.study_materials.findOne(
      { where },
      { transaction },
    );

    if (!study_materials) {
      return study_materials;
    }

    const output = study_materials.get({ plain: true });

    output.files = await study_materials.getFiles({
      transaction,
    });

    output.organization = await study_materials.getOrganization({
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
        model: db.file,
        as: 'files',
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
          [Op.and]: Utils.ilike('study_materials', 'title', filter.title),
        };
      }

      if (filter.description) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'study_materials',
            'description',
            filter.description,
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
          count: await db.study_materials.count({
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
      : await db.study_materials.findAndCountAll({
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
          Utils.ilike('study_materials', 'title', query),
        ],
      };
    }

    const records = await db.study_materials.findAll({
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

const { v4: uuid } = require('uuid');

module.exports = {
  /**
   * @param{import("sequelize").QueryInterface} queryInterface
   * @return {Promise<void>}
   */
  async up(queryInterface) {
    const createdAt = new Date();
    const updatedAt = new Date();

    /** @type {Map<string, string>} */
    const idMap = new Map();

    /**
     * @param {string} key
     * @return {string}
     */
    function getId(key) {
      if (idMap.has(key)) {
        return idMap.get(key);
      }
      const id = uuid();
      idMap.set(key, id);
      return id;
    }

    await queryInterface.bulkInsert('roles', [
      {
        id: getId('SuperAdmin'),
        name: 'Super Administrator',
        createdAt,
        updatedAt,
      },

      {
        id: getId('Administrator'),
        name: 'Administrator',
        createdAt,
        updatedAt,
      },
      { id: getId('User'), name: 'User', createdAt, updatedAt },
    ]);

    /**
     * @param {string} name
     */
    function createPermissions(name) {
      return [
        {
          id: getId(`CREATE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `CREATE_${name.toUpperCase()}`,
        },
        {
          id: getId(`READ_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `READ_${name.toUpperCase()}`,
        },
        {
          id: getId(`UPDATE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `UPDATE_${name.toUpperCase()}`,
        },
        {
          id: getId(`DELETE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `DELETE_${name.toUpperCase()}`,
        },
      ];
    }

    const entities = [
      'users',
      'answers',
      'organizations',
      'practice_exams',
      'questions',
      'study_materials',
      'study_plans',
      'roles',
      'permissions',
      'organization',
      ,
    ];
    await queryInterface.bulkInsert(
      'permissions',
      entities.flatMap(createPermissions),
    );
    await queryInterface.bulkInsert('permissions', [
      {
        id: getId(`READ_API_DOCS`),
        createdAt,
        updatedAt,
        name: `READ_API_DOCS`,
      },
    ]);
    await queryInterface.bulkInsert('permissions', [
      {
        id: getId(`CREATE_SEARCH`),
        createdAt,
        updatedAt,
        name: `CREATE_SEARCH`,
      },
    ]);

    await queryInterface.bulkUpdate(
      'roles',
      { globalAccess: true },
      { id: getId('SuperAdmin') },
    );

    await queryInterface.sequelize
      .query(`create table "rolesPermissionsPermissions"
(
"createdAt"           timestamp with time zone not null,
"updatedAt"           timestamp with time zone not null,
"roles_permissionsId" uuid                     not null,
"permissionId"        uuid                     not null,
primary key ("roles_permissionsId", "permissionId")
);`);

    await queryInterface.bulkInsert('rolesPermissionsPermissions', [
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('CREATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('READ_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('UPDATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('CREATE_ANSWERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('READ_ANSWERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('UPDATE_ANSWERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('DELETE_ANSWERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('CREATE_PRACTICE_EXAMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('READ_PRACTICE_EXAMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('UPDATE_PRACTICE_EXAMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('DELETE_PRACTICE_EXAMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('CREATE_QUESTIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('READ_QUESTIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('UPDATE_QUESTIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('DELETE_QUESTIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('CREATE_STUDY_MATERIALS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('READ_STUDY_MATERIALS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('UPDATE_STUDY_MATERIALS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('DELETE_STUDY_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('CREATE_STUDY_PLANS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('READ_STUDY_PLANS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('UPDATE_STUDY_PLANS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('DELETE_STUDY_PLANS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('CREATE_ORGANIZATION'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('READ_ORGANIZATION'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('UPDATE_ORGANIZATION'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('DELETE_ORGANIZATION'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('User'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_ANSWERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_ANSWERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_ANSWERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_ANSWERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_PRACTICE_EXAMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_PRACTICE_EXAMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_PRACTICE_EXAMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_PRACTICE_EXAMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_QUESTIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_QUESTIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_QUESTIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_QUESTIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_STUDY_MATERIALS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_STUDY_MATERIALS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_STUDY_MATERIALS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_STUDY_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_STUDY_PLANS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_STUDY_PLANS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_STUDY_PLANS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_STUDY_PLANS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_ORGANIZATION'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_ORGANIZATION'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_ORGANIZATION'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_ORGANIZATION'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_ANSWERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_ANSWERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_ANSWERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_ANSWERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_ORGANIZATIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_ORGANIZATIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_ORGANIZATIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_ORGANIZATIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_PRACTICE_EXAMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_PRACTICE_EXAMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_PRACTICE_EXAMS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_PRACTICE_EXAMS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_QUESTIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_QUESTIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_QUESTIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_QUESTIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_STUDY_MATERIALS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_STUDY_MATERIALS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_STUDY_MATERIALS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_STUDY_MATERIALS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_STUDY_PLANS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_STUDY_PLANS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_STUDY_PLANS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_STUDY_PLANS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_ROLES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_PERMISSIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_ORGANIZATION'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_ORGANIZATION'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('UPDATE_ORGANIZATION'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('DELETE_ORGANIZATION'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('READ_API_DOCS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('SuperAdmin'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_API_DOCS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_SEARCH'),
      },
    ]);

    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'SuperAdmin',
      )}' WHERE "email"='super_admin@flatlogic.com'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'Administrator',
      )}' WHERE "email"='admin@flatlogic.com'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'User',
      )}' WHERE "email"='client@hello.com'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'User',
      )}' WHERE "email"='john@doe.com'`,
    );
  },
};

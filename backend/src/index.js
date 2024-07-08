const express = require('express');
const cors = require('cors');
const app = express();
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const db = require('./db/models');
const config = require('./config');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');
const searchRoutes = require('./routes/search');

const organizationForAuthRoutes = require('./routes/organizationLogin');

const openaiRoutes = require('./routes/openai');

const usersRoutes = require('./routes/users');

const answersRoutes = require('./routes/answers');

const organizationsRoutes = require('./routes/organizations');

const practice_examsRoutes = require('./routes/practice_exams');

const questionsRoutes = require('./routes/questions');

const study_materialsRoutes = require('./routes/study_materials');

const study_plansRoutes = require('./routes/study_plans');

const rolesRoutes = require('./routes/roles');

const permissionsRoutes = require('./routes/permissions');

const organizationRoutes = require('./routes/organization');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Adam 2.0',
      description:
        'Adam 2.0 Online REST API for Testing and Prototyping application. You can perform all major operations with your entities - create, delete and etc.',
    },
    servers: [
      {
        url: config.swaggerUrl,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsDoc(options);
app.use(
  '/api-docs',
  function (req, res, next) {
    swaggerUI.host = req.get('host');
    next();
  },
  swaggerUI.serve,
  swaggerUI.setup(specs),
);

app.use(cors({ origin: true }));
require('./auth/auth');

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);
app.enable('trust proxy');

app.use(
  '/api/users',
  passport.authenticate('jwt', { session: false }),
  usersRoutes,
);

app.use(
  '/api/answers',
  passport.authenticate('jwt', { session: false }),
  answersRoutes,
);

app.use(
  '/api/organizations',
  passport.authenticate('jwt', { session: false }),
  organizationsRoutes,
);

app.use(
  '/api/practice_exams',
  passport.authenticate('jwt', { session: false }),
  practice_examsRoutes,
);

app.use(
  '/api/questions',
  passport.authenticate('jwt', { session: false }),
  questionsRoutes,
);

app.use(
  '/api/study_materials',
  passport.authenticate('jwt', { session: false }),
  study_materialsRoutes,
);

app.use(
  '/api/study_plans',
  passport.authenticate('jwt', { session: false }),
  study_plansRoutes,
);

app.use(
  '/api/roles',
  passport.authenticate('jwt', { session: false }),
  rolesRoutes,
);

app.use(
  '/api/permissions',
  passport.authenticate('jwt', { session: false }),
  permissionsRoutes,
);

app.use(
  '/api/organization',
  passport.authenticate('jwt', { session: false }),
  organizationRoutes,
);

app.use(
  '/api/openai',
  passport.authenticate('jwt', { session: false }),
  openaiRoutes,
);

app.use(
  '/api/search',
  passport.authenticate('jwt', { session: false }),
  searchRoutes,
);

app.use('/api/org-for-auth', organizationForAuthRoutes);

const publicDir = path.join(__dirname, '../public');

if (fs.existsSync(publicDir)) {
  app.use('/', express.static(publicDir));

  app.get('*', function (request, response) {
    response.sendFile(path.resolve(publicDir, 'index.html'));
  });
}

const PORT = process.env.PORT || 8080;

db.sequelize.sync().then(function () {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});

module.exports = app;

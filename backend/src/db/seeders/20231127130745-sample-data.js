const db = require('../models');
const Users = db.users;

const Answers = db.answers;

const Organizations = db.organizations;

const PracticeExams = db.practice_exams;

const Questions = db.questions;

const StudyMaterials = db.study_materials;

const StudyPlans = db.study_plans;

const Organization = db.organization;

const AnswersData = [
  {
    answer_text: 'Initiating',

    is_correct: true,

    // type code here for "relation_one" field
  },

  {
    answer_text: 'Planning',

    is_correct: false,

    // type code here for "relation_one" field
  },

  {
    answer_text: 'Execution',

    is_correct: true,

    // type code here for "relation_one" field
  },

  {
    answer_text: 'Monitoring and Controlling',

    is_correct: true,

    // type code here for "relation_one" field
  },
];

const OrganizationsData = [
  {
    name: 'Project Management Group A',

    description: 'A group focused on PMP exam preparation.',
  },

  {
    name: 'Project Management Group B',

    description: 'Another group focused on PMP exam preparation.',
  },

  {
    name: 'Project Management Group C',

    description: 'Yet another group focused on PMP exam preparation.',
  },

  {
    name: 'Project Management Group D',

    description: 'A different group focused on PMP exam preparation.',
  },
];

const PracticeExamsData = [
  {
    title: 'PMP Practice Exam 1',

    difficulty: 3,

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    title: 'PMP Practice Exam 2',

    difficulty: 2,

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    title: 'PMP Practice Exam 3',

    difficulty: 4,

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    title: 'PMP Practice Exam 4',

    difficulty: 1,

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },
];

const QuestionsData = [
  {
    question_text: 'What is the first process in project management?',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    question_text: 'What is a key output of the planning phase?',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    question_text: 'How do you define project scope?',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    question_text: 'What is the role of a project manager?',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },
];

const StudyMaterialsData = [
  {
    title: 'PMBOK Guide 7th Edition',

    description: 'The latest edition of the PMBOK Guide.',

    // type code here for "files" field

    // type code here for "relation_one" field
  },

  {
    title: 'PMP Exam Prep Book',

    description: 'A comprehensive book for PMP exam preparation.',

    // type code here for "files" field

    // type code here for "relation_one" field
  },

  {
    title: 'Online PMP Course',

    description: 'An online course covering all PMP topics.',

    // type code here for "files" field

    // type code here for "relation_one" field
  },

  {
    title: 'Practice Exam Questions',

    description: 'A collection of practice exam questions.',

    // type code here for "files" field

    // type code here for "relation_one" field
  },
];

const StudyPlansData = [
  {
    title: 'PMP Study Plan 1',

    start_date: new Date('2023-01-01T00:00:00Z'),

    end_date: new Date('2023-03-01T00:00:00Z'),

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    title: 'PMP Study Plan 2',

    start_date: new Date('2023-02-01T00:00:00Z'),

    end_date: new Date('2023-04-01T00:00:00Z'),

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    title: 'PMP Study Plan 3',

    start_date: new Date('2023-03-01T00:00:00Z'),

    end_date: new Date('2023-05-01T00:00:00Z'),

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    title: 'PMP Study Plan 4',

    start_date: new Date('2023-04-01T00:00:00Z'),

    end_date: new Date('2023-06-01T00:00:00Z'),

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },
];

const OrganizationData = [
  {
    name: 'Max von Laue',
  },

  {
    name: 'George Gaylord Simpson',
  },

  {
    name: 'Albrecht von Haller',
  },

  {
    name: 'Theodosius Dobzhansky',
  },
];

// Similar logic for "relation_many"

async function associateUserWithOrganization() {
  const relatedOrganization0 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const User0 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (User0?.setOrganization) {
    await User0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const User1 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (User1?.setOrganization) {
    await User1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const User2 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (User2?.setOrganization) {
    await User2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const User3 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (User3?.setOrganization) {
    await User3.setOrganization(relatedOrganization3);
  }
}

async function associateAnswerWithOrganization() {
  const relatedOrganization0 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Answer0 = await Answers.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Answer0?.setOrganization) {
    await Answer0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Answer1 = await Answers.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Answer1?.setOrganization) {
    await Answer1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Answer2 = await Answers.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Answer2?.setOrganization) {
    await Answer2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Answer3 = await Answers.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Answer3?.setOrganization) {
    await Answer3.setOrganization(relatedOrganization3);
  }
}

// Similar logic for "relation_many"

async function associatePracticeExamWithOrganization() {
  const relatedOrganization0 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const PracticeExam0 = await PracticeExams.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (PracticeExam0?.setOrganization) {
    await PracticeExam0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const PracticeExam1 = await PracticeExams.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (PracticeExam1?.setOrganization) {
    await PracticeExam1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const PracticeExam2 = await PracticeExams.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (PracticeExam2?.setOrganization) {
    await PracticeExam2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const PracticeExam3 = await PracticeExams.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (PracticeExam3?.setOrganization) {
    await PracticeExam3.setOrganization(relatedOrganization3);
  }
}

// Similar logic for "relation_many"

async function associateQuestionWithOrganization() {
  const relatedOrganization0 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Question0 = await Questions.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Question0?.setOrganization) {
    await Question0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Question1 = await Questions.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Question1?.setOrganization) {
    await Question1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Question2 = await Questions.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Question2?.setOrganization) {
    await Question2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Question3 = await Questions.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Question3?.setOrganization) {
    await Question3.setOrganization(relatedOrganization3);
  }
}

async function associateStudyMaterialWithOrganization() {
  const relatedOrganization0 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const StudyMaterial0 = await StudyMaterials.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (StudyMaterial0?.setOrganization) {
    await StudyMaterial0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const StudyMaterial1 = await StudyMaterials.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (StudyMaterial1?.setOrganization) {
    await StudyMaterial1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const StudyMaterial2 = await StudyMaterials.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (StudyMaterial2?.setOrganization) {
    await StudyMaterial2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const StudyMaterial3 = await StudyMaterials.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (StudyMaterial3?.setOrganization) {
    await StudyMaterial3.setOrganization(relatedOrganization3);
  }
}

// Similar logic for "relation_many"

async function associateStudyPlanWithOrganization() {
  const relatedOrganization0 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const StudyPlan0 = await StudyPlans.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (StudyPlan0?.setOrganization) {
    await StudyPlan0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const StudyPlan1 = await StudyPlans.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (StudyPlan1?.setOrganization) {
    await StudyPlan1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const StudyPlan2 = await StudyPlans.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (StudyPlan2?.setOrganization) {
    await StudyPlan2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const StudyPlan3 = await StudyPlans.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (StudyPlan3?.setOrganization) {
    await StudyPlan3.setOrganization(relatedOrganization3);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Answers.bulkCreate(AnswersData);

    await Organizations.bulkCreate(OrganizationsData);

    await PracticeExams.bulkCreate(PracticeExamsData);

    await Questions.bulkCreate(QuestionsData);

    await StudyMaterials.bulkCreate(StudyMaterialsData);

    await StudyPlans.bulkCreate(StudyPlansData);

    await Organization.bulkCreate(OrganizationData);

    await Promise.all([
      // Similar logic for "relation_many"

      await associateUserWithOrganization(),

      await associateAnswerWithOrganization(),

      // Similar logic for "relation_many"

      await associatePracticeExamWithOrganization(),

      // Similar logic for "relation_many"

      await associateQuestionWithOrganization(),

      await associateStudyMaterialWithOrganization(),

      // Similar logic for "relation_many"

      await associateStudyPlanWithOrganization(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('answers', null, {});

    await queryInterface.bulkDelete('organizations', null, {});

    await queryInterface.bulkDelete('practice_exams', null, {});

    await queryInterface.bulkDelete('questions', null, {});

    await queryInterface.bulkDelete('study_materials', null, {});

    await queryInterface.bulkDelete('study_plans', null, {});

    await queryInterface.bulkDelete('organization', null, {});
  },
};

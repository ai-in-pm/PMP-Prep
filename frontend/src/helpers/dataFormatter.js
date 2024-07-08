import dayjs from 'dayjs';
import _ from 'lodash';

export default {
  filesFormatter(arr) {
    if (!arr || !arr.length) return [];
    return arr.map((item) => item);
  },
  imageFormatter(arr) {
    if (!arr || !arr.length) return [];
    return arr.map((item) => ({
      publicUrl: item.publicUrl || '',
    }));
  },
  oneImageFormatter(arr) {
    if (!arr || !arr.length) return '';
    return arr[0].publicUrl || '';
  },
  dateFormatter(date) {
    if (!date) return '';
    return dayjs(date).format('YYYY-MM-DD');
  },
  dateTimeFormatter(date) {
    if (!date) return '';
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  },
  booleanFormatter(val) {
    return val ? 'Yes' : 'No';
  },
  dataGridEditFormatter(obj) {
    return _.transform(obj, (result, value, key) => {
      if (_.isArray(value)) {
        result[key] = _.map(value, 'id');
      } else if (_.isObject(value)) {
        result[key] = value.id;
      } else {
        result[key] = value;
      }
    });
  },

  answersManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.answer_text);
  },
  answersOneListFormatter(val) {
    if (!val) return '';
    return val.answer_text;
  },
  answersManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.answer_text };
    });
  },
  answersOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.answer_text, id: val.id };
  },

  questionsManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.question_text);
  },
  questionsOneListFormatter(val) {
    if (!val) return '';
    return val.question_text;
  },
  questionsManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.question_text };
    });
  },
  questionsOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.question_text, id: val.id };
  },

  study_materialsManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.title);
  },
  study_materialsOneListFormatter(val) {
    if (!val) return '';
    return val.title;
  },
  study_materialsManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.title };
    });
  },
  study_materialsOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.title, id: val.id };
  },

  rolesManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.name);
  },
  rolesOneListFormatter(val) {
    if (!val) return '';
    return val.name;
  },
  rolesManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.name };
    });
  },
  rolesOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.name, id: val.id };
  },

  permissionsManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.name);
  },
  permissionsOneListFormatter(val) {
    if (!val) return '';
    return val.name;
  },
  permissionsManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.name };
    });
  },
  permissionsOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.name, id: val.id };
  },

  organizationManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.name);
  },
  organizationOneListFormatter(val) {
    if (!val) return '';
    return val.name;
  },
  organizationManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.name };
    });
  },
  organizationOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.name, id: val.id };
  },
};

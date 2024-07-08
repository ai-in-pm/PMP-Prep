import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import { update, fetch } from '../../stores/practice_exams/practice_examsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditPractice_exams = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    title: '',

    difficulty: '',

    questions: [],

    organization: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { practice_exams } = useAppSelector((state) => state.practice_exams);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { practice_examsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: practice_examsId }));
  }, [practice_examsId]);

  useEffect(() => {
    if (typeof practice_exams === 'object') {
      setInitialValues(practice_exams);
    }
  }, [practice_exams]);

  useEffect(() => {
    if (typeof practice_exams === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = practice_exams[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [practice_exams]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: practice_examsId, data }));
    await router.push('/practice_exams/practice_exams-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit practice_exams')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit practice_exams'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='Title'>
                <Field name='title' placeholder='Title' />
              </FormField>

              <FormField label='Difficulty'>
                <Field
                  type='number'
                  name='difficulty'
                  placeholder='Difficulty'
                />
              </FormField>

              <FormField label='Questions' labelFor='questions'>
                <Field
                  name='questions'
                  id='questions'
                  component={SelectFieldMany}
                  options={initialValues.questions}
                  itemRef={'questions'}
                  showField={'question_text'}
                ></Field>
              </FormField>

              {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
                <FormField label='organization' labelFor='organization'>
                  <Field
                    name='organization'
                    id='organization'
                    component={SelectField}
                    options={initialValues.organization}
                    itemRef={'organization'}
                    showField={'name'}
                  ></Field>
                </FormField>
              )}

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() =>
                    router.push('/practice_exams/practice_exams-list')
                  }
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditPractice_exams.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_PRACTICE_EXAMS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditPractice_exams;

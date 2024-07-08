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

import { update, fetch } from '../../stores/answers/answersSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditAnswers = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    answer_text: '',

    is_correct: false,

    organization: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { answers } = useAppSelector((state) => state.answers);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { answersId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: answersId }));
  }, [answersId]);

  useEffect(() => {
    if (typeof answers === 'object') {
      setInitialValues(answers);
    }
  }, [answers]);

  useEffect(() => {
    if (typeof answers === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = answers[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [answers]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: answersId, data }));
    await router.push('/answers/answers-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit answers')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit answers'}
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
              <FormField label='AnswerText' hasTextareaHeight>
                <Field
                  name='answer_text'
                  id='answer_text'
                  component={RichTextField}
                ></Field>
              </FormField>

              <FormField label='IsCorrect' labelFor='is_correct'>
                <Field
                  name='is_correct'
                  id='is_correct'
                  component={SwitchField}
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
                  onClick={() => router.push('/answers/answers-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditAnswers.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_ANSWERS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditAnswers;

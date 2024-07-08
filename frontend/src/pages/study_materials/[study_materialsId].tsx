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

import {
  update,
  fetch,
} from '../../stores/study_materials/study_materialsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditStudy_materials = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    title: '',

    description: '',

    files: [],

    organization: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { study_materials } = useAppSelector((state) => state.study_materials);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { study_materialsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: study_materialsId }));
  }, [study_materialsId]);

  useEffect(() => {
    if (typeof study_materials === 'object') {
      setInitialValues(study_materials);
    }
  }, [study_materials]);

  useEffect(() => {
    if (typeof study_materials === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = study_materials[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [study_materials]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: study_materialsId, data }));
    await router.push('/study_materials/study_materials-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit study_materials')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit study_materials'}
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

              <FormField label='Description' hasTextareaHeight>
                <Field
                  name='description'
                  id='description'
                  component={RichTextField}
                ></Field>
              </FormField>

              <FormField>
                <Field
                  label='Files'
                  color='info'
                  icon={mdiUpload}
                  path={'study_materials/files'}
                  name='files'
                  id='files'
                  schema={{
                    size: undefined,
                    formats: undefined,
                  }}
                  component={FormFilePicker}
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
                    router.push('/study_materials/study_materials-list')
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

EditStudy_materials.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_STUDY_MATERIALS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditStudy_materials;

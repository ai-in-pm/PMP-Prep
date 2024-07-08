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

import { update, fetch } from '../../stores/study_plans/study_plansSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditStudy_plans = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    title: '',

    start_date: new Date(),

    end_date: new Date(),

    study_materials: [],

    organization: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { study_plans } = useAppSelector((state) => state.study_plans);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { study_plansId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: study_plansId }));
  }, [study_plansId]);

  useEffect(() => {
    if (typeof study_plans === 'object') {
      setInitialValues(study_plans);
    }
  }, [study_plans]);

  useEffect(() => {
    if (typeof study_plans === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = study_plans[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [study_plans]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: study_plansId, data }));
    await router.push('/study_plans/study_plans-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit study_plans')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit study_plans'}
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

              <FormField label='StartDate'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.start_date
                      ? new Date(
                          dayjs(initialValues.start_date).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, start_date: date })
                  }
                />
              </FormField>

              <FormField label='EndDate'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.end_date
                      ? new Date(
                          dayjs(initialValues.end_date).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, end_date: date })
                  }
                />
              </FormField>

              <FormField label='StudyMaterials' labelFor='study_materials'>
                <Field
                  name='study_materials'
                  id='study_materials'
                  component={SelectFieldMany}
                  options={initialValues.study_materials}
                  itemRef={'study_materials'}
                  showField={'title'}
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
                  onClick={() => router.push('/study_plans/study_plans-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditStudy_plans.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_STUDY_PLANS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditStudy_plans;

import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/answers/answersSlice';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import BaseButton from '../../components/BaseButton';
import BaseDivider from '../../components/BaseDivider';
import { mdiChartTimelineVariant } from '@mdi/js';
import { SwitchField } from '../../components/SwitchField';
import FormField from '../../components/FormField';

import { hasPermission } from '../../helpers/userPermissions';

const AnswersView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { answers } = useAppSelector((state) => state.answers);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { id } = router.query;

  function removeLastCharacter(str) {
    console.log(str, `str`);
    return str.slice(0, -1);
  }

  useEffect(() => {
    dispatch(fetch({ id }));
  }, [dispatch, id]);

  return (
    <>
      <Head>
        <title>{getPageTitle('View answers')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View answers')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>AnswerText</p>
            {answers.answer_text ? (
              <p dangerouslySetInnerHTML={{ __html: answers.answer_text }} />
            ) : (
              <p>No data</p>
            )}
          </div>

          <FormField label='IsCorrect'>
            <SwitchField
              field={{ name: 'is_correct', value: answers?.is_correct }}
              form={{ setFieldValue: () => null }}
              disabled
            />
          </FormField>

          {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
            <div className={'mb-4'}>
              <p className={'block font-bold mb-2'}>organization</p>

              <p>{answers?.organization?.name ?? 'No data'}</p>
            </div>
          )}

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/answers/answers-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

AnswersView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_ANSWERS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default AnswersView;

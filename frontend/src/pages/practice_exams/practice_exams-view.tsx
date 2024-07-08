import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/practice_exams/practice_examsSlice';
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

const Practice_examsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { practice_exams } = useAppSelector((state) => state.practice_exams);

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
        <title>{getPageTitle('View practice_exams')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View practice_exams')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Title</p>
            <p>{practice_exams?.title}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Difficulty</p>
            <p>{practice_exams?.difficulty || 'No data'}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Questions</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr></tr>
                  </thead>
                  <tbody>
                    {practice_exams.questions &&
                      Array.isArray(practice_exams.questions) &&
                      practice_exams.questions.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/questions/questions-view/?id=${item.id}`,
                            )
                          }
                        ></tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!practice_exams?.questions?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
            <div className={'mb-4'}>
              <p className={'block font-bold mb-2'}>organization</p>

              <p>{practice_exams?.organization?.name ?? 'No data'}</p>
            </div>
          )}

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/practice_exams/practice_exams-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

Practice_examsView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_PRACTICE_EXAMS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default Practice_examsView;

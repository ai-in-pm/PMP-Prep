import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/questions/questionsSlice';
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

const QuestionsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { questions } = useAppSelector((state) => state.questions);

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
        <title>{getPageTitle('View questions')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View questions')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>QuestionText</p>
            {questions.question_text ? (
              <p
                dangerouslySetInnerHTML={{ __html: questions.question_text }}
              />
            ) : (
              <p>No data</p>
            )}
          </div>

          <>
            <p className={'block font-bold mb-2'}>Answers</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>IsCorrect</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.answers &&
                      Array.isArray(questions.answers) &&
                      questions.answers.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/answers/answers-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='is_correct'>
                            {dataFormatter.booleanFormatter(item.is_correct)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!questions?.answers?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
            <div className={'mb-4'}>
              <p className={'block font-bold mb-2'}>organization</p>

              <p>{questions?.organization?.name ?? 'No data'}</p>
            </div>
          )}

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/questions/questions-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

QuestionsView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_QUESTIONS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default QuestionsView;

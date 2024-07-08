import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/study_plans/study_plansSlice';
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

const Study_plansView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { study_plans } = useAppSelector((state) => state.study_plans);

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
        <title>{getPageTitle('View study_plans')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View study_plans')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Title</p>
            <p>{study_plans?.title}</p>
          </div>

          <FormField label='StartDate'>
            {study_plans.start_date ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  study_plans.start_date
                    ? new Date(
                        dayjs(study_plans.start_date).format(
                          'YYYY-MM-DD hh:mm',
                        ),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No StartDate</p>
            )}
          </FormField>

          <FormField label='EndDate'>
            {study_plans.end_date ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  study_plans.end_date
                    ? new Date(
                        dayjs(study_plans.end_date).format('YYYY-MM-DD hh:mm'),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No EndDate</p>
            )}
          </FormField>

          <>
            <p className={'block font-bold mb-2'}>StudyMaterials</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                    </tr>
                  </thead>
                  <tbody>
                    {study_plans.study_materials &&
                      Array.isArray(study_plans.study_materials) &&
                      study_plans.study_materials.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/study_materials/study_materials-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='title'>{item.title}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!study_plans?.study_materials?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
            <div className={'mb-4'}>
              <p className={'block font-bold mb-2'}>organization</p>

              <p>{study_plans?.organization?.name ?? 'No data'}</p>
            </div>
          )}

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/study_plans/study_plans-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

Study_plansView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_STUDY_PLANS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default Study_plansView;

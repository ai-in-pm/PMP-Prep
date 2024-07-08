import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/organization/organizationSlice';
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

const OrganizationView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { organization } = useAppSelector((state) => state.organization);

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
        <title>{getPageTitle('View organization')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View organization')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Name</p>
            <p>{organization?.name}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Users Organization</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>First Name</th>

                      <th>Last Name</th>

                      <th>Phone Number</th>

                      <th>E-Mail</th>

                      <th>Disabled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organization.users_organization &&
                      Array.isArray(organization.users_organization) &&
                      organization.users_organization.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/users/users-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='firstName'>{item.firstName}</td>

                          <td data-label='lastName'>{item.lastName}</td>

                          <td data-label='phoneNumber'>{item.phoneNumber}</td>

                          <td data-label='email'>{item.email}</td>

                          <td data-label='disabled'>
                            {dataFormatter.booleanFormatter(item.disabled)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!organization?.users_organization?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Answers organization</p>
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
                    {organization.answers_organization &&
                      Array.isArray(organization.answers_organization) &&
                      organization.answers_organization.map((item: any) => (
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
              {!organization?.answers_organization?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>
              Practice_exams organization
            </p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>

                      <th>Difficulty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organization.practice_exams_organization &&
                      Array.isArray(organization.practice_exams_organization) &&
                      organization.practice_exams_organization.map(
                        (item: any) => (
                          <tr
                            key={item.id}
                            onClick={() =>
                              router.push(
                                `/practice_exams/practice_exams-view/?id=${item.id}`,
                              )
                            }
                          >
                            <td data-label='title'>{item.title}</td>

                            <td data-label='difficulty'>{item.difficulty}</td>
                          </tr>
                        ),
                      )}
                  </tbody>
                </table>
              </div>
              {!organization?.practice_exams_organization?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Questions organization</p>
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
                    {organization.questions_organization &&
                      Array.isArray(organization.questions_organization) &&
                      organization.questions_organization.map((item: any) => (
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
              {!organization?.questions_organization?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>
              Study_materials organization
            </p>
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
                    {organization.study_materials_organization &&
                      Array.isArray(
                        organization.study_materials_organization,
                      ) &&
                      organization.study_materials_organization.map(
                        (item: any) => (
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
                        ),
                      )}
                  </tbody>
                </table>
              </div>
              {!organization?.study_materials_organization?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Study_plans organization</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>

                      <th>StartDate</th>

                      <th>EndDate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organization.study_plans_organization &&
                      Array.isArray(organization.study_plans_organization) &&
                      organization.study_plans_organization.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/study_plans/study_plans-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='title'>{item.title}</td>

                          <td data-label='start_date'>
                            {dataFormatter.dateTimeFormatter(item.start_date)}
                          </td>

                          <td data-label='end_date'>
                            {dataFormatter.dateTimeFormatter(item.end_date)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!organization?.study_plans_organization?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/organization/organization-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

OrganizationView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_ORGANIZATION'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default OrganizationView;

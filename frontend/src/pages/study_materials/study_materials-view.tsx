import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/study_materials/study_materialsSlice';
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

const Study_materialsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { study_materials } = useAppSelector((state) => state.study_materials);

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
        <title>{getPageTitle('View study_materials')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View study_materials')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Title</p>
            <p>{study_materials?.title}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Description</p>
            {study_materials.description ? (
              <p
                dangerouslySetInnerHTML={{
                  __html: study_materials.description,
                }}
              />
            ) : (
              <p>No data</p>
            )}
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Files</p>
            {study_materials?.files?.length ? (
              dataFormatter
                .filesFormatter(study_materials.files)
                .map((link) => (
                  <button
                    key={link.publicUrl}
                    onClick={(e) => saveFile(e, link.publicUrl, link.name)}
                  >
                    {link.name}
                  </button>
                ))
            ) : (
              <p>No Files</p>
            )}
          </div>

          {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
            <div className={'mb-4'}>
              <p className={'block font-bold mb-2'}>organization</p>

              <p>{study_materials?.organization?.name ?? 'No data'}</p>
            </div>
          )}

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/study_materials/study_materials-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

Study_materialsView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_STUDY_MATERIALS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default Study_materialsView;

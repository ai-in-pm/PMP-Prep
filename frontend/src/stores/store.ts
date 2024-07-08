import { configureStore } from '@reduxjs/toolkit';
import styleReducer from './styleSlice';
import mainReducer from './mainSlice';
import authSlice from './authSlice';
import openAiSlice from './openAiSlice';

import usersSlice from './users/usersSlice';
import answersSlice from './answers/answersSlice';
import organizationsSlice from './organizations/organizationsSlice';
import practice_examsSlice from './practice_exams/practice_examsSlice';
import questionsSlice from './questions/questionsSlice';
import study_materialsSlice from './study_materials/study_materialsSlice';
import study_plansSlice from './study_plans/study_plansSlice';
import rolesSlice from './roles/rolesSlice';
import permissionsSlice from './permissions/permissionsSlice';
import organizationSlice from './organization/organizationSlice';

export const store = configureStore({
  reducer: {
    style: styleReducer,
    main: mainReducer,
    auth: authSlice,
    openAi: openAiSlice,

    users: usersSlice,
    answers: answersSlice,
    organizations: organizationsSlice,
    practice_exams: practice_examsSlice,
    questions: questionsSlice,
    study_materials: study_materialsSlice,
    study_plans: study_plansSlice,
    roles: rolesSlice,
    permissions: permissionsSlice,
    organization: organizationSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

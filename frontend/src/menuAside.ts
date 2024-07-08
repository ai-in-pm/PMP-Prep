import * as icon from '@mdi/js';
import { MenuAsideItem } from './interfaces';

const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: icon.mdiViewDashboardOutline,
    label: 'Dashboard',
  },

  {
    href: '/users/users-list',
    label: 'Users',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiAccountGroup ? icon.mdiAccountGroup : icon.mdiTable,
    permissions: 'READ_USERS',
  },
  {
    href: '/answers/answers-list',
    label: 'Answers',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiCheckCircle ? icon.mdiCheckCircle : icon.mdiTable,
    permissions: 'READ_ANSWERS',
  },
  {
    href: '/organizations/organizations-list',
    label: 'Organizations',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiDomain ? icon.mdiDomain : icon.mdiTable,
    permissions: 'READ_ORGANIZATIONS',
  },
  {
    href: '/practice_exams/practice_exams-list',
    label: 'Practice exams',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiClipboardList ? icon.mdiClipboardList : icon.mdiTable,
    permissions: 'READ_PRACTICE_EXAMS',
  },
  {
    href: '/questions/questions-list',
    label: 'Questions',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiHelpCircle ? icon.mdiHelpCircle : icon.mdiTable,
    permissions: 'READ_QUESTIONS',
  },
  {
    href: '/study_materials/study_materials-list',
    label: 'Study materials',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiBookOpenPageVariant
      ? icon.mdiBookOpenPageVariant
      : icon.mdiTable,
    permissions: 'READ_STUDY_MATERIALS',
  },
  {
    href: '/study_plans/study_plans-list',
    label: 'Study plans',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiCalendar ? icon.mdiCalendar : icon.mdiTable,
    permissions: 'READ_STUDY_PLANS',
  },
  {
    href: '/roles/roles-list',
    label: 'Roles',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiShieldAccountVariantOutline
      ? icon.mdiShieldAccountVariantOutline
      : icon.mdiTable,
    permissions: 'READ_ROLES',
  },
  {
    href: '/permissions/permissions-list',
    label: 'Permissions',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiShieldAccountOutline
      ? icon.mdiShieldAccountOutline
      : icon.mdiTable,
    permissions: 'READ_PERMISSIONS',
  },
  {
    href: '/organization/organization-list',
    label: 'Organization',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiTable ? icon.mdiTable : icon.mdiTable,
    permissions: 'READ_ORGANIZATION',
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: icon.mdiAccountCircle,
  },
  {
    href: '/api-docs',
    target: '_blank',
    label: 'Swagger API',
    icon: icon.mdiFileCode,
    permissions: 'READ_API_DOCS',
  },
];

export default menuAside;

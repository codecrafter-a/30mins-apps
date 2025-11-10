import {
  BriefcaseIcon,
  CalendarIcon,
  CashIcon,
  ChartBarIcon,
  CogIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  DesktopComputerIcon,
  DocumentIcon,
  GiftIcon,
  HomeIcon,
  LockClosedIcon,
  PlusIcon,
  PuzzleIcon,
  KeyIcon,
  QuestionMarkCircleIcon,
  SpeakerphoneIcon,
  UserIcon,
  UsersIcon,
  ChartPieIcon,
  ChatIcon,
} from '@heroicons/react/solid';

export const users = [
  {name: 'Welcome', href: '/user/welcome', icon: HomeIcon},
  {name: 'Profile', href: '/user/profile', icon: UserIcon},
  {name: 'Calendar Integrations', href: '/user/integrations', icon: CogIcon},
  {name: 'Chat', href: '/user/chat', icon: ChatIcon},
  {name: 'My Meetings', href: '/user/meetings', icon: CalendarIcon},
  {name: 'Services', href: '/user/services', icon: DesktopComputerIcon},
  {name: 'Organizations', href: '/user/organizations', icon: BriefcaseIcon},
  {name: 'Extensions', href: '/user/extensions', icon: PuzzleIcon},
  {name: 'Collective Availability', href: '/user/availability', icon: PlusIcon},
  {name: 'FAQ', href: '/user/faq', icon: QuestionMarkCircleIcon},
  {name: 'Spread the Word', href: '/user/spreadword', icon: SpeakerphoneIcon},
  {
    name: 'Payments',
    href: '#',
    icon: CashIcon,
    children: [
      {name: 'Billing Address', href: '/user/billing', icon: CashIcon},
      {
        name: 'Receiving Payments',
        href: '/user/paymentOptions',
        icon: CurrencyDollarIcon,
      },
      {name: 'Making Payments', href: '/user/extensions/billing', icon: CreditCardIcon},
    ],
  },
];

export const admin = [
  {name: 'Welcome', href: '/user/welcome', icon: HomeIcon},
  {name: 'Profile', href: '/user/profile', icon: UserIcon},
  {name: 'My Meetings', href: '/user/meetings', icon: CalendarIcon},
  {name: 'Calendar Integrations', href: '/user/integrations', icon: CogIcon},
  {name: 'Chat', href: '/user/chat', icon: ChatIcon},
  {name: 'Services', href: '/user/services', icon: DesktopComputerIcon},
  {name: 'Organizations', href: '/user/organizations', icon: BriefcaseIcon},
  {name: 'Extensions', href: '/user/extensions', icon: PuzzleIcon},
  {name: 'Collective Availability', href: '/user/availability', icon: PlusIcon},
  {name: 'FAQ', href: '/user/faq', icon: QuestionMarkCircleIcon},
  {name: 'Spread the Word', href: '/user/spreadword', icon: SpeakerphoneIcon},
  {
    name: 'Payments',
    href: '#',
    icon: CashIcon,
    children: [
      {name: 'Billing Address', href: '/user/billing', icon: CashIcon},
      {
        name: 'Receiving Payments',
        href: '/user/paymentOptions',
        icon: CurrencyDollarIcon,
      },
      {name: 'Making Payments', href: '/user/extensions/billing', icon: CreditCardIcon},
    ],
  },
  {
    name: 'Admin',
    href: '#',
    icon: LockClosedIcon,
    children: [
      {name: 'Dashboard', href: '/user/admindashboard', icon: ChartPieIcon},
      {name: 'All users', href: '/user/allusers', icon: UsersIcon},
      {name: 'All Meetings', href: '/user/allmeetings', icon: DocumentIcon},
      {name: 'All Organzation', href: '/user/allOrganizations', icon: BriefcaseIcon},
      {name: 'All Logs', href: '/user/logs', icon: ChartBarIcon},
      {name: 'All Services', href: '/user/allServices', icon: DesktopComputerIcon},
      {name: 'All Extensions', href: '/user/allExtensions', icon: PuzzleIcon},
      {name: 'Misc', href: '/user/miscellaneous', icon: KeyIcon},
      {name: 'Charity', href: '/user/charity', icon: GiftIcon},
    ],
  },
];

export const marketer = [
  {
    name: 'Affiliate',
    href: '#',
    icon: LockClosedIcon,
    children: [
      {name: 'Dashboard', href: '/user/affiliatedashboard', icon: UsersIcon},
      {name: 'Import Users', href: '/user/affiliate', icon: UsersIcon},
    ],
  },
];

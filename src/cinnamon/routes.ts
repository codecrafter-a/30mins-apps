import {
  BriefcaseIcon,
  CalendarIcon,
  CashIcon,
  ChartBarIcon,
  CogIcon,
  DesktopComputerIcon,
  DocumentIcon,
  GiftIcon,
  HomeIcon,
  LockClosedIcon,
  PuzzleIcon,
  KeyIcon,
  QuestionMarkCircleIcon,
  SpeakerphoneIcon,
  UserIcon,
  UsersIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  PlusIcon,
  ChatAlt2Icon,
  FolderAddIcon,
  ChartPieIcon,
} from '@heroicons/react/outline';

const welcome = {name: 'Welcome', href: '/user/welcome', icon: HomeIcon};

const payments = [
  {name: 'Billing Address', href: '/user/billing', icon: CashIcon},
  {name: 'Receiving Payments', href: '/user/paymentOptions', icon: CurrencyDollarIcon},
  {name: 'Making Payments', href: '/user/extensions/billing', icon: CreditCardIcon},
];

const provider = [
  {name: 'Profile', href: '/user/profile', icon: UserIcon},
  {name: 'Calendar Integrations', href: '/user/integrations', icon: CogIcon},
  {name: 'My Meetings', href: '/user/meetings', icon: CalendarIcon},
  {name: 'My Orders', href: '/user/orders', icon: FolderAddIcon},
  {name: 'Chat', href: '/user/chat', icon: ChatAlt2Icon},
  {name: 'Services', href: '/user/services', icon: DesktopComputerIcon},
  {name: 'Organizations', href: '/user/organizations', icon: BriefcaseIcon},
  {name: 'Pending Invites', href: '/user/pendingOrganizationInvites', icon: SpeakerphoneIcon},
  {name: 'Extensions', href: '/user/extensions', icon: PuzzleIcon},
  {name: 'Collective Availability', href: '/user/availability', icon: PlusIcon},
  {name: 'Payments', href: '#', icon: CashIcon, children: payments},
  {name: 'FAQ', href: '/user/faq', icon: QuestionMarkCircleIcon},
  {name: 'Spread the Word', href: '/user/spreadword', icon: SpeakerphoneIcon},
];

const admin = [
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

const marketer = [
  {
    name: 'Affiliate',
    href: '#',
    icon: BriefcaseIcon,
    children: [
      {name: 'Dashboard', href: '/user/affiliatedashboard', icon: ChartPieIcon},
      {name: 'Import Users', href: '/user/affiliate', icon: UsersIcon},
    ],
  },
];

export {welcome, provider, admin, marketer};

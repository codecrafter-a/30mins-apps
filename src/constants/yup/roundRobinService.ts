import * as Yup from 'yup';

// const ValidateURL =
//   /((https?):\/\/)(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

export const ROUND_ROBIN_SERVICE_STATE = {
  title: '',
  slug: '',
  duration: 15,
  price: 0,
  currency: '$',
  charity: '',
  percentDonated: null,
  paymentType: 'escrow',
  description: '',
  authenticationType: 'NONE',
  recurringInterval: 'weekly',
  conferenceType: [],
  media: {
    type: '',
    link: '',
  },
  serviceWorkingHours: {
    isCustomEnabled: false,
    monday: {
      isActive: false,
      start: undefined,
      end: undefined,
    },
    tuesday: {
      isActive: false,
      start: undefined,
      end: undefined,
    },
    wednesday: {
      isActive: false,
      start: undefined,
      end: undefined,
    },
    thursday: {
      isActive: false,
      start: undefined,
      end: undefined,
    },
    friday: {
      isActive: false,
      start: undefined,
      end: undefined,
    },
    saturday: {
      isActive: false,
      start: undefined,
      end: undefined,
    },
    sunday: {
      isActive: false,
      start: undefined,
      end: undefined,
    },
  },
  isPrivate: false,
  isPaid: false,
  hasReminder: false,
  isRecurring: false,
  isOrgService: false,
  organizationId: '',
  organizationName: '',
  orgServiceCategory: '',
  bookingQuestions: [],
  whiteList: {
    emails: [],
    domains: [],
  },
  blackList: {
    domains: [],
    emails: [],
  },
  // emailFilter: {
  //   type: 'BLACK_LIST',
  //   emails: [],
  //   domains: [],
  // },
  roundRobinTeam: {
    _id: '',
  },
};

const regex =
  // eslint-disable-next-line no-useless-escape
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

export const ROUND_ROBIN_SERVICE_YUP = Yup.object().shape({
  roundRobinTeam: Yup.object().shape({_id: Yup.string().required().label('Assigned Team')}),
  title: Yup.string().required('Required').max(160, 'Must be 160 characters or less'),
  slug: Yup.string()
    .required('Required')
    .max(254, 'Must be 254 characters or less')
    .matches(/^[a-zA-Z0-9\-._]*$/, 'No Special Characters Allowed'),
  duration: Yup.number().min(5).max(300).required('Required'),
  conferenceType: Yup.array().min(1, 'At least one element is required').required('Required'),
  description: Yup.string().required().max(757).label('Description'),
  percentDonated: Yup.string().when('charity', {
    is: value => value && value.length > 0 && value !== '',
    then: Yup.string().required('Required'),
    otherwise: Yup.string().nullable(),
  }),
  paymentType: Yup.string().when('isPaid', {
    is: value => value === true,
    then: Yup.string().required('Required'),
    otherwise: Yup.string().nullable(),
  }),
  media: Yup.object()
    .shape({
      type: Yup.string(),
      link: Yup.string(),
    })
    .test({
      // eslint-disable-next-line @typescript-eslint/no-shadow
      test: ({type, link}) => {
        console.log('type, link: ', type, link);
        if (type === 'None' || type === '' || type === undefined) {
          return true;
        }
        const valid = regex.test(link!);
        return valid;
      },
      message(params) {
        params.path = '[media].[link]';
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const {type, link} = params.value;
        let message = 'profile:txt_media_link_error';
        if (type === 'Google Slides') {
          message = link?.startsWith('https://docs.google.com/presentation/')
            ? ''
            : 'Expected Google Link: https://docs.google.com/presentation/30mins';
        }

        if (type === 'Youtube Embed') {
          message = link?.startsWith('https://www.youtube.com/watch?v=')
            ? ''
            : 'Expected YouTube Link: https://www.youtube.com/watch?v=30mins';
        }
        return message;
      },
    }),
});

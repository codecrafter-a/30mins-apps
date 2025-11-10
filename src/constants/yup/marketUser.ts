import * as Yup from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const MARKET_USER_YUP = Yup.object().shape({
  username: Yup.string()
    .required('Required')
    .label('Username')
    .max(254, 'Must be 254 characters or less')
    .matches(/^[a-zA-Z0-9\-._]*$/, 'Letters and numbers only'),
  fullName: Yup.string()
    .required('Required')
    .label('Full Name')
    .max(254, 'Must be 254 characters or less')
    .matches(/^[a-zA-Z0-9 ]+$/, 'Letters and numbers only'),
  description: Yup.string().max(750, 'Must be 750 characters or less'),
  country: Yup.string(),
  zipCode: Yup.string()
    .max(15, 'Must be 15 characters or less')
    .matches(/^[0-9a-zA-Z ]+$/, 'Numbers and letters only'),
  email: Yup.string().email().max(150).required().label('Email'),
  headline: Yup.string().max(150).required().label('Headline'),
  timezone: Yup.string().required('Required'),
});

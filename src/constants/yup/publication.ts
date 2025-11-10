import * as Yup from 'yup';

const ValidateURL =
  /((https?):\/\/)(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

export const PUBLICATION_STATE = {
  headline: '',
  type: 'Book',
  description: '',
  image: '',
  url: '',
};

export const PUBLICATION_YUP = Yup.object().shape({
  headline: Yup.string().required('Required').max(160, 'Must be 160 characters or less'),
  type: Yup.string().required('Required'),
  description: Yup.string().required('Required').max(750, 'Must be 750 characters or less'),
  url: Yup.string().required('Required').max(254).matches(ValidateURL, 'Enter a valid URL'),
});

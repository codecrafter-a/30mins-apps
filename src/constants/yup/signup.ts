import * as Yup from 'yup';

export const SIGNUP_STATE = {
  email: '',
  name: '',
  username: '',
};

export const SINGUP_YUP = Yup.object().shape({
  name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required().label('Name'),
  email: Yup.string().email().max(150).required().label('Email'),
});

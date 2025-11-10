/* eslint-disable import/no-named-as-default-member */
// import {useMutation} from '@apollo/client';
import {GetServerSideProps} from 'next';
import {getSession, signIn} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Recaptcha from 'react-google-recaptcha';
import {useRouter} from 'next/router';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
// import integrationQueries from 'constants/GraphQL/Integrations/queries';
import userQueries from 'constants/GraphQL/User/queries';
// import queries from 'constants/GraphQL/User/queries';
import {MODAL_TYPES} from 'constants/context/modals';
import toast from 'react-hot-toast';
// import axios from 'axios';
import {isValidPhoneNumber} from 'react-phone-number-input';
import PostLoginLayout from '@root/components/layout/post-login';
import Header from '@root/components/header';
import stripeProductIDs from 'constants/stripeProductIDs';
import {useFormik} from 'formik';
import Field from '@root/components/forms/field';
import {XIcon} from '@heroicons/react/outline';
import PhoneInput from 'react-phone-input-2';
import {useContext, useEffect, useRef, useState} from 'react';
// import CheckBox from '@root/components/forms/checkbox';
import {UserContext} from '@root/context/user';
import {ModalContextProvider} from 'store/Modal/Modal.context';

import {FieldError} from '@root/components/forms/error';
import Button from '@root/components/button';

const Sms = ({errors, hasExtension, bookerEmail}) => {
  const [country, setCountry] = useState('us');
  const {t} = useTranslation();
  const recaptchaRef = useRef<Recaptcha>();
  const {pathname} = useRouter();
  const {showModal} = ModalContextProvider();
  const {refetchUser} = useContext(UserContext);
  const {values, setFieldValue} = useFormik({
    initialValues: {
      inputOTP: '',
      error: '',
      loading: false,
      verifying: false,
      bookerEmail,
      checkBox: false,
    },
    validateOnChange: false,
    onSubmit: () => {},
  });
  // const authenticationType = values?.authenticationType;
  // const showMeetingOTP = async () => {
  //   try {
  //     const data = await signInSubmitHandler();
  //     console.log(data);
  //   } catch (e) {
  //     return null;
  //   }
  // };
  const signInSubmitHandler = async () => {
    console.log('hey calling-11');

    try {
      // let captchaToken = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();
      console.log('hey calling');
      // let data = await axios.post('/api/otp/handleOtpSignIn', {
      //   email: 'mishrapooja8128@gmail.com',
      //   captchaToken,
      // });
      // if (data.status === 201) {
      //   captchaToken = await recaptchaRef.current.executeAsync();
      //   recaptchaRef.current.reset();
      //   data = await axios.post('/api/otp/handleOtpSignUp', {
      //     email: 'pooja',
      //     name: 'values?.bookingData?.bookerName',
      //     captchaToken,
      //   });
      //   if (data.status === 200) {
      //     return true;
      //   }
      //   return false;
      // }
      // return true;
      // eslint-disable-next-line no-empty
    } catch (err) {
      console.log(err);
    }
    return false;
  };
  useEffect(() => {
    if (pathname.split('/')[3] === 'sms') {
      signInSubmitHandler();
    }
  }, []);
  const otpSubmitHandler = async () => {
    setFieldValue('verifying', true);
    console.log(bookerEmail, 'bookerEmailbookerEmail');
    const response = await signIn('credentials', {
      email: bookerEmail,
      otpToken: values.inputOTP,
      redirect: false,
    });
    if (response?.status === 401) {
      setFieldValue('verifying', false);
      return;
    }
    console.log(response, 'Respspps');
    if (response?.status === 200) {
      const id = toast.loading(<p className='text-mainBlue'>{'Loading'}</p>);
      const data: any = await refetchUser();
      console.log(data, 'datadatadata');
      toast.dismiss(id);
      if (data) {
        showModal(MODAL_TYPES.MEETING_OTP, {});
        console.log('hey Pooja');
      }
      const verifiedAccount = data?.data?.getUserById?.userData?.accountDetails?.verifiedAccount;
      console.log(verifiedAccount, 'verifiedAccountverifiedAccount');
    }
  };

  const crumbs = [{title: t('page:Home'), href: '/'}];
  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('common:txt_sms_extension')} />
      {hasExtension ? (
        <div className='flex flex-col items-center w-100	'>
          <Recaptcha
            ref={recaptchaRef}
            size='invisible'
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_ID}
          />
          <div className='flex gap-2 flex-col '>
            <div className=' md:flex justify-between items-center mt-5'>
              <form
                className='flex mt-15 w-full '
                onSubmit={el => {
                  el.preventDefault();
                }}
              >
                <div
                  className={
                    'col-span-4 xl:col-span-2 flex flex-col flex-grow justify-start align-center mr-6 '
                  }
                >
                  <Field
                    label={t('common:phone_number')}
                    required
                    error={
                      // errors?.bookingData?.bookerPhone == null ? (
                      <FieldError message={errors?.bookingData?.bookerPhone} />
                      // ): ''
                    }
                  >
                    <div className='items-center flex w-full	'>
                      <PhoneInput
                        inputStyle={{width: '100%', padding: '22px 50px'}}
                        // value={`${values.bookingData.bookerPhone}`}
                        value=''
                        country={country}
                        countryCodeEditable={false}
                        onChange={(_, country1: any, {target: {value}}) => {
                          const {countryCode} = country1;
                          setCountry(countryCode);
                          if (isValidPhoneNumber(value ? value : '', countryCode)) {
                            setFieldValue('PhoneValid', true);
                            // setFieldError('bookingData.bookerPhone', undefined);
                          } else {
                            setFieldValue('PhoneValid', false);
                            // setFieldError('bookingData.bookerPhone', t('phone_number_invalid'));
                          }
                          setFieldValue('bookingData.bookerPhone', value);
                        }}
                        // isValid={values}
                        inputProps={{
                          id: 'bookingData.bookerPhone',
                        }}
                      />
                    </div>
                  </Field>

                  <div className='flex items-start my-2'>
                    <XIcon className='close-icon sm:w-7 w-16  mt-1 border-2 border-slate-400	' />
                    <label
                      htmlFor=''
                      className='text-gray-600 font-medium text-sm xl:text-base	 ml-2  max-w-md'
                    >
                      Send me reminders via SMS/Text messages. Message and data rates may apply.
                      Reminders only supported for US Numbers
                    </label>
                  </div>
                  {/* <CheckBox
                  
                    key={1}
                    code={'Yes'}
                    
                    label={
                      
                      'Send me reminders via SMS/Text messages. Message and data  rates may apply. Reminders only supported for US Numbers'
                    }
                   
                    handleChange={e => {
                      setFieldValue('checkBox', e.target.checked);
                    }}
                   
                    selected={values?.checkBox}
                    style='text-gray-600 font-medium text-sm xl:text-base ml-1 '
                  /> */}
                </div>
                <div className='py-3  flex flex-row-reverse flex-wrap sm:flex-nowrap relative top-5'>
                  <Button
                    onClick={() => {
                      // showMeetingOTP();
                      otpSubmitHandler();
                    }}
                    variant='solid'
                    type={'submit'}
                    className='w-full justify-center items-center px-8 '
                  >
                    {t('common:verify_otp')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </PostLoginLayout>
  );
};
export default Sms;

Sms.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  try {
    const {data: user} = await graphqlRequestHandler(
      userQueries.getUserById,
      {
        token: session?.accessToken,
      },
      process.env.BACKEND_API_KEY
    );
    const hasExtension =
      user?.data?.getUserById?.userData?.accountDetails?.activeExtensions.includes(
        stripeProductIDs.EXTENSIONS.ZOOM
      );

    return {
      props: {
        hasExtension,
      },
    };
  } catch (err) {
    return {
      props: {
        errors: 'Unknown Error',
        hasExtension: false,
      },
    };
  }
};

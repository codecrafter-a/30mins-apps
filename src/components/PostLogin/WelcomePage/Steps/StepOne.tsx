import {useSession} from 'next-auth/react';
import {WELCOME_STEP_ONE} from 'constants/yup/welcome';
import {Form, Formik} from 'formik';
import {useMutation} from '@apollo/client';
import Countries from 'constants/forms/country.json';
import timezones from 'constants/forms/timezones.json';
import useTranslation from 'next-translate/useTranslation';
import {singleUpload} from 'constants/GraphQL/Shared/mutations';
import {useContext, useState} from 'react';
import Image from 'next/image';
import {FieldError} from '@root/components/forms/error';
import Field from '@root/components/forms/field';
import Input from '@root/components/forms/input';
import {UserContext} from '@root/context/user';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import mutations from '../../../../constants/GraphQL/User/mutations';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const StepOne = ({handleClick, prev, User}) => {
  const {data: session} = useSession();
  const {user, setUser} = useContext(UserContext);

  const {showModal} = ModalContextProvider();

  const initialValues = {
    fullname: user?.name,
    username: user?.username,
    country: user?.country ? User?.locationDetails?.country : 'United States',
    zipCode: user?.zipCode || '',
    timezone: user?.timezone ? User?.locationDetails?.timezone : dayjs.tz.guess(),
  };

  const [mutateImageUpload] = useMutation(singleUpload);
  const [mutateUpdateWelcome] = useMutation(mutations.updateUserWelcome);

  const {t} = useTranslation();
  const CountriesPicker = Countries.map(countryData => (
    <option key={countryData.label}>{countryData.label}</option>
  ));

  const TimezonesPicker = timezones.map(timezoneData => (
    <option key={timezoneData.value}>{timezoneData.value}</option>
  ));
  const [imageError, setImageError] = useState('');

  const upLoadProfile = async file => {
    try {
      if (file) {
        const response = await mutateImageUpload({
          variables: {
            uploadType: 'USER_AVATAR',
            documentId: User._id,
            file: file,
            accessToken: session?.accessToken,
          },
        });
        if ([400, 409, 413].includes(response.data.singleUpload.status)) {
          setImageError('Image too large. Maximum size is 2 MB.');
          return;
        }
        setUser({...user!, avatar: response.data.singleUpload.message});
      } else console.log('not valid');
    } catch (e) {
      if ([400, 409, 413, 404].includes(e.response.status)) {
        // setImageError('Image too large. Maximum size is 2 MB.');
        // return;
      }
    }
  };

  const handleFileChange = async () => {
    try {
      showModal(MODAL_TYPES.CHAMGEIMAGE, {
        upLoadImage: upLoadProfile,
        defSize: 1,
      });
      // eslint-disable-next-line no-empty
    } catch (err) {}
  };

  const submitHandler = async (values, setSubmitting, setFieldError) => {
    setSubmitting(true);
    const response = await mutateUpdateWelcome({
      variables: {
        userData: {
          username: values.username,
          name: values.fullname,
          country: values.country,
          zipCode: values.zipCode,
          timezone: values.timezone,
        },
        token: session?.accessToken,
      },
    });

    if (response.data.updateUserWelcome.status === 409) {
      setFieldError('username', 'Username Already Exists');
      setSubmitting(false);
      return;
    }
    setFieldError('username', undefined);

    setUser({
      ...user!,
      name: values.fullname,
      country: values.country,
      username: values.username,
      zipCode: values.zipCode,
      timezone: values.timezone,
    });
    handleClick();
    setSubmitting(false);
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 sm:mt-16 mx-2 md:mx-8'>
      <div className='grid grid-cols-1 sm:grid-cols-1 gap-4 mt-0 mx-8'>
        <div className='flex items-center justify-center self-start mt-16'>
          <div className='mt-0 sm:mx-auto sm:max-w-3xl sm:px-0 h-full flex items-center justify-center'>
            <Image
              src='/assets/welcome1.png'
              alt='welcome'
              height={600}
              width={600}
              layout='intrinsic'
              objectFit='contain'
            />
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-1 gap-4 mt-0 mb-0 mx-4 col-span-2'>
        <Formik
          initialValues={initialValues}
          validationSchema={WELCOME_STEP_ONE}
          onSubmit={(values, {setSubmitting, setFieldError}) => {
            submitHandler(values, setSubmitting, setFieldError);
          }}
          enableReinitialize
        >
          {({
            isSubmitting,
            values,
            handleChange,
            handleBlur,
            setFieldValue,
            handleSubmit,
            touched,
            errors,
          }) => (
            <Form onSubmit={handleSubmit}>
              <div className='sm:overflow-hidden'>
                <div className='bg-white pt-0 pb-0 px-2'>
                  <div>
                    <h1
                      id='payment-details-heading'
                      className='text-3xl font-extrabold text-gray-900 sm:text-5xl sm:leading-none sm:tracking-tight lg:text-4xl'
                    >
                      {t('profile:personal_details')}
                    </h1>
                    <p className='mt-1 text-sm text-gray-500'>
                      {t('profile:personal_details_info')}
                    </p>
                  </div>
                  <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4  gap-4'>
                    <div className='col-span-4 sm:col-span-2'>
                      <Field
                        label={t('profile:Full_Name')}
                        error={
                          touched.fullname &&
                          errors.fullname && <FieldError breakW='words' message={errors.fullname} />
                        }
                        required
                      >
                        <Input
                          type='text'
                          value={values.fullname}
                          handleChange={el => setFieldValue('fullname', el.target.value.trim())}
                          onBlur={handleBlur}
                          name='fullname'
                          id='fullname'
                          styles='pt-1 pb-2'
                          placeholder=''
                        />
                      </Field>
                    </div>

                    <div className='col-span-4 sm:col-span-2'>
                      <Field
                        label={t('profile:Username')}
                        error={
                          touched.username &&
                          errors.username && <FieldError breakW='words' message={errors.username} />
                        }
                        required
                      >
                        <Input
                          type='text'
                          styles='pt-1 pb-2'
                          value={values.username}
                          handleChange={el => setFieldValue('username', el.target.value.trim())}
                          onBlur={handleBlur}
                          name='username'
                          id='username'
                          placeholder=''
                        />
                      </Field>
                    </div>

                    <div className='col-span-4 sm:col-span-2'>
                      <Field
                        label={t('profile:Country')}
                        error={
                          touched.country &&
                          errors.country && <FieldError breakW='words' message={errors.country} />
                        }
                        required
                      >
                        <select
                          value={values.country}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          id='country'
                          name='country'
                          className='mt-1 py-2 pt-3 block w-full bg-white border border-gray-300 rounded-md shadow-sm px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                        >
                          {CountriesPicker}
                        </select>
                      </Field>
                    </div>

                    <div className='col-span-4 sm:col-span-2 self-end'>
                      <Field
                        label={t('profile:zip_code')}
                        error={
                          touched.zipCode &&
                          errors.zipCode && <FieldError breakW='words' message={errors.zipCode} />
                        }
                        required
                      >
                        <Input
                          value={values.zipCode}
                          handleChange={el => setFieldValue('zipCode', el.target.value.trim())}
                          onBlur={handleBlur}
                          type='text'
                          name='zipCode'
                          id='zipCode'
                          styles='mt-1 pt-2 pb-[8px]'
                          placeholder=''
                        />
                      </Field>
                    </div>
                    <div className='col-span-4 sm:col-span-2'>
                      <Field
                        label={t('profile:Timezone')}
                        error={
                          touched.timezone &&
                          errors.timezone && <FieldError breakW='words' message={errors.timezone} />
                        }
                        required
                      >
                        <select
                          value={values.timezone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          id='timezone'
                          name='timezone'
                          className='mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm'
                        >
                          {TimezonesPicker}
                        </select>
                      </Field>
                    </div>
                    <div className='col-span-4 sm:col-span-2'>
                      <div className='mt-1 '>
                        <div className='flex items-center'>
                          <div
                            className='flex-shrink-0 inline-block rounded-full overflow-hidden h-20 w-20'
                            aria-hidden='true'
                          >
                            <div
                              className={`relative flex items-center justify-center flex-shrink-0 rounded-xl overflow-hidden`}
                            >
                              <img
                                className='relative rounded-full w-20 h-20 object-cover object-center'
                                src={user?.avatar || '/assets/default-profile.jpg'}
                                alt='avatar'
                              />
                            </div>
                          </div>
                          <div className='ml-5'>
                            <p
                              className='text-sm font-medium text-gray-700 mt-4'
                              aria-hidden='true'
                            >
                              {t('profile:profile_avatar')}
                            </p>
                            <div
                              onClick={handleFileChange}
                              className='group relative border border-gray-300 rounded-md py-2 px-3 flex items-center justify-center hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500'
                            >
                              <label
                                htmlFor='mobile-user-photo'
                                className='relative text-sm leading-4 font-medium text-gray-700 pointer-events-none'
                              >
                                <span>{t('common:btn_change')}</span>
                                <span className='sr-only'> user photo</span>
                              </label>
                            </div>
                            <span className='text-xs text-gray-500'>248x248 </span>
                            <span className='inline-block px-1 text-gray-500 text-xs'>
                              {t('common:max')} 2 MB
                            </span>
                          </div>
                        </div>
                        <div className='mt-2 flex'>
                          <span className='text-red-600 text-xs'>{imageError}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='px-4 text-right sm:px-6'>
                  <button
                    type='button'
                    onClick={prev}
                    className='mb-4 bg-mainBlue border border-transparent rounded-md shadow-sm py-2 mr-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
                  >
                    {t('common:btn_previous')}
                  </button>

                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className={` bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue`}
                  >
                    {t('common:btn_continue')}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
export default StepOne;

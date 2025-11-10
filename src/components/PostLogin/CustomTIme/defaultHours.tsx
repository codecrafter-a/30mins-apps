import router from 'next/router';
import {useSession} from 'next-auth/react';
import {useMutation, useQuery} from '@apollo/client';
import mutations from 'constants/GraphQL/User/mutations';
import queries from 'constants/GraphQL/User/queries';
import {useFormik} from 'formik';
import WorkingHoursForm from '@features/users/working-hours-form';
import useTranslation from 'next-translate/useTranslation';
import {useContext, useState} from 'react';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import {NotificationContext} from 'store/Notification/Notification.context';
import Button from '@root/components/button';

const DefaultHours = () => {
  const {data: session} = useSession();
  const {data: userData} = useQuery(queries.getUserById, {
    variables: {token: session?.accessToken},
  });

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);

  const {t} = useTranslation();

  const [updateWorkingHours] = useMutation(mutations.updateWorkingHours);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const omitTypename = (key, value) => (key === '__typename' ? undefined : value);
  const omittedTypenamePayload = JSON.parse(
    JSON.stringify(userData.getUserById.userData.workingHours),
    omitTypename
  );

  // Formik Initialization
  const {values, errors, setFieldValue, submitForm} = useFormik({
    initialValues: {
      availabilityDays: omittedTypenamePayload,
      isValid: undefined,
    },
    enableReinitialize: false,
    onSubmit: async () => {
      try {
        if (values?.isValid) {
          showNotification(NOTIFICATION_TYPES.error, t(`common:${values?.isValid}`), false);
          return;
        }
        setIsSubmitting(true);
        await updateWorkingHours({
          variables: {
            workingHours: {
              isCustomEnabled: true,
              monday: values.availabilityDays.monday,
              tuesday: values.availabilityDays.tuesday,
              wednesday: values.availabilityDays.wednesday,
              thursday: values.availabilityDays.thursday,
              friday: values.availabilityDays.friday,
              saturday: values.availabilityDays.saturday,
              sunday: values.availabilityDays.sunday,
            },
            token: session?.accessToken,
          },
        });
        setIsSubmitting(false);
        router.reload();
      } catch (err) {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className={'py-4'}>
      <div className='mb-4 flex flex-row justify-end'>
        <Button
          variant='solid'
          type='submit'
          className='w-full md:w-32'
          onClick={submitForm}
          disabled={isSubmitting}
        >
          {isSubmitting ? t('common:btn_saving') : t('common:btn_save')}
        </Button>
      </div>

      <WorkingHoursForm
        handleChange={setFieldValue}
        setFieldValue={setFieldValue}
        errors={errors}
        availabilityDays={values.availabilityDays}
      />
    </div>
  );
};

export default DefaultHours;

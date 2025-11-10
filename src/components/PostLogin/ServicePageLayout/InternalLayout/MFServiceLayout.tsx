import React, {useEffect, useState} from 'react';
import useTranslation from 'next-translate/useTranslation';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import bookingQueries from 'constants/GraphQL/Booking/queries';
import {useFormik} from 'formik';
import ServiceInfo from './feature/shared/service-info';
import {getCurrentSteps, Iaction, initialValues} from './feature/meeting/constants';
import Calendar from './feature/shared/Calendar';
import Confirmation from './feature/shared/Confirmation';
import Form from './feature/shared/Form';
import {setInitBookingData} from './feature/meeting/stage-data';
import submitHandler from './feature/meeting/submit';
import {schema} from './feature/meeting/schema';
import {SERVICE_TYPES, AUTHENTICATION_TYPE} from '../../../../constants/enums';
import ManualFreelanceConfirmation from './feature/shared/ManualFreelanceConfirmation';
import {toast} from 'react-hot-toast';

export default function MFServiceLayout({user, serviceData}) {
  const {t} = useTranslation();
  const [apiLoading, setApiLoading] = useState(false);
  const [err, setErr] = useState('');

  const {values, errors, setFieldValue, setFieldError, setErrors, handleChange} = useFormik({
    initialValues: initialValues,
    validateOnChange: false,
    onSubmit: () => {},
  });

  const handleAvailabilityQuery = async (daySelected, bookerTimezone) => {
    if (serviceData.serviceType === 'MEETING') {
      const {data: availabilityResponse} = await graphqlRequestHandler(
        bookingQueries.getAvailability,
        {
          serviceId: serviceData._id,
          daySelected,
          bookerTimezone,
        },
        ''
      );

      return availabilityResponse.data.getAvailability.availableSlots;
    }
    if (serviceData.serviceType === 'ROUND_ROBIN') {
      const {data: availabilityResponse} = await graphqlRequestHandler(
        bookingQueries.getRRAvailablities,
        {
          serviceId: serviceData._id,
          daySelected: daySelected,
          bookerTimezone: bookerTimezone,
        },
        ''
      );
      setFieldValue(
        'teamsAvailability',
        availabilityResponse.data.getRRAvailability.teamsAvailability
      );
      return availabilityResponse.data.getRRAvailability.collectiveAvailability;
    }
  };

  const handleWeekdayQuery = async bookerTimezone => {
    const {data: weekdayResponse} = await graphqlRequestHandler(
      bookingQueries.getWeekdayAvailability,
      {
        serviceId: serviceData._id,
        bookerTimezone,
      },
      ''
    );

    return weekdayResponse.data.getWeekdayAvailability.availableWeekdays;
  };

  const move = async (action: Iaction, step) => {
    let stepDetails = Object(schema[values.TYPESERVICE]).find(o => o.index === values.STEPS[step]);
    try {
      if (action === 'back' && step !== 0) {
        await setFieldValue('step', step - 1);
        setErr('');
        return;
      } else if (action == 'back') {
        setErr('');
        if (serviceData.serviceType === 'MEETING') {
          setFieldValue('selectedDate', undefined);
          setFieldValue('selectedTime', undefined);
          setFieldValue('activeTime', undefined);
          await setFieldValue('isDateAndTimeSelected', false);
        } else if (serviceData.serviceType === 'ROUND_ROBIN') {
          await setFieldValue('isDateAndTimeSelected', false);
        } else {
          await setFieldValue('buyNow', false);
        }
        return;
      }

      if (action === 'next' && step !== values.STEPS.length - 1) {
        await stepDetails?.schema?.validate(values, {abortEarly: false});
        if (step === 0) {
          let val = values.bookerEmailValid;
          if (!val) {
            setFieldError('bookingData.bookerEmail', t('common:you_cant_book_your_service'));
            return;
          }
          val = values.PhoneValid;

          if (!val) {
            setFieldError('bookingData.bookerPhone', t('phone_number_invalid'));
            return;
          }
        }
        setErrors({});
        await setFieldValue('step', step + 1);
      }

      if (action === 'submit') {
        await stepDetails?.schema?.validate(values, {abortEarly: false});
        setApiLoading(true);
        try {
          await submitHandler(values, setFieldValue, t);
        } catch (er) {
          if (er.message === 'The Slot Is Already Booked!') {
            setErr('');
            toast.error(t('common:The Slot Is Already Booked!'));
            setFieldValue('selectedTime', undefined);
            setFieldValue('isDateAndTimeSelected', undefined);
          }
        }

        setApiLoading(false);
      }
    } catch (err) {
      setApiLoading(false);
      if (
        err.message === 'email_blocked' ||
        err.message === 'white_email_message' ||
        err.message === 'white_domain_message' ||
        err.message === 'black_domain_message'
      ) {
        setErr(err.message);
      } else {
        err.inner.map(o => setFieldError(o.path, o.message));
      }
    }
  };

  // useEffects
  useEffect(() => {
    setFieldValue('serviceData', serviceData);
    setFieldValue('user', user);
    setFieldValue('bookingData', {
      ...values.bookingData,
      ...setInitBookingData({user, serviceData}),
    });

    const {STEPS, TYPESERVICE} = getCurrentSteps(serviceData);
    setFieldValue('bookingData.subject', serviceData.title);
    setFieldValue('STEPS', STEPS);
    setFieldValue('TYPESERVICE', TYPESERVICE);
  }, []);

  useEffect(() => {
    setFieldValue('bookingData', {
      ...values.bookingData,
      ...setInitBookingData({user: values.user, serviceData}),
    });
    setFieldValue('otpProtected', serviceData?.otpProtected);
    setFieldValue('authenticationType', serviceData?.authenticationType);
  }, [values.user]);

  return (
    <>
      <div className='lg:w-3/5 flex flex-col min-h-full divide-y space-y-2'>
        <ServiceInfo user={user} serviceData={serviceData} setFieldValue={setFieldValue} />

        <div
          className='flex flex-col h-full p-4'
          style={{
            display:
              values.confirmBooking ||
              (!values.buyNow &&
                !['MEETING', 'ROUND_ROBIN'].includes(values.serviceData.serviceType))
                ? 'none'
                : 'flex',
          }}
        >
          {serviceData?.authenticationType === AUTHENTICATION_TYPE.PRE_APPROVED && (
            <p className='text-red-500'>{t('meeting:pre-approved_disclaimer')}</p>
          )}
          {serviceData?.authenticationType === AUTHENTICATION_TYPE.VERIFIED_ONLY && (
            <p className='text-red-500'>{t('meeting:verified-only_disclaimer')}</p>
          )}
          {!values.isDateAndTimeSelected && (
            <Calendar
              availabilityQueryHandler={handleAvailabilityQuery}
              weekdayQueryHandler={handleWeekdayQuery}
              setFieldValue={setFieldValue}
              values={values}
              disabled={!['MEETING', 'ROUND_ROBIN'].includes(values.serviceData.serviceType)}
            />
          )}
          {((values.selectedTime && values.isDateAndTimeSelected) || values.buyNow) && (
            <Form
              setFieldValue={setFieldValue}
              setFieldError={setFieldError}
              handleChange={handleChange}
              loading={apiLoading}
              errors={errors}
              values={values}
              errMsg={err}
              move={move}
            />
          )}
        </div>
        {values.serviceData.serviceType !== SERVICE_TYPES.FREELANCING_WORK ? (
          <Confirmation values={values} paymentInvoice={''} hidden={!values.confirmBooking} />
        ) : (
          <ManualFreelanceConfirmation
            user={user}
            serviceData={serviceData}
            selectedDate={Date.now()}
            hidden={!values.confirmBooking}
          />
        )}
      </div>
    </>
  );
}

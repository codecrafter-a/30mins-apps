import {CashIcon, CreditCardIcon, TagIcon} from '@heroicons/react/outline';
import {RadioGroup} from '@headlessui/react';
import Input from '@root/components/forms/input';
import RadioButton from '@root/components/forms/radio';
import Select from '@root/components/forms/select';
import Error, {FieldError} from '@root/components/forms/error';
import useTranslation from 'next-translate/useTranslation';
import {useEffect} from 'react';
import {number} from 'yup';
import classNames from 'classnames';
import StepHeader from '../step-header';
import {activation, currencies, methods} from './constants';
import BinaryRadio from '../binary-radio';

type Props = {
  serviceType: any;
  handleChange: any;
  servicePaid: string;
  serviceCurrency: string;
  serviceFee: number;
  servicePayMethod: string;
  setValue: any;
  errors: any;
  stepName:
    | 'ServiceType'
    | 'ServiceDetails'
    | 'ServicePayment'
    | 'Charity'
    | 'Security'
    | 'Availability'
    | 'Whitelist'
    | 'Blacklist'
    | 'Questions'
    | 'Media'
    | 'Summary';
  isOrg: boolean;
  move: (action: any, update: any) => Promise<void>;
  step: number;
  mode: string | string[] | undefined;
  editOrgServiceLoading: any;
  editServiceLoading: any;
  submitEditService: () => void;
};

export default function ServicePayment({
  handleChange,
  servicePaid,
  serviceCurrency,
  servicePayMethod,
  serviceFee,
  errors,
  setValue,
  move,
  step,
  mode,
  isOrg,
  stepName,
  serviceType,
  editOrgServiceLoading,
  editServiceLoading,
  submitEditService,
}: Props) {
  //
  const {t} = useTranslation('common');
  useEffect(() => {
    if (serviceType === 'FREELANCING_WORK') {
      setValue('servicePaid', 'yes');
    }
  }, []);

  return (
    <>
      {serviceType !== 'FREELANCING_WORK' && (
        <BinaryRadio
          question={t('service_paid_question')}
          description={t('service_paid_description')}
          icon={<CashIcon className='w-6 h-6' />}
          errors={errors.servicePaid && errors.servicePaid}
          collapsed={servicePaid === 'yes'}
          stepName={stepName}
          value={serviceType !== 'FREELANCING_WORK' ? servicePaid : 'yes'}
          field='servicePaid'
          handleChange={(field, event) => {
            if (event === activation[1].code) {
              setValue('serviceFee', 0);
              setValue('servicePayMethod', 'none');
            }
            setValue(field, event);
          }}
          options={activation}
          editOrgServiceLoading={editOrgServiceLoading}
          editServiceLoading={editServiceLoading}
          submitEditService={submitEditService}
          {...(serviceType !== 'FREELANCING_WORK' && {move, step, mode})}
        />
      )}

      {servicePaid === 'yes' && (
        <>
          <StepHeader
            question={t('common:service_amount_question')}
            description={t('common:service_amount_description')}
            stepName={stepName}
            submitEditService={submitEditService}
            icon={<TagIcon className='w-6 h-6' />}
            {...(serviceType === 'FREELANCING_WORK' && {
              move,
              step,
              mode,
            })}
          />

          <div className='flex flex-col w-full md:w-2/3 lg:w-1/2 mb-16'>
            <div className='flex'>
              <div className='border flex-shrink-0 border-gray-300 border-r-0 rounded-l-lg justify-start px-4 items-center flex bg-gray-200 bg-opacity-40'>
                {t('common:amount')}
              </div>
              <Input
                type='number'
                handleChange={async ({target: {value}}) => {
                  try {
                    const num = await number().positive().validate(value);
                    if (Number(num) <= 100000) {
                      setValue('serviceFee', parseInt(Number(num).toString(), 10));
                    }
                    // eslint-disable-next-line no-empty
                  } catch (err) {}
                }}
                styles='rounded-none border-gray-300 py-8 z-50'
                placeholder=''
                value={serviceFee}
                maxLength={6}
                max={'100000'}
                onKeyDown={e =>
                  ['e', 'E', '+', '-', ',', '.'].includes(e.key) && e.preventDefault()
                }
              />
              <div className='flex w-1/3'>
                <Select
                  onChange={handleChange('serviceCurrency')}
                  selectedOption={currencies.find(o => o.code === serviceCurrency)?.label}
                  options={currencies}
                />
              </div>
            </div>
            {errors.serviceFee && <FieldError message={errors.serviceFee} />}
          </div>

          <StepHeader
            question={t('common:service_payment_method_question')}
            description={t('common:service_payment_description')}
            icon={<CreditCardIcon className='w-6 h-6' />}
          />
          {errors.servicePayMethod && <Error message={errors.servicePayMethod} styles='mb-4' />}
          <div className='flex space-x-6 select-none'>
            <RadioGroup
              value={servicePayMethod}
              onChange={handleChange('servicePayMethod')}
              onDoubleClick={() => {
                move('preview', false);
              }}
              className='flex-grow'
            >
              <div className={classNames(['flex flex-wrap gap-6', isOrg && 'w-full md:w-96 '])}>
                {methods
                  .filter(el => (isOrg ? el.code === 'escrow' : el))
                  .map(c => (
                    <RadioButton
                      key={c.code}
                      value={c.code}
                      styles='w-full lg:w-1/4'
                      image={`/icons/services/${c.code}.svg`}
                      description={t(`${c.code}_description`)}
                      title={t(`${c.code}`)}
                      variant='card'
                    />
                  ))}
              </div>
            </RadioGroup>
          </div>
        </>
      )}
    </>
  );
}

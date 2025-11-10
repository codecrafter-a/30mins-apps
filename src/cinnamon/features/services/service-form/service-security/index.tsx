import classNames from 'classnames';
import {RadioGroup} from '@headlessui/react';
import {DesktopComputerIcon} from '@heroicons/react/outline';
import PreApprovedList from '@root/features/services/service-form/service-whitelist/pre-approved-list';
import StepHeader from '@features/services/service-form/step-header';
import Error from '@root/components/forms/error';
import useTranslation from 'next-translate/useTranslation';
import {IProps} from './constants';

export default function ServiceSecurity({
  handleChange,
  authenticationType,
  move,
  step,
  mode,
  errors,
  editOrgServiceLoading,
  editServiceLoading,
  submitEditService,
  values,
}: IProps) {
  const {t} = useTranslation();

  const authenticationTypes = [
    {
      title: 'no_authentication_required',
      desc: 'allow_anyone_to_book_your_meeting_without_authorization',
      value: 'NONE',
    },
    {
      title: 'verified_only',
      desc: 'restrict_your_meetings_to_only_allow_verified_users',
      value: 'VERIFIED_ONLY',
    },
    {
      title: 'only_pre-approved_users',
      desc: 'add_domains_and_emails_that_you_want',
      value: 'PRE_APPROVED',
    },
  ];

  return (
    <>
      <StepHeader
        question={t('common:Do_you_want_your_meetings_to_require_authentication?')}
        description={t('common:add_an_extra_layer_of_security')}
        icon={<DesktopComputerIcon className='w-6 h-6' />}
        editOrgServiceLoading={editOrgServiceLoading}
        editServiceLoading={editServiceLoading}
        keepDecs={true}
        submitEditService={submitEditService}
        move={move}
        step={step}
        mode={mode}
      />

      {errors.serviceType && <Error styles='mb-4' message={errors.serviceType} />}
      <div className='w-full'>
        <RadioGroup
          value={authenticationType}
          onDoubleClick={() => {
            move('next', false);
          }}
          onChange={e => {
            handleChange('authenticationType', e);
          }}
          name='authenticationType'
        >
          <div className='flex flex-col'>
            {authenticationTypes?.map(type => (
              <RadioGroup.Option
                key={type.value}
                value={type.value}
                className={({checked}) =>
                  classNames(
                    checked ? 'border-mainBlue' : 'bg-white',
                    'w-full select-none flex-grow flex-shrink-0 flex cursor-pointer rounded-lg p-4'
                  )
                }
              >
                {({checked}) => (
                  <div className='flex w-full items-center gap-2'>
                    <div className='flex space-x-6 items-center'>
                      <input
                        type={'radio'}
                        checked={checked}
                        className='w-8 h-8 border border-black text-mainBlue'
                      />
                      <div className='text-sm flex flex-col w-full'>
                        <RadioGroup.Label
                          className={classNames(
                            checked ? 'text-mainBlue' : 'text-mainText',
                            'text-lg font-bold '
                          )}
                        >
                          {t(`common:${type.title}`)}
                        </RadioGroup.Label>
                        <RadioGroup.Description as='span' className={`inline text-gray-500`}>
                          <span>{t(`common:${type.desc}`)}</span>
                        </RadioGroup.Description>
                      </div>
                    </div>
                  </div>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
      {authenticationType === 'PRE_APPROVED' && (
        <div>
          <PreApprovedList
            serviceBlacklist={values.serviceBlacklist}
            serviceBlacklistDomains={values.serviceBlacklistDomains}
            serviceBlacklistEmails={values.serviceBlacklistEmails}
            serviceWhitelist={values.serviceWhitelist}
            serviceWhitelistDomains={values.serviceWhitelistDomains}
            serviceWhitelistEmails={values.serviceWhitelistEmails}
            handleChange={handleChange}
            errors={errors}
            move={move}
          />
        </div>
      )}
    </>
  );
}

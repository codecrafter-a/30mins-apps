import useTranslation from 'next-translate/useTranslation';
import {useMutation} from '@apollo/client';
import {useSession} from 'next-auth/react';
import mutations from 'constants/GraphQL/User/mutations';
import {useContext, useEffect, useState} from 'react';
// import {useRouter} from 'next/router';
import axios from 'axios';
import Button from 'components/shared/Button/Button';
import {UserContext} from '@root/context/user';

const StepFour = ({User, integrations}) => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  // const router = useRouter();
  const {refetchUser} = useContext(UserContext);
  const [publicUrl, setPublicUrl] = useState('');
  const userIntegrations = integrations?.data?.getCredentialsByToken;
  const {googleCredentials, officeCredentials} = userIntegrations;
  const hasCalendars = googleCredentials || officeCredentials;
  const [mutateUpdateWelcome] = useMutation(mutations.updateUserWelcome);

  useEffect(() => {
    setPublicUrl(`${window.origin}/${User?.accountDetails?.username}`);
    const updateWelcome = async () => {
      if (!User.welcomeComplete) {
        await mutateUpdateWelcome({
          variables: {
            userData: {
              welcomeComplete: true,
            },
            token: session?.accessToken,
          },
        });
        await axios.post('/api/statistics/globalBusiness', {
          fields: {
            totalUsersWelcomeComplete: 1,
          },
        });
        refetchUser();
      }
    };
    updateWelcome();
  }, []);

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-1 p-0'>
        <div className='grid grid-cols-1 sm:grid-cols-3 p-0'>
          <div className='w-full justify-start col-span-1 hidden sm:block max-w-[75%]'>
            <img className='mb-6 mx-auto' src='/assets/setupsuccess.png' alt='Setup Success' />
          </div>
          <div className='w-full overflow-hidden break-words col-span-2 py-6 px-4 sm:p-6'>
            <div className='bg-white py-0'>
              <div className='py-0 text-left sm:px-12 md:px-0 items-start justify-start'>
                <h1 className='font-bold text-2xl md:text-3xl'>
                  {t('profile:welcome_final_title')}
                </h1>
                <div className='mt-4 text-md'>{t('common:tier_last_step_share_profile')}</div>
                <div className='mt-4 text-xl font-bold text-mainBlue'>
                  <a href={publicUrl} target='_blank' rel='noreferrer'>
                    {publicUrl}
                  </a>
                </div>
                {hasCalendars && (
                  <>
                    <div className='mt-4 text-md'>
                      {t('common:tier_last_step_share_call')}
                      {t(' ')}
                      <a
                        href={`/user/services`}
                        className='font-bold'
                        target='_blank'
                        rel='noreferrer'
                      >
                        {t('common:tier_last_step_share_call_here')}
                      </a>
                    </div>
                    <div className='mt-4 text-md text-mainBlue'>
                      <h1 className='font-bold text-2xl'>
                        <a href={`${publicUrl}/call`} target='_blank' rel='noreferrer'>
                          {publicUrl}/call
                        </a>
                      </h1>
                    </div>
                  </>
                )}
                <div className='mt-20 text-md grid gap-2 grid-cols-3'>
                  <div className='col-span-2'>{t('common:tier_last_step_add_more_services')}</div>
                  <div className='col-span-1 w-full'>
                    <Button
                      type='button'
                      href={`/user/services/service-form/?mode=create`}
                      text={t('common:add_service')}
                      className='inline-flex text-xs w-full sm:text-sm justify-center mr-3 sm:w-52 buttonBase buttonLinkFull bg-mainBlue hover:bg-blue-700'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='bg-[#d54a30] p-2 md:w-2/3 mx-auto text-center rounded-md shadow-md'>
          <h1 className='text-sm sm:text-xl font-normal text-gray-100 tracking-tight'>
            {t('common:tier_last_step_signup_stripe')}
            {t(' ')}
            <a
              href={`/user/paymentOptions`}
              className='font-bold text-white'
              target='_blank'
              rel='noreferrer'
            >
              {t('common:tier_last_step_signup_stripe_here')}
            </a>
            {t(' ')}
            {t('common:tier_last_step_signup_stripe_to_setup')}
          </h1>
        </div>
      </div>
    </>
  );
};
export default StepFour;

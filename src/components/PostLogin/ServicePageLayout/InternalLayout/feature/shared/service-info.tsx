import React, {useState} from 'react';
import Link from 'next/link';
import {PAYMENT_TYPE, SERVICE_TYPES} from 'constants/enums';
import {MODAL_TYPES} from 'constants/context/modals';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import dayjs from 'dayjs';
import sanitizeHtml from 'sanitize-html';
import {useSession} from 'next-auth/react';
import {ExclamationCircleIcon} from '@heroicons/react/outline';
import Button from '@root/components/button';
import {toast} from 'react-hot-toast';

export default function ServiceInfo({serviceData, user, setFieldValue}) {
  const {data: session} = useSession();
  const [show, setShow] = useState<boolean>(false);
  const {t} = useTranslation();

  const {showModal} = ModalContextProvider();

  const sendMessageExtension = () => {
    showModal(MODAL_TYPES.SEND_MESSAGE_EXTENSION, {
      providerName: user?.personalDetails?.name,
      providerEmail: user?.accountDetails?.email,
    });
  };

  const {paymentType} = serviceData;

  return (
    <div className='flex flex-col gap-1 p-4'>
      {[SERVICE_TYPES.MEETING, SERVICE_TYPES.ROUND_ROBIN].includes(serviceData.serviceType) && (
        <>
          <div className='flex w-full flex-col md:flex-row-reverse'>
            {serviceData.isPaid && (
              <div className='flex flex-col items-end w-full'>
                <div className='mr-4'>
                  {' '}
                  <img
                    src={`/icons/services/badge${paymentType}.svg`}
                    alt='Payment Badge'
                    width={64}
                    height={64}
                  />
                </div>

                <Link href={`/howpaymentswork#${paymentType}`}>
                  <a className='text-xs'>{t('page:what_does_it_mean')}</a>
                </Link>
              </div>
            )}

            <div className='flex flex-col text-left gap-1 w-full'>
              <span
                title={serviceData?.title}
                className='font-bold text-4xl h-max pb-2 break-all line-clamp-1'
              >
                {serviceData?.title}
              </span>
              <span className='text-xl text-gray-600 font-bold'>
                {t('common:Meeting_Duration')}: {serviceData.duration} {t('common:txt_mins')}
              </span>
              <div className='flex text-left'>
                {serviceData.price > 0 &&
                  (serviceData.isRecurring ? (
                    <span className='text-xl'>
                      {t('meeting:Fees_per_meeting')}
                      {` ${serviceData.price}`}
                      {`${serviceData.currency}`}
                    </span>
                  ) : (
                    <span className='text-xl'>
                      {t('meeting:Fees')}: {serviceData.currency}
                      {serviceData.price}
                    </span>
                  ))}
              </div>
            </div>
          </div>
          <div className={`w-full ${show ? '' : 'line-clamp-3'}`}>
            {serviceData?.description && (
              <div
                className={`custom break-words text-sm`}
                dangerouslySetInnerHTML={{__html: sanitizeHtml(serviceData?.description)}}
              />
            )}
          </div>
          {serviceData?.description.length > 420 && (
            <div
              onClick={() => setShow(!show)}
              className='mt-1 text-black font-bold hover:underline cursor-pointer'
            >
              {show ? 'Hide' : 'More'}
            </div>
          )}

          <div>
            {serviceData.percentDonated > 0 &&
            [PAYMENT_TYPE.DIRECT, PAYMENT_TYPE.ESCROW].includes(serviceData.paymentType) ? (
              <span className='text-mainBlue font-bold'>
                {serviceData.percentDonated}% {t('meeting:donating_to_charity')}{' '}
                {serviceData.charity}
              </span>
            ) : null}
          </div>
        </>
      )}
      {serviceData.serviceType === SERVICE_TYPES.FREELANCING_WORK && (
        <>
          <div className='flex w-full flex-col md:flex-row-reverse'>
            {serviceData.isPaid && (
              <div className='flex flex-col items-end w-full'>
                <div className='mr-4'>
                  {' '}
                  <img
                    src={`/icons/services/badge${paymentType}.svg`}
                    alt='Payment Badge'
                    width={64}
                    height={64}
                  />
                </div>

                <Link href={`/howpaymentswork#${paymentType}`}>
                  <a className='text-xs'>{t('page:what_does_it_mean')}</a>
                </Link>
                <div className='col-span-4 place-items-center flex justify-start items-center mt-auto h-3/4 gap-1'>
                  <span className='font-medium text-xs md:text-base'>Due </span>
                  <span className='font-bold text-sm md:text-lg text-mainBlue'>
                    {serviceData.dueDate} Days
                  </span>
                  <span className='font-medium text-xs md:text-base'>
                    ({dayjs(new Date()).add(serviceData.dueDate, 'day').format('MMM D, YYYY')})
                  </span>
                </div>
              </div>
            )}
            <div className='w-full '>
              <span className='font-bold text-4xl' title={serviceData?.title}>
                {serviceData?.title}
              </span>
              <div className={`w-full ${show ? '' : 'line-clamp-3'}`}>
                <span className='text-xl'>{`${t('common:Description')}: `}</span>
                {serviceData?.description && (
                  <div
                    className={`custom break-words text-sm m-0`}
                    dangerouslySetInnerHTML={{__html: serviceData?.description}}
                  ></div>
                )}
              </div>
            </div>

            {serviceData?.description.length > 420 && (
              <div
                onClick={() => setShow(!show)}
                className='mt-1 text-black font-bold hover:underline cursor-pointer'
              >
                {show ? 'Hide' : 'More'}
              </div>
            )}
          </div>

          <div className='flex flex-row justify-end mt-auto bottom-0 items-end'>
            <div className='flex text-2xl text-left font-bold mr-auto text-mainBlue'>
              {serviceData.price > 0 ? (
                <span>
                  {serviceData.currency}
                  {serviceData.price}
                </span>
              ) : (
                <span>Free</span>
              )}
            </div>
            <div className='flex flex-row gap-2 font-medium mt-20'>
              <Button variant='solid' type='button' onClick={sendMessageExtension}>
                {t('common:send_a_message')}
              </Button>

              {session?.user?.email && session?.user?.email !== user?.accountDetails?.email ? (
                <Link
                  href={{
                    pathname: '/user/chat',
                    query: {membersEmail: [session?.user?.email, user?.accountDetails?.email]},
                  }}
                  as='/user/chat'
                  className='flex flex-col justify-center items-center w-full'
                  title={t('common:live_chat')}
                  passHref
                >
                  <Button variant='solid' className='m-auto' onClick={() => {}}>
                    {t('common:live_chat')}
                  </Button>
                </Link>
              ) : (
                session?.user?.email !== user?.accountDetails?.email && (
                  <Button
                    variant='ghost'
                    className='m-auto cursor-pointer'
                    onClick={() => {
                      toast(t('common:please_Sign_In_send_message'), {
                        icon: <ExclamationCircleIcon width={25} height={25} />,
                        duration: 1000,
                      });
                    }}
                  >
                    {t('common:live_chat')}
                  </Button>
                )
              )}
              <Button
                variant='solid'
                onClick={() => {
                  setFieldValue('buyNow', true);
                }}
              >
                {t('common:buy_now')}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

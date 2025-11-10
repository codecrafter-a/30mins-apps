import type {GetServerSideProps} from 'next';
import Link from 'next/link';
import {unstable_getServerSession} from 'next-auth';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {ChevronRightIcon} from '@heroicons/react/solid';

import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import PostLoginLayout from '@root/components/layout/post-login';
import Loader from 'components/shared/Loader/Loader';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {authOptions} from 'pages/api/auth/[...nextauth]';
import queries from 'constants/GraphQL/Booking/queries';
import userQuery from 'constants/GraphQL/User/queries';
import {SERVICE_TYPES} from 'constants/enums';

export default function OrderQuestions({order}) {
  const {status} = useSession();
  const {t} = useTranslation();

  if (status === 'loading') {
    return <Loader />;
  }

  return (
    <ProtectedRoute status={status}>
      <PostLoginLayout>
        <div className='lg:flex lg:items-center lg:justify-between rounded-lg shadow-lg px-5 py-4 mb-6'>
          <div className='flex-1 min-w-0'>
            <nav className='flex' aria-label='Breadcrumb'>
              <ol role='list' className='flex items-center space-x-4'>
                <li>
                  <div className='flex'>
                    <a href={'/'} className='text-sm font-medium text-gray-700 hover:text-gray-800'>
                      {t('page:Home')}
                    </a>
                  </div>
                </li>
                <li>
                  <div className='flex items-center'>
                    <ChevronRightIcon
                      className='flex-shrink-0 h-5 w-5 text-gray-500'
                      aria-hidden='true'
                    />
                    <Link href='/user/meetings' passHref>
                      <a className='ml-4 text-sm font-medium text-gray-700  hover:text-gray-800'>
                        {t('common:txt_my_meetings')}
                      </a>
                    </Link>
                  </div>
                </li>
              </ol>
            </nav>
            <h2 className='mt-2 text-2xl font-bold leading-7 text-mainBlue sm:text-3xl sm:truncate'>
              {order.title}
            </h2>
          </div>
        </div>

        <h1 className='mb-6 text-xl uppercase font-bold text-mainBlue'>
          {t('meeting:your_answer_to_questions')}
        </h1>

        <div className='grid grid-cols-1 gap-0 sm:gap-2'>
          {order.answeredQuestions.map(({question, answer}, index) => (
            <div key={index}>
              <div className='col-span-1 flex flex-col divide-y-2'>
                <label
                  htmlFor='ccRecipients'
                  className='text-sm p-0 px-1 pt-0 pb-0 w-full font-medium text-gray-700'
                >
                  {t('common:question')}: {question}
                </label>
              </div>
              <div className='col-span-1 sm:col-span-1 flex flex-col w-full divide-y-2'>
                <label
                  htmlFor='ccRecipients'
                  className='text-sm px-1 pb-2 w-full font-medium text-gray-700'
                >
                  {t('common:answer')}: <label className='w-full p-0'>{answer}</label>
                </label>
              </div>
            </div>
          ))}
        </div>
      </PostLoginLayout>
    </ProtectedRoute>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);
  const router = context.resolvedUrl;

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?url=${router}`,
        permanent: false,
      },
    };
  }
  const {data: order} = await graphqlRequestHandler(
    queries.getBookingById,
    {
      documentId: context.query.orderDetails,
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  if (
    order?.data?.getBookingById?.bookingData?.serviceType !== SERVICE_TYPES.FREELANCING_WORK ||
    order?.data?.getBookingById?.bookingData === null
  ) {
    return {
      redirect: {destination: '/user/orders', permanent: false},
    };
  }
  const {data: user} = await graphqlRequestHandler(
    userQuery.getUserById,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );
  // const isWelcome = user?.data?.getUserById?.welcomeComplete;
  // if (isWelcome) {
  //   return {
  //     redirect: {destination: '/user/welcome', permanent: false},
  //   };
  // }
  return {
    props: {
      documentId: context.query.orderDetails,
      token: session?.accessToken,
      user,
      order: order?.data?.getBookingById?.bookingData,
    },
  };
};

import PaymentOptions from 'components/PostLogin/PaymentOptions';
import userQueries from 'constants/GraphQL/User/queries';
import stripeQueries from 'constants/GraphQL/StripeAccount/queries';
import {GetServerSideProps} from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import Stripe from 'stripe';
import LinkStripeContainer from 'components/PostLogin/PaymentOptions/LinkStripeContainer';
import {unstable_getServerSession} from 'next-auth';
import {authOptions} from 'pages/api/auth/[...nextauth]';
import PostLoginLayout from '@root/components/layout/post-login';
import Header from '@root/components/header';

const PaymentOptionsPage = ({user, userStripeAccount, accountDocumentId}) => {
  const {t} = useTranslation();

  const crumbs = [{title: t('page:Home'), href: '/'}];

  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('page:Payment Methods')} />
      <Head>
        <title>{t('page:Payment Methods')}</title>
      </Head>
      <PaymentOptions user={user} userStripeAccount={userStripeAccount} />
      <LinkStripeContainer
        userStripeAccount={userStripeAccount}
        accountDocumentId={accountDocumentId}
      />
    </PostLoginLayout>
  );
};

export default PaymentOptionsPage;
PaymentOptionsPage.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const session = await unstable_getServerSession(context.req, context.res, authOptions);
    const router = context.resolvedUrl;

    const stripe = new Stripe(process.env.STRIPE_SERVER_ID_TEST!, {
      apiVersion: '2020-08-27',
    });

    if (!session) {
      return {
        redirect: {
          destination: `/auth/login?url=${router}`,
          permanent: false,
        },
      };
    }
    const {data: userData} = await graphqlRequestHandler(
      userQueries.getUserById,
      {
        token: session?.accessToken,
      },
      process.env.BACKEND_API_KEY
    );

    const {data: stripeAccountRes} = await graphqlRequestHandler(
      stripeQueries.getStripeAccount,
      {},
      session?.accessToken
    );

    const user = userData?.data?.getUserById?.userData;
    const stripeAccountId = stripeAccountRes?.data?.getStripeAccount?.stripeAccountData?.accountId;
    const stripeAccountDocumentId =
      stripeAccountRes?.data?.getStripeAccount?.stripeAccountData?._id;
    let userStripeAccount: Stripe.Response<Stripe.Account> | undefined;
    if (stripeAccountId) {
      userStripeAccount = await stripe.accounts.retrieve(stripeAccountId);
    }

    return {
      props: {
        user,
        userStripeAccount: userStripeAccount || '',
        accountDocumentId: stripeAccountDocumentId || '',
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

/* eslint-disable @typescript-eslint/dot-notation */
import React from 'react';
import {GetServerSideProps} from 'next';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import HeadSeo from 'components/shared/HeadSeo/Seo';
import ServiceLayout from 'components/PostLogin/ServicePageLayout';
import userQueries from 'constants/GraphQL/User/queries';

const BookingPage = ({user, serviceData}) => (
  <>
    <HeadSeo
      title={serviceData.title}
      description={serviceData.description}
      canonicalUrl={`https://30mins.com/${user.accountDetails.username}/${serviceData.title}`}
      ogTwitterImage={
        user.accountDetails.avatar
          ? user.accountDetails.avatar
          : 'https://30mins.com/assets/30mins-ogimage.jpg'
      }
      ogType={'website'}
    />
    <ServiceLayout user={user} serviceData={serviceData} />
  </>
);

export default BookingPage;

export const getServerSideProps: GetServerSideProps = async context => {
  const {data: UserData} = await graphqlRequestHandler(
    userQueries.getPublicUserData,
    {
      username: context.query.username,
    },
    process.env.BACKEND_API_KEY
  );

  const {status} = UserData.data;

  if (status === 404) {
    return {
      notFound: true,
    };
  }
  const user = UserData?.data?.getPublicUserData?.userData;
  const services = UserData?.data?.getPublicUserData?.userData?.services;
  let eventTitle: String;
  if (context?.query?.event) {
    const eventQuery = context.query.event.toString();
    eventTitle = eventQuery.toLowerCase();
  }

  const serviceData = services?.find(serv => serv.slug.toLowerCase() === eventTitle);

  if (!serviceData) {
    return {
      notFound: true,
    };
  }

  serviceData.conferenceType = serviceData.conferenceType.filter(type =>
    user.accountDetails.allowedConferenceTypes.includes(type)
  );

  return {
    props: {
      serviceData,
      user,
    },
  };
};

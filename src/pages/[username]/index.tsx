import queries from 'constants/GraphQL/User/queries';
import integrationQueries from 'constants/GraphQL/Integrations/queries';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {CalendarIcon, ChatAlt2Icon, ShareIcon} from '@heroicons/react/outline';
import {BadgeCheckIcon} from '@heroicons/react/solid';
import useTranslation from 'next-translate/useTranslation';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import {MODAL_TYPES} from 'constants/context/modals';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {GetServerSideProps} from 'next';
import Publications from 'components/PreLogin/Username/Publications';
import Education from 'components/PreLogin/Username/Education';
import JobHistory from 'components/PreLogin/Username/JobHistory';
import Button from '@root/components/button';
import dynamic from 'next/dynamic';
import ReactPlayer from 'react-player';
import HeadSeo from 'components/shared/HeadSeo/Seo';
import classNames from 'classnames';
import ServiceCard from '@root/components/service-card';
import sanitizeHtml from 'sanitize-html';
import {SERVICE_TYPES} from '../../constants/enums';
import TwitterIcon from '../../cinnamon/media-icons/TwitterIcon';
import FacebookIcon from '../../cinnamon/media-icons/FacebookIcon';
import LinkedinIcon from '../../cinnamon/media-icons/LinkedinIcon';
import YoutubeIcon from '../../cinnamon/media-icons/YoutubeIcon';
import InstagramIcon from '../../cinnamon/media-icons/InstagramIcon';

const UserPage = ({user, filteredServices, hasOfficeCredentials, hasGoogleCredentials}) => {
  const {t} = useTranslation();
  const router = useRouter();
  const [userData, setUserData] = useState<any>([]);
  const [publicUrl, setPublicUrl] = useState('');
  const {showModal} = ModalContextProvider();

  const ReactSlides = dynamic(() => import('react-google-slides'), {
    ssr: false,
  });
  useEffect(() => {
    setPublicUrl(window.origin + router.asPath);
    setUserData(user);
  }, [user]);

  const shareProfile = () => {
    showModal(MODAL_TYPES.SHAREPROFILE, {
      name: userData?.personalDetails?.name,
      userLink: publicUrl,
      sharePage: true,
    });
  };
  const sendMessageExtenmsion = () => {
    showModal(MODAL_TYPES.SEND_MESSAGE_EXTENSION, {
      providerName: userData?.personalDetails?.name,
      providerEmail: userData?.accountDetails?.email,
    });
  };

  const UserSocials = userData?.personalDetails?.socials;

  const userPublications = userData?.publications;
  const userEducation = userData?.educationHistory?.sort(
    (a: any, b: any) => new Date(b.startDate).valueOf() - new Date(a.startDate).valueOf()
  );
  const userJobHistory = userData?.jobHistory?.sort(
    (a: any, b: any) => new Date(b.startDate).valueOf() - new Date(a.startDate).valueOf()
  );

  const facebookLink = UserSocials?.facebook;
  const twitterLink = UserSocials?.twitter;
  const instagramLink = UserSocials?.instagram;
  const linkedinLink = UserSocials?.linkedin;
  const youtubeLink = UserSocials?.youtube;

  const hasSocials =
    UserSocials &&
    ((facebookLink && facebookLink !== '') ||
      (instagramLink && instagramLink !== '') ||
      (twitterLink && twitterLink !== '') ||
      (linkedinLink && linkedinLink !== '') ||
      (youtubeLink && youtubeLink !== ''));

  return (
    <div className='flex flex-col gap-2'>
      <HeadSeo
        title={user?.personalDetails?.name}
        description={user?.personalDetails?.headline}
        canonicalUrl={`https://30mins.com/${user?.accountDetails?.username}/availability`}
        ogTwitterImage={
          user?.accountDetails?.avatar
            ? user?.accountDetails?.avatar
            : 'https://30mins.com/assets/30mins-ogimage.jpg'
        }
        ogType={'website'}
      />
      <div className='my-6 lg:my-12 container px-6 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between'>
        <div className='bg-white  shadow rounded xl:flex lg:flex w-full'>
          <div className='xl:w-2/5 lg:w-2/5 bg-gray-100  py-8 border-gray-300  xl:border-r rounded-tl xl:rounded-bl rounded-tr xl:rounded-tr-none lg:border-r-2 border-b xl:border-b-0 flex justify-center items-center'>
            <div className='flex flex-col items-center'>
              <div className='h-36 w-36 rounded-full mb-3'>
                <img
                  className='relative rounded-full h-36 w-36 object-cover object-center '
                  src={userData?.accountDetails?.avatar || '/assets/default-profile.jpg'}
                  alt=''
                />
              </div>
              <div className='flex flex-col gap-2'>
                <Button variant='solid' type='submit' onClick={shareProfile}>
                  <ShareIcon className='w-4 h-4 mr-2 ' /> {t('profile:share_page')}
                </Button>
                <Button variant='solid' type='button' onClick={sendMessageExtenmsion}>
                  <ChatAlt2Icon className='w-4 h-4 mr-2' /> {t('page:send_message_extension')}
                </Button>
                {userData?.accountDetails?.verifiedEmail &&
                  (hasGoogleCredentials || hasOfficeCredentials) && (
                    <a href={`${publicUrl}/availability`}>
                      <Button variant='solid' type='button'>
                        <CalendarIcon className='w-4 h-4 mr-2 ' /> {t('meeting:my_availability')}
                      </Button>
                    </a>
                  )}
              </div>
            </div>
          </div>
          <div className='xl:w-3/5 lg:w-3/5 px-6 py-8'>
            <div className='flex-inline'>
              <div className='item w-full'>
                <h1 className='mb-2 text-3xl font-bold text-gray-900 flex gap-2'>
                  {userData?.personalDetails?.name}
                  {userData?.accountDetails?.verifiedAccount ? (
                    <BadgeCheckIcon width={26} className={'text-mainBlue'} />
                  ) : null}
                </h1>
              </div>
              {userData?.personalDetails?.headline && (
                <p className='mb-2 text-sm text-gray-700 font-bold overflow-hidden break-words'>
                  {userData?.personalDetails?.headline}
                </p>
              )}
              {hasSocials && (
                <div className='item w-full h-12 flex-row'>
                  <>
                    <div className='flex pt-2 text-sm text-gray-500'>
                      <div className='flex-1 inline-flex items-center gap-1'>
                        {twitterLink && <TwitterIcon link={twitterLink} />}
                        {facebookLink && <FacebookIcon link={facebookLink} />}
                        {linkedinLink && <LinkedinIcon link={linkedinLink} />}
                        {instagramLink && <InstagramIcon link={instagramLink} />}
                        {youtubeLink && <YoutubeIcon link={youtubeLink} />}
                      </div>
                    </div>
                  </>
                </div>
              )}
              {user?.personalDetails?.description && (
                <div className='sm:col-span-2 text-sm'>
                  <dd
                    className='custom'
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(user?.personalDetails?.description),
                    }}
                  ></dd>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {filteredServices && filteredServices.length > 0 ? (
        <div className='container flex flex-col mx-auto w-full h-max'>
          <span className={classNames(['ml-2 mb-2 text-3xl font-bold text-gray-900', 'px-6'])}>
            {t('common:Services')}
          </span>
          <div
            className={classNames([
              'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full rounded ',
              'px-6',
            ])}
          >
            {filteredServices?.length > 0 &&
              filteredServices.map((service, index) => (
                <ServiceCard
                  key={index}
                  service={service}
                  type={service.serviceType}
                  username={user?.accountDetails?.username}
                />
              ))}
          </div>
        </div>
      ) : (
        ''
      )}
      {userPublications && userPublications.length > 0 ? (
        <div className='w-full h-full py-10'>
          <div className='container px-6 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between'>
            <div className='container mx-auto'>
              <h1 className='ml-2 mb-2 text-3xl font-bold text-gray-900'>
                {t('common:Publications')}
              </h1>
              <div className='w-full rounded '>
                {userPublications.map((item, key) => (
                  <div className='bg-white shadow rounded  mb-4 xl:flex lg:flex w-full' key={key}>
                    <Publications key={key} item={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      {userEducation && userEducation.length > 0 ? (
        <div className='w-full h-full py-16'>
          <div className='container px-6 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between'>
            <div className='container mx-auto'>
              <h1 className='ml-2 mb-2 text-3xl font-bold text-gray-900'>
                {t('common:Education')}
              </h1>
              <div className='w-full rounded '>
                {userEducation.map((item, key) => (
                  <div className='bg-white shadow rounded mb-4 xl:flex lg:flex w-full' key={key}>
                    <Education key={key} item={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      {userJobHistory && userJobHistory.length > 0 ? (
        <div className='w-full h-full mb-20'>
          <div className='container px-6 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between'>
            <div className='container mx-auto'>
              <h1 className='ml-2 mb-2 text-3xl font-bold text-gray-900'>
                {t('common:Job History')}
              </h1>
              <div className='w-full rounded '>
                {userJobHistory.map((item, key) => (
                  <div className='bg-white shadow rounded mb-4 xl:flex lg:flex w-full' key={key}>
                    <JobHistory key={key} item={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      <div className='flex w-full justify-center'>
        {userData?.personalDetails?.profileMediaType ? (
          userData?.personalDetails?.profileMediaType === 'Google Slides' &&
          userData?.personalDetails?.profileMediaLink.startsWith(
            'https://docs.google.com/presentation'
          ) ? (
            <div className='w-1/2 h-full my-8'>
              <ReactSlides
                height='640'
                width='100%'
                slideDuration={5}
                position={1}
                showControls
                loop
                slidesLink={userData?.personalDetails?.profileMediaLink}
              />
            </div>
          ) : null
        ) : null}

        {userData?.personalDetails?.profileMediaLink &&
        userData?.personalDetails?.profileMediaType === 'Youtube Embed' ? (
          <div
            className='relative flex justify-center flex-wrap w-full overflow-hidden my-8'
            style={{
              height: '500px',
            }}
          >
            <ReactPlayer url={`${userData?.personalDetails?.profileMediaLink}`} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default UserPage;

export const getServerSideProps: GetServerSideProps = async context => {
  const {data: userData} = await graphqlRequestHandler(
    queries.getPublicUserData,
    {
      username: context.query.username,
    },
    process.env.BACKEND_API_KEY
  );

  const {data: userId} = await graphqlRequestHandler(
    queries.getUserByUsername,
    {
      username: context.query.username,
    },
    process.env.BACKEND_API_KEY
  );

  if (!userData?.data?.getPublicUserData?.userData || !userId?.data?.getUserByUsername?.userData) {
    return {
      notFound: true,
    };
  }
  const user = userData?.data?.getPublicUserData?.userData;

  const userServices = user?.services;
  const filteredServices = userServices?.filter(
    service => service.isPrivate === false && service.serviceType !== SERVICE_TYPES.ROUND_ROBIN
  );

  const id = userId?.data?.getUserByUsername?.userData?._id;

  const {
    data: {
      data: {getCredentialsByUserId},
    },
  } = await graphqlRequestHandler(
    integrationQueries.getCredentialsByUserId,
    {
      userId: id,
    },
    process.env.BACKEND_API_KEY
  );

  const hasOfficeCredentials = getCredentialsByUserId?.officeCredentials
    ? getCredentialsByUserId?.officeCredentials.length > 0
    : false;
  const hasGoogleCredentials = getCredentialsByUserId?.googleCredentials
    ? getCredentialsByUserId?.googleCredentials.length > 0
    : false;

  return {
    props: {
      user,
      filteredServices,
      hasOfficeCredentials,
      hasGoogleCredentials,
    },
  };
};

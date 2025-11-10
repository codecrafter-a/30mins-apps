/* eslint-disable import/no-named-as-default-member */
import {useMutation} from '@apollo/client';
import {GetServerSideProps} from 'next';
import {getSession, useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import {useRouter} from 'next/router';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import integrationQueries from 'constants/GraphQL/Integrations/queries';
import userQueries from 'constants/GraphQL/User/queries';
import mutations from 'constants/GraphQL/Integrations/mutations';
import {MODAL_TYPES} from 'constants/context/modals';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import axios from 'axios';
import PostLoginLayout from '@root/components/layout/post-login';
import Header from '@root/components/header';
import stripeProductIDs from 'constants/stripeProductIDs';
import Container from 'components/PostLogin/Extensions/Zoom/Container';

const Zoom = ({zoomEmails, errors, hasExtension}) => {
  const router = useRouter();
  const {t} = useTranslation();
  const {data: session} = useSession();
  const {showModal, hideModal} = ModalContextProvider();
  const [zoomMutation] = useMutation(mutations.deleteZoomCredentials);

  const handleDeleteZoom = async email => {
    await zoomMutation({
      variables: {
        email: email,
        token: session?.accessToken,
      },
    });
    router.push('/user/extensions/zoom');
    hideModal();
  };

  const deleteZoom = itemID => {
    showModal(MODAL_TYPES.DELETE, {
      name: itemID,
      id: itemID,
      handleDelete: handleDeleteZoom,
    });
  };
  const crumbs = [{title: t('page:Home'), href: '/'}];
  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('common:txt_zoom_extension')} />
      {hasExtension ? (
        <Container zoomCredentials={zoomEmails} errors={errors} deleteZoom={deleteZoom} />
      ) : (
        <div className='flex flex-col'>
          {t('common:txt_no_zoom_extension')}
          <a
            href='/user/extensions'
            className='max-w-max px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mainBlue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            {t('common:view_extensions_page')}
          </a>
        </div>
      )}
    </PostLoginLayout>
  );
};
export default Zoom;

Zoom.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);

  let errors = '';

  if (context?.query?.code) {
    await axios
      .post(`${process.env.FRONT_END_URL}/api/integrations/zoom/addCredential`, {
        code: context.query.code,
        token: session?.accessToken,
        email: session?.user?.email,
      })
      .catch(err => {
        errors = err.response.data.message;
      });
  }

  try {
    const {data: user} = await graphqlRequestHandler(
      userQueries.getUserById,
      {
        token: session?.accessToken,
      },
      process.env.BACKEND_API_KEY
    );

    const hasExtension =
      user?.data?.getUserById?.userData?.accountDetails?.activeExtensions.includes(
        stripeProductIDs.EXTENSIONS.ZOOM
      );

    const {data: integrations} = await graphqlRequestHandler(
      integrationQueries.getCredentialsByToken,
      {
        token: session?.accessToken,
      },
      process.env.BACKEND_API_KEY
    );

    const zoomEmails = integrations?.data?.getCredentialsByToken?.zoomCredentials.map(
      credential => credential.userEmail
    );

    return {
      props: {
        zoomEmails,
        errors,
        hasExtension,
      },
    };
  } catch (err) {
    return {
      props: {
        zoomEmails: [],
        errors: 'Unknown Error',
        hasExtension: false,
      },
    };
  }
};

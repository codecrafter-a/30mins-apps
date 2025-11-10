import {LoaderIcon} from 'react-hot-toast';
import {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {useQuery} from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import queries from 'constants/GraphQL/Organizations/queries';
import OrganizationNavbar from './OrganizationNavbar';
import useOrganizations from './useOrganizations';
import Table from './Table';

const Organizations = ({user}) => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const [Orgs, setOrgs] = useState<any>(undefined);
  const {data: organizations, refetch: refetchOrg} = useQuery(
    queries.getOrganizationManagementDetails,
    {
      variables: {
        token: session?.accessToken,
      },
      context: {
        headers: {
          Authorization: session?.accessToken,
        },
      },
    }
  );

  useEffect(() => {
    setOrgs(organizations?.getOrganizationManagementDetails?.membershipData);
  }, [organizations]);

  const {data: invitedUsers} = useQuery(queries.getPendingInvitesByUserId, {
    variables: {token: session?.accessToken},
  });

  const invitedOrgs = invitedUsers?.getPendingInvitesByUserId?.pendingInvites;
  const User = user?.data?.getUserById?.userData;

  const refetch = () => {
    setOrgs(undefined);
    refetchOrg();
  };

  const {orgModals} = useOrganizations({
    userOrgs: Orgs,
    activeExtensions: User?.accountDetails?.activeExtensions,
    invitedOrgs,
    refetch,
  });

  if (session) {
    return (
      <>
        <div className={'flex flex-col items-center w-full h-full gap-4'}>
          <OrganizationNavbar modals={orgModals} invitedOrgs={invitedOrgs} />
          {Orgs === undefined ? (
            <div className='w-full h-16 flex flex-1 justify-center items-center'>
              <LoaderIcon style={{width: 50, height: 50}} />
            </div>
          ) : Orgs?.length > 0 ? (
            <Table orgs={Orgs} userId={User._id} refetch={refetch} />
          ) : (
            <>
              <span className={'text-2xl font-normal text-red-600 text-left w-full'}>
                {t('page:member_no_org')}
              </span>
              <p className={'text-sm font-normal text-left w-full'}>
                {t('page:why_organizations')}
              </p>
            </>
          )}
        </div>
      </>
    );
  }
  return null;
};
export default Organizations;

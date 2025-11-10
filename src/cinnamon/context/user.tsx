/* eslint-disable react-hooks/rules-of-hooks */
import {useQuery} from '@apollo/client';
import {signOut, useSession} from 'next-auth/react';
import {createContext, PropsWithChildren, useEffect, useState} from 'react';

import ProductIDs from 'constants/stripeProductIDs';
import queries from 'constants/GraphQL/User/queries';
import exQueries from 'constants/GraphQL/ActiveExtension/queries';
import intQueries from 'constants/GraphQL/Integrations/queries';
import orgQueries from 'constants/GraphQL/Organizations/queries';

type User = {
  accountType: string | undefined;
  isMarketer: boolean | undefined;
  username: string | undefined;
  welcomeComplete: boolean | undefined;
  timezone: string | undefined;
  email: string | undefined;
  workingHours: any | undefined;
  escrowAccount: boolean | undefined;
  directAccount: boolean | undefined;
  avatar: string | undefined;
  name: string | undefined;
  hasZoomExtention: boolean | undefined;
  allowedConferenceTypes: Array<string> | undefined;
  verifiedAccount: boolean | undefined;
  country: string | undefined;
  zipCode: string | undefined;
};

export const UserContext = createContext<{
  user: User | undefined;
  hasOrgs: boolean | undefined;
  hasOrgServiceCats: boolean | undefined;
  hasCalendar: string;
  hasOrgExtention: boolean | undefined;
  hasBWExtention: boolean | undefined;
  unreadMessageCount?: number;
  pendingInvites: Array<any>;
  zoomEmails: Array<any>;
  refetchUser: () => void;
  setUser: (u: User) => void;
  setHasOrgs: (boolean) => void;
  setHasOrgServiceCats: (u: boolean) => void;
  setHasCalendar: (u: string) => void;
  setHasOrgExtention: (u: boolean) => void;
  setHasBWExtention: (u: boolean) => void;
  setUnreadMessageCount: (count: number) => void;
  setpendingInvites: (count: Array<any>) => void;
}>({
  user: undefined,
  hasOrgs: undefined,
  hasOrgServiceCats: undefined,
  hasCalendar: '',
  hasOrgExtention: undefined,
  hasBWExtention: undefined,
  unreadMessageCount: undefined,
  zoomEmails: [],
  pendingInvites: [],
  refetchUser: () => {},
  setUser: () => {},
  setHasOrgs: () => undefined,
  setHasOrgServiceCats: () => undefined,
  setHasCalendar: () => undefined,
  setpendingInvites: () => undefined,
  setUnreadMessageCount: () => undefined,
  setHasOrgExtention: () => undefined,
  setHasBWExtention: () => undefined,
});

const UserCtxProvider = ({children}: PropsWithChildren<unknown>) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [hasOrgs, setHasOrgs] = useState<boolean | undefined>(undefined);
  const [hasOrgServiceCats, setHasOrgServiceCats] = useState<boolean | undefined>(undefined);
  const [hasCalendar, setHasCalendar] = useState<string>('');
  const [hasOrgExtention, setHasOrgExtention] = useState<boolean | undefined>(undefined);
  const [unreadMessageCount, setUnreadMessageCount] = useState<number | undefined>(undefined);
  const [pendingInvites, setpendingInvites] = useState<any>([]);
  const [zoomEmails, setZoomEmails] = useState<any>([]);
  const [hasBWExtention, setHasBWExtention] = useState<boolean | undefined>(undefined);

  const {data: session} = useSession();

  const {data: userData, refetch: refetchUser} = useQuery(queries.getUserById, {
    variables: {token: session?.accessToken},
    skip: session ? false : true,
  });

  const {data: extentionsData} = useQuery(exQueries.getActiveExtensions, {
    variables: {token: session?.accessToken},
    skip: session ? false : true,
  });

  const {data: integrationsData, loading: intLoading} = useQuery(intQueries.getCredentialsByToken, {
    variables: {token: session?.accessToken},
    skip: session ? false : true,
  });

  const {data: organizationsData} = useQuery(orgQueries.getOrganizationsByUserId, {
    variables: {token: session?.accessToken},
    skip: session ? false : true,
  });

  useEffect(() => {
    if (integrationsData) {
      setZoomEmails(
        integrationsData?.getCredentialsByToken?.zoomCredentials?.map(
          credential => credential.userEmail
        )
      );
    }
  }, [integrationsData]);

  useEffect(() => {
    if (
      extentionsData?.getActiveExtensions.activeExtensionData &&
      extentionsData?.getActiveExtensions.activeExtensionData.length > 0
    ) {
      const extentions = extentionsData?.getActiveExtensions.activeExtensionData;
      const orgExt = extentions.find(e =>
        [ProductIDs.EXTENSIONS.ORGANIZATIONS, ProductIDs.EXTENSIONS.ORGANIZATIONS_ANNUAL].includes(
          e.extensionProductId
        )
      );
      if (!orgExt) {
        setHasOrgExtention(false);
      } else {
        setHasOrgExtention(true);
      }
      const BWExt = extentions.find(
        e => e.extensionProductId === ProductIDs.EXTENSIONS.WHITE_BLACK_LIST
      );
      if (!BWExt) {
        setHasBWExtention(false);
      } else {
        setHasBWExtention(true);
      }
    }
  }, [extentionsData]);

  useEffect(() => {
    if (
      organizationsData?.getOrganizationsByUserId.membershipData &&
      organizationsData.getOrganizationsByUserId.membershipData.length > 0
    ) {
      setHasOrgs(true);
      const orgs = organizationsData.getOrganizationsByUserId.membershipData;
      orgs.forEach(org => {
        if (org.organizationId.serviceCategories.length > 0) {
          setHasOrgServiceCats(true);
        }
      });
    }
  }, [organizationsData]);

  useEffect(() => {
    if (!intLoading) {
      if (
        integrationsData?.getCredentialsByToken.googleCredentials ||
        integrationsData?.getCredentialsByToken.officeCredentials
      ) {
        setHasCalendar('yes');
      } else {
        setHasCalendar('no');
      }
    }
    if (intLoading) {
      setHasCalendar('pending');
    }
  }, [integrationsData, intLoading]);

  useEffect(() => {
    if (userData?.getUserById?.response?.status === 404) {
      signOut();
      return;
    }

    if (userData || userData?.getUserById?.response?.status === 200) {
      setUser({
        ...user,
        accountType: userData.getUserById.userData.accountDetails.accountType,
        isMarketer: userData.getUserById.userData.isMarketer,
        welcomeComplete: userData.getUserById.userData.welcomeComplete,
        username: userData.getUserById.userData.accountDetails.username,
        avatar: userData.getUserById.userData.accountDetails.avatar,
        name: userData.getUserById.userData.personalDetails.name,
        country: userData.getUserById.userData.accountDetails.country,
        timezone: userData.getUserById.userData.locationDetails?.timezone,
        hasZoomExtention: userData.getUserById.userData.accountDetails?.activeExtensions.includes(
          ProductIDs.EXTENSIONS.ZOOM
        ),
        email: userData.getUserById.userData.accountDetails.email,
        workingHours: userData.getUserById.userData.workingHours,
        zipCode: userData.getUserById.userData.locationDetails.zipCode,
        allowedConferenceTypes: userData.getUserById.userData.accountDetails.allowedConferenceTypes,
        verifiedAccount: userData.getUserById.userData.accountDetails.verifiedAccount,
        escrowAccount:
          userData.getUserById.userData.accountDetails.paymentAccounts.escrow.length > 0
            ? true
            : false,
        directAccount:
          userData.getUserById.userData.accountDetails.paymentAccounts.direct.length > 0
            ? true
            : false,
      });
    }
  }, [userData]);

  return (
    <UserContext.Provider
      value={{
        user,
        hasOrgs,
        hasOrgServiceCats,
        hasCalendar,
        hasOrgExtention,
        unreadMessageCount,
        hasBWExtention,
        pendingInvites,
        zoomEmails,
        refetchUser,
        setpendingInvites,
        setUser,
        setHasOrgs,
        setHasOrgServiceCats,
        setHasCalendar,
        setHasOrgExtention,
        setUnreadMessageCount,
        setHasBWExtention,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserCtxProvider;

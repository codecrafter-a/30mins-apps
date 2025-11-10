import Link from 'next/link';
import classNames from 'classnames';
import {SVGProps, useContext, useEffect, useState} from 'react';
import useTranslation from 'next-translate/useTranslation';
import SidebarSubmenu from 'components/PostLogin/Dashboard/SidebarLinkGroup';
import {useQuery} from '@apollo/client';
import queries from 'constants/GraphQL/LiveChat/queries';
import orgQuery from 'constants/GraphQL/Organizations/queries';
import {useSession} from 'next-auth/react';
import {UserContext} from '@root/context/user';
import Head from 'next/head';
import NavLinkCount from './nav-link-count';

type Props = {
  name: string;
  pathname: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  href: string;
  collapsed: boolean;
  route: any;
  setCollapsed: (value: boolean) => void;
};

const NavLink = (props: Props) => {
  // State
  const {data: session} = useSession();
  const {t} = useTranslation('page');
  const [showHeadTitle, setshowHeadTitle] = useState(false);
  const {unreadMessageCount, setUnreadMessageCount, pendingInvites, setpendingInvites} =
    useContext(UserContext);

  // Queries
  const {data} = useQuery(queries.GetTotalUnreadMsgs, {
    variables: {
      email: session?.user?.email,
    },
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
    skip: !session?.accessToken || !session?.user?.email,
  });

  const {
    data: dataInvites,
    loading: loadingInvites,
    refetch: fetchInvites,
  } = useQuery(orgQuery.getPendingInvitesByUserId, {
    variables: {token: session?.accessToken},
  });

  // useEffects
  useEffect(() => {
    if (props.name === 'Chat' && unreadMessageCount === undefined) {
      if (parseInt(`${unreadMessageCount}`, 10) > 0) {
        return;
      }
      if (data?.getTotalUnreadMsgs?.unreadMessageCount > 0) {
        setshowHeadTitle(true);
        setUnreadMessageCount(data?.getTotalUnreadMsgs?.unreadMessageCount);
        setTimeout(() => {
          setshowHeadTitle(false);
        }, 15000);
      } else {
        setUnreadMessageCount(data?.getTotalUnreadMsgs?.unreadMessageCount);
      }
    }
  });

  useEffect(() => {
    fetchInvites();
  });

  useEffect(() => {
    if (!loadingInvites) {
      setpendingInvites(dataInvites?.getPendingInvitesByUserId?.pendingInvites);
    }
  }, [loadingInvites]);

  return (
    <>
      {showHeadTitle && (
        <Head>
          <title>
            🔔 {unreadMessageCount && unreadMessageCount < 10 ? unreadMessageCount : '+9'}{' '}
            {t('messages')}
          </title>
        </Head>
      )}
      {props.name === 'Payments' ? (
        <SidebarSubmenu
          setCollapsed={props.setCollapsed}
          route={props.route}
          key={props.name}
          isCollapse={props.collapsed}
          isMobile={false}
        />
      ) : props.name === 'Admin' ? (
        <SidebarSubmenu
          setCollapsed={props.setCollapsed}
          route={props.route}
          key={props.name}
          isCollapse={props.collapsed}
          isMobile={false}
        />
      ) : props.name === 'Affiliate' ? (
        <SidebarSubmenu
          setCollapsed={props.setCollapsed}
          route={props.route}
          key={props.name}
          isCollapse={props.collapsed}
          isMobile={false}
        />
      ) : props.name === 'Chat' || props.name === 'Pending Invites' ? (
        <NavLinkCount
          value={props.name === 'Chat' ? unreadMessageCount : pendingInvites?.length}
          {...props}
        />
      ) : (
        <Link key={props.name} href={props.href} passHref>
          <span
            key={props.name}
            className={classNames(
              props.href === props.pathname
                ? 'bg-mainBlue bg-opacity-[12.5%] text-mainBlue'
                : 'text-gray-600 hover:text-mainBlue',
              'flex group space-x-4 items-center py-2 pr-3 pl-5 text-base font-normal rounded-lg cursor-pointer text-left'
            )}
          >
            <props.icon
              className={classNames(
                props.href === props.pathname
                  ? 'text-mainBlue'
                  : 'text-gray-400 group-hover:text-mainBlue',
                'flex flex-shrink-0 items-start justify-center w-6 h-6'
              )}
              aria-hidden='true'
            />
            {!props?.collapsed && (
              <span className='flex-1 min-w-0 my-0 whitespace-nowrap transition-width duration-200 easy'>
                {t(props.name)}
              </span>
            )}
          </span>
        </Link>
      )}
    </>
  );
};

export default NavLink;

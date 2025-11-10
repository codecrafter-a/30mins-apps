import {Fragment, useContext, useState} from 'react';
import Crumb from '@components/header/crumb';
import useTranslation from 'next-translate/useTranslation';
import {MenuIcon} from '@heroicons/react/outline';
import classNames from 'classnames';
import Search from 'components/PostLogin/Search';
import {useRouter} from 'next/router';
import {Transition} from '@headlessui/react';
import {UserContext} from '@root/context/user';
import Sidebar from '../sidebar';
import Button from '../button';

type CrumbType = {
  href: string;
  title: string;
};

type Props = {
  crumbs: CrumbType[];
  heading: string;
  StartChat?: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
};

const Header = ({crumbs, heading, StartChat}: Props) => {
  const {t} = useTranslation();
  const {user} = useContext(UserContext);
  const {asPath} = useRouter();
  const [collapsed, setCollapsed] = useState(true);
  return (
    <>
      <div>
        <div className='flex rounded-b-md bg-white w-full justify-between items-center'>
          <div className='flex flex-col w-full'>
            <nav className='flex w-full pt-4' aria-label='Breadcrumb'>
              <ul role='list' className='flex items-center'>
                {crumbs.map((crumb, index) => (
                  <Crumb key={index} href={crumb.href} title={crumb.title} />
                ))}
              </ul>
            </nav>
            <div className='flex flex-row items-center w-full justify-between pb-4 '>
              <h2
                title={heading}
                className='text-lg font-bold break-all line-clamp-1 max-w-2/4 text-mainBlue sm:text-2xl '
              >
                {heading}
              </h2>
              <div className='flex items-center gap-2 self-end'>
                <Search />
                {StartChat && StartChat}
                <button
                  onClick={() => setCollapsed(false)}
                  className='p-2 flex xl:hidden justify-center items-center bg-gray-200 bg-opacity-50 rounded-md'
                >
                  <MenuIcon className='w-6 h-6' />
                </button>
              </div>
            </div>
          </div>
        </div>

        <Transition
          show={!collapsed}
          as={Fragment}
          enter='transition ease-out duration-150'
          enterFrom='opacity-0'
          enterTo='opacity-75'
          leave='transition ease-in duration-150'
          leaveFrom='opacity-75'
          leaveTo='opacity-0'
        >
          <div
            className={classNames('bg-black fixed top-0 left-0 right-0 xl:hidden bottom-0 z-40')}
          ></div>
        </Transition>
        <Transition
          show={!collapsed}
          as={Fragment}
          enter='duration-300'
          enterFrom='absolute -left-72'
          enterTo='absolute -left-0'
          leave='duration-300'
          leaveFrom='absolute -left-0'
          leaveTo='absolute -left-72'
        >
          <div className={classNames('absolute top-0 bottom-0 w-72 z-50 xl:hidden bg-white')}>
            <Sidebar isMobile collapsed={collapsed} setClosed={setCollapsed} />
          </div>
        </Transition>
      </div>
      {!asPath.startsWith('/user/welcome') && user?.welcomeComplete === false && (
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between border mb-2 rounded-md shadow-sm hover:shadow-inner gap-4 px-4 py-2'>
          <span className='text-xs font-medium w-full'>
            {t('common:txt_you_have_not_completed_the_Welcome_Process')}
          </span>
          <a href='/user/welcome' className=''>
            <Button variant='solid' className='text-xs w-48' onClick={() => {}}>
              {t('common:start_welcome_process')}
            </Button>
          </a>
        </div>
      )}
    </>
  );
};

export default Header;

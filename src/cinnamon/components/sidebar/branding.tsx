import {XIcon} from '@heroicons/react/outline';
import {ChevronDoubleLeftIcon, ChevronDoubleRightIcon} from '@heroicons/react/solid';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  setClosed: any;
};

const Branding = ({collapsed, setCollapsed, setClosed}: Props) => (
  <div className='flex flex-shrink-0 justify-between items-center py-3 pl-4 pr-5 mb-2 border-b border-gray-300 shadow-md bg-white'>
    {!collapsed && (
      <Link href='/' passHref>
        <Image
          className='h-16 w-auto items-center cursor-pointer'
          src='/assets/logo.svg'
          alt='logo'
          height={40}
          width={40}
        />
      </Link>
    )}

    <div
      className={classNames(
        'border my-1 border-gray-300 rounded-lg h-9 w-9 hidden xl:flex items-center cursor-pointer justify-center bg-white drop-shadow-sm',
        collapsed && 'ml-3',
        'hover:bg-gray-200 hover:bg-opacity-50'
      )}
      onClick={() => (collapsed ? setCollapsed(false) : setCollapsed(true))}
    >
      {collapsed ? (
        <ChevronDoubleRightIcon className='h-5 w-5 text-gray-400' />
      ) : (
        <ChevronDoubleLeftIcon className='h-5 w-5 text-gray-400' />
      )}
    </div>
    <div
      className={classNames(
        'border my-1 border-gray-300 rounded-lg h-9 w-9 flex xl:hidden items-center cursor-pointer justify-center bg-white drop-shadow-sm',
        collapsed && 'ml-3',
        'hover:bg-gray-200 hover:bg-opacity-50'
      )}
      onClick={() => setClosed(true)}
    >
      <XIcon className='h-5 w-5 text-gray-400' />
    </div>
  </div>
);

export default Branding;

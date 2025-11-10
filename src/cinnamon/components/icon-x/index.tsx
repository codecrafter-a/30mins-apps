import {XIcon} from '@heroicons/react/outline';
import {SVGAttributes} from 'react';

export default function IconX({...rest}: SVGAttributes<SVGSVGElement>) {
  return (
    <XIcon
      width={22}
      height={22}
      className='border p-[2px] cursor-pointer border-red-500  rounded-full text-red-500 active:bg-red-500 active:text-white'
      {...rest}
    />
  );
}

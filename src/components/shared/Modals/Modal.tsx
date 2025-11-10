import React, {PropsWithChildren} from 'react';
import {XIcon} from '@heroicons/react/solid';
import {ModalContextProvider} from '../../../store/Modal/Modal.context';

type Props = PropsWithChildren<{
  icon?: any;
  title?: string;
  medium?: Boolean;
  small?: Boolean;
  extraSmall?: Boolean;
  extraMedium?: Boolean;
}>;

const Modal = ({title, children, medium, small, extraSmall, extraMedium}: Props) => {
  const {hideModal} = ModalContextProvider();

  return (
    <>
      <div
        className='fixed inset-0 overflow-y-auto'
        style={{
          maxHeight: '100vh',
          paddingRight: '10px',
          paddingLeft: '10px',
          zIndex: '60',
        }}
        aria-labelledby='modal-title'
        role='dialog'
        aria-modal='true'
      >
        <div className='relative min-h-screen max-h-screen text-center flex justify-center items-center'>
          <div
            className='fixed h-screen w-screen inset-0 bg-black bg-opacity-50 transition-opacity max-h-screen'
            aria-hidden='true'
          ></div>
          <div
            className={`inline-block bg-white rounded-lg mx-4 sm:mx-0 px-4  pb-4 space-y-5  text-left shadow-xl transform transition-all overflow-y-scroll md:overflow-auto lg:overflow-auto md:overflow-x-hidden lg:overflow-x-hidden align-middle max-w-4xl w-full p-6 sm:my-8 sm:align-middle sm:max-w-4xl max-h-[90vh]`}
            style={{
              width: extraMedium
                ? '600px'
                : medium
                ? '550px'
                : small
                ? '400px'
                : extraSmall
                ? '340px'
                : '100%',
            }}
          >
            <div className='flex justify-between items-center'>
              <h3 className='text-lg leading-6 font-bold text-gray-900 justify-center break-all line-clamp-1 w-3/4 align-middle text-left'>
                {title}
              </h3>
              <div
                className='border p-2 rounded-md hover:text-red-500 cursor-pointer'
                onClick={() => hideModal()}
              >
                <XIcon className={'h-6 w-6  duration-200 cursor-pointer'} />
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
export default Modal;

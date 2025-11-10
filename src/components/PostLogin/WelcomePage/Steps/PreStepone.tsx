import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';

const PreStepOne = ({handleClick}) => {
  const {t} = useTranslation();

  const handleNext = () => {
    handleClick();
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 sm:mt-16 mx-2 md:mx-8'>
      <div className='grid grid-cols-1 sm:grid-cols-1 gap-4 mt-0 mx-8 col-span-1'>
        <div className='mt-0 sm:mx-auto sm:max-w-3xl sm:px-0 h-full flex items-center justify-center'>
          <Image
            src='/assets/welcome0.png'
            alt='welcome'
            height={600}
            width={600}
            layout='intrinsic'
            objectFit='contain'
          />
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-1 gap-4 mt-0 mx-4 col-span-2'>
        <h1 className='text-3xl font-extrabold text-gray-900 sm:text-5xl sm:leading-none sm:tracking-tight lg:text-4xl'>
          {t('common:welcome_1_0')}
          {t(' ')}
          <span className='text-mainBlue'>{t('common:welcome_1_joining')}</span>
          {t(' ')}
          {t('common:welcome_1_1')}
        </h1>
        <p className='mt-6 text-sm text-gray-500'>
          {t('common:welcome_2')} {t(' ')} {t('common:welcome_2_b')}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='w-6 h-6 text-red-500 inline-block'
          >
            {' '}
            <path d='M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z' />{' '}
          </svg>
        </p>
        <p className='mt-6 text-sm text-gray-500'>{t('common:welcome_2_b1')}</p>
        <div className='px-4 py-0 text-right sm:px-6'>
          <button
            type='submit'
            onClick={handleNext}
            className={` bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue`}
          >
            {t('common:btn_continue')}
          </button>
        </div>
      </div>
    </div>
  );
};
export default PreStepOne;

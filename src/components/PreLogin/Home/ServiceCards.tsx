import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';

const ServiceCards = () => {
  const {t} = useTranslation('page');
  return (
    <div className='py-0'>
      <div className='flex flex-wrap bg-gray-50'>
        <div className='mx-auto w-full grid grid-cols-1 md:grid-cols-2 mt-4 mb-0 sm:mb-0 gap-4 px-6 sm:px-20 pt-6 pb-6'>
          <div className='mx-auto grid col-span-2 gap-4 mt-0 pb-0'>
            <div className='mx-auto grid grid-cols-1 mt-4 px-0 h-full'>
              <h2 className='text-base font-semibold tracking-wider text-mainBlue uppercase'>
                {t('page:Join_as_expert2')}
              </h2>
              <h1
                className='mb-4 text-4xl font-extrabold text-mainText animate__animated animate__fadeIn'
                data-wow-delay='.1s'
              >
                {t('page:We_make_scheduling_and_earning_easy')}
              </h1>
              <p
                className='mb-8 leading-loose text-blueGray-400 wow animate__animated animate__fadeIn'
                data-wow-delay='.3s'
              >
                {t('page:make_money_in_gigeconomy')}
              </p>
            </div>
          </div>
          <div className='mx-auto hidden md:grid grid-cols-1 sm:grid-cols-1 gap-4 mt-0 pb-0'>
            <div className='grid grid-cols-1 mt-4 mx-auto px-0 h-full'>
              <Image
                src='/assets/hero_earnings.svg'
                alt='hero'
                height={300}
                width={400}
                layout='intrinsic'
                objectFit='contain'
              />
            </div>
          </div>
          <div className='mx-auto grid grid-cols-1 gap-4 mt-0 pb-0'>
            <ul className='space-y-12'>
              <li className='flex -mx-4 wow animate__animated animate__fadeIn' data-wow-delay='.3s'>
                <div className='px-4'>
                  <span className='flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-mainBlue text-white'>
                    1
                  </span>
                </div>
                <div className='px-4'>
                  <h3 className='text-2xl font-extrabold text-mainText'>
                    {t('page:Automate_reminders_and_followup')}
                  </h3>
                  <p className='text-blueGray-400'>{t('page:Your_entire_meeting_workflow')}</p>
                </div>
              </li>
              <li className='flex -mx-4 wow animate__animated animate__fadeIn' data-wow-delay='.5s'>
                <div className='px-4'>
                  <span className='flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-mainBlue text-white'>
                    2
                  </span>
                </div>
                <div className='px-4'>
                  <h3 className='text-2xl font-extrabold text-mainText'>
                    {t('page:Get_paid_on_time')}
                  </h3>
                  <p className='text-blueGray-400'>{t('page:Payment_is_transferred_to_you')}</p>
                </div>
              </li>
              <li className='flex -mx-4 wow animate__animated animate__fadeIn' data-wow-delay='.7s'>
                <div className='px-4'>
                  <span className='flex w-16 h-16 mx-auto items-center justify-center text-2xl font-bold font-heading rounded-full bg-mainBlue text-white'>
                    3
                  </span>
                </div>
                <div className='px-4'>
                  <h3 className='text-2xl font-extrabold text-mainText'>
                    {t('page:Market_Development')}
                  </h3>
                  <p className='text-blueGray-400'>{t('page:Market_Development_Description')}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className='mx-auto bg-black grid place-items-center h-[800px] sm:h-[1000px]'>
        <div className='mx-auto bg-black grid grid-cols-1 mt-4 mb-4 gap-4 py-4 px-4 sm:px-20 pt-0 pb-4'>
          <table>
            <thead>
              <tr>
                <th
                  scope='col'
                  className='w-[150px] sm:w-[400px] sm:text-3xl bg-[#dbae49] px-2 sm:px-6 py-3 text-left text-xs font-extraBold text-white uppercase tracking-wider'
                >
                  {t('page:Hero_price_table')}
                </th>
                <th
                  scope='col'
                  className='w-[100px] sm:w-[200px] sm:text-3xl  bg-[#00a3fe] px-2 sm:px-6 py-3 text-left text-xs font-extraBold text-white uppercase tracking-wider'
                >
                  {t('page:Hero_free')}
                </th>
                <th
                  scope='col'
                  className='w-[100px] sm:w-[200px] sm:text-3xl  bg-[#3bb44a] px-2 sm:px-6 py-3 text-left text-xs font-extraBold text-white uppercase tracking-wider'
                >
                  {t('page:Hero_premium')}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={3}
                  className='bg-gray-200 px-2 sm:px-6 border-t-2 border-b-2 border-r-2 border-gray-500'
                >
                  <h1 className='text-xl pt-1 pb-1 pl-2 sm:text-2xl font-extrabold text-mainText tracking-tight'>
                    {t('page:Hero_essential_features')}
                  </h1>
                </td>
              </tr>
              <tr>
                <td className='bg-white w-[200px] sm:w-[400px] px-2 sm:px-6 border-r-2 border-gray-500'>
                  <span className='font-light text-base my-2'>
                    <ul className='disc ml-0'>
                      <li className='font-normal text-xs sm:text-lg'>
                        {t('page:Hero_essential_features_1')}
                      </li>
                      <li className='font-normal text-xs sm:text-lg'>
                        {t('page:Hero_essential_features_2')}
                      </li>
                      <li className='font-normal text-xs sm:text-lg'>
                        {t('page:Hero_essential_features_3')}
                      </li>
                      <li className='font-normal text-xs sm:text-lg'>
                        {t('page:Hero_essential_features_4')}
                      </li>
                      <li className='font-normal text-xs sm:text-lg'>
                        {t('page:Hero_essential_features_5')}
                      </li>
                      <li className='font-normal text-xs sm:text-lg'>
                        {t('page:Hero_essential_features_6')}
                      </li>
                      <li className='font-normal text-xs sm:text-lg'>
                        {t('page:Hero_essential_features_7')}
                      </li>
                      <li className='font-normal text-xs sm:text-lg'>
                        {t('page:Hero_essential_features_8')}
                      </li>
                      <li className='font-normal text-xs sm:text-lg'>
                        {t('page:Hero_essential_features_9')}
                      </li>
                    </ul>
                    <br />
                  </span>
                </td>
                <td className='bg-white px-2 sm:px-6 border-r-2 border-gray-500'>
                  <div className='mx-auto grid grid-cols-1 mt-4 mx-auto px-0 h-full'>
                    <Image
                      src='/assets/success.png'
                      alt='hero'
                      height={32}
                      width={32}
                      layout='intrinsic'
                      objectFit='contain'
                    />
                  </div>
                </td>
                <td className='bg-white'>
                  <div className='mx-auto grid grid-cols-1 mt-4 mx-auto px-0 h-full'>
                    <Image
                      src='/assets/failure.png'
                      alt='hero'
                      height={32}
                      width={32}
                      layout='intrinsic'
                      objectFit='contain'
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  colSpan={3}
                  className='bg-gray-200 px-2 sm:px-6 border-t-2 border-r-2 border-gray-500'
                >
                  <h1 className='text-xl sm:text-2xl pt-1 pb-1 pl-2 sm:text-2xl font-extrabold text-mainText tracking-tight'>
                    {t('page:Hero_organization')}
                  </h1>
                </td>
              </tr>
              <tr className='border-t-2 border-gray-500'>
                <td className='bg-white px-2 sm:px-6 border-r-2 border-gray-500'>
                  <span className='font-light text-base my-2'>
                    <ul className='disc ml-0'>
                      <li className='font-normal text-xs sm:text-lg'>
                        {t('page:Hero_organization_1')}
                      </li>
                      <li className='font-normal text-xs sm:text-lg'>
                        {t('page:Hero_organization_2')}
                      </li>
                      <li className='font-normal text-xs sm:text-lg'>
                        {t('page:Hero_organization_3')}
                      </li>
                    </ul>
                    <br />
                  </span>
                </td>
                <td className='bg-white px-2 sm:px-6 border-r-2 border-gray-500'>
                  <div className='mx-auto grid grid-cols-1 mt-4 mx-auto px-0 h-full'>
                    <Image
                      src='/assets/failure.png'
                      alt='hero'
                      height={32}
                      width={32}
                      layout='intrinsic'
                      objectFit='contain'
                    />
                  </div>
                </td>
                <td className='bg-white'>
                  <div className='mx-auto grid grid-cols-1 mt-4 mx-auto h-full p-0.5'>
                    {t('page:Hero_organization_price')}
                    {t(' ')}
                    {t('page:Hero_organization_price_1')}
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  colSpan={3}
                  className='bg-gray-200 px-2 sm:px-6 border-t-2 border-r-2 border-gray-500'
                >
                  <h1 className='text-xl sm:text-2xl pt-1 pb-1 pl-2 sm:text-2xl font-extrabold text-mainText tracking-tight'>
                    {t('page:Hero_fancy_extensions')}
                  </h1>
                </td>
              </tr>
              <tr className='border-t-2 border-gray-500'>
                <td className='bg-white px-2 sm:px-6 border-r-2 border-gray-500'>
                  <span className='font-light text-base my-2'>
                    <ul className='disc ml-0'>
                      <li className='font-normal text-xs sm:text-lg'>
                        {t('page:Hero_fancy_extensions_1')}
                      </li>
                      <li className='font-normal text-xs sm:text-lg'>
                        {t('page:Hero_fancy_extensions_2')}
                      </li>
                      <li className='font-normal text-xs sm:text-lg'>
                        {t('page:Hero_fancy_extensions_3')}
                      </li>
                      <li className='font-normal text-xs sm:text-lg'>
                        {t('page:Hero_fancy_extensions_4')}
                      </li>
                    </ul>
                    <br />
                  </span>
                </td>
                <td className='bg-white px-2 sm:px-6 border-r-2 border-gray-500'>
                  <div className='mx-auto grid grid-cols-1 mt-4 mx-auto px-0 h-full'>
                    <Image
                      src='/assets/failure.png'
                      alt='hero'
                      height={32}
                      width={32}
                      layout='intrinsic'
                      objectFit='contain'
                    />
                  </div>
                </td>
                <td className='bg-white'>
                  <div className='mx-auto grid grid-cols-1 mt-4 mx-auto sm:px-6 h-full p-0.5'>
                    {t('page:Hero_fancy_extensions_price')}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ServiceCards;

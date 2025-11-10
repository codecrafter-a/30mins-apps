import {GetServerSideProps} from 'next';
import useTranslation from 'next-translate/useTranslation';
import Layout from '../components/Layout/PreLogin';

const Home = ({message}) => {
  const {t} = useTranslation('common');
  return (
    <Layout mainStype='h-full'>
      <div className='w-full min-h-full flex flex-col items-center justify-center bg-slate-200'>
        <a href='https://30mins.com/' className='mb-28'>
          <div className='ring-2 p-8 ring-offset-8 ring-mainBlue rounded-full'>
            <img alt='logo' src='/assets/logo.svg' className='w-24 h-24' />
          </div>
        </a>
        <div className='w-full h-32 flex flex-col justify-center shadow-sm hover:shadow-inner bg-white'>
          <p className='w-full text-center font-normal text-lg'>{t(message)}</p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async context => ({
  props: {
    message: context.query.message || null,
  },
});

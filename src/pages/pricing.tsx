import Layout from 'components/Layout/PreLogin';
import HeadSeo from 'components/shared/HeadSeo/Seo';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import CenteredContainer from 'components/shared/Container/CenteredContainer';
import headerImage from '../../public/assets/pricing_header.svg';

const Pricing = () => {
  const {t} = useTranslation();

  return (
    <Layout>
      <HeadSeo
        canonicalUrl={'https://30mins.com/pricing/'}
        description={t('page:pricing_description')}
        ogTwitterImage={'https://30mins.com/assets/30mins-ogimage.jpg'}
        ogType={'website'}
        title={`${t('page:Pricing')} | 30mins`}
      />
      <div className='px-8 py-12 flex flex-col gap-8'>
        <CenteredContainer className='containerCenter gap-8'>
          <div className='col-span-8 m-auto'>
            <Image
              src={headerImage}
              alt='People shaking hands after transaction'
              width={800}
              height={300}
            />
          </div>
          <h1 className='headerLg font-bold'>{t('page:pricing_header')}</h1>
          <div className='flex flex-col gap-4'>
            <p>{t('page:pricing_page_01')}</p>
            <p>{t('page:pricing_page_02')}</p>
            <p>{t('page:pricing_page_03')}</p>
          </div>
        </CenteredContainer>
      </div>
    </Layout>
  );
};

export default Pricing;

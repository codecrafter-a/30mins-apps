import Header from '@root/components/header';
import PostLoginLayout from '@root/components/layout/post-login';
import FAQ from 'components/PostLogin/FAQ/FAQ';

import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';

const FAQPage = () => {
  const {t} = useTranslation();

  const crumbs = [{title: t('page:Home'), href: '/'}];

  return (
    <PostLoginLayout>
      <Header crumbs={crumbs} heading={t('page:FAQ')} />
      <Head>
        <title>{t('page:FAQ')}</title>
      </Head>
      <FAQ />
    </PostLoginLayout>
  );
};

export default FAQPage;
FAQPage.auth = true;

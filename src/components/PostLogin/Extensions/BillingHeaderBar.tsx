import Header from '@root/components/header';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';

const BillingHeaderBar = ({getSetupIntent, showMethodForm, existingPaymentMethod}) => {
  const {t} = useTranslation();

  const crumbs = [{title: t('page:All Services'), href: '/'}];
  return (
    <div>
      <Header crumbs={crumbs} heading={t('page:Extensions_Billing')} />
      {existingPaymentMethod ? (
        <button
          onClick={getSetupIntent}
          disabled={showMethodForm}
          className='full inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mainBlue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-40'
        >
          {t('common:add_payment_method')}
        </button>
      ) : null}
    </div>
  );
};

export default BillingHeaderBar;

import Button from '@root/components/button';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import formatCurrency from 'utils/formatCurrency';

const ProductCard = ({pricingData, isActive, activateProduct, cancelSubscription, loadingData}) => {
  const {t} = useTranslation();
  const imageLink = pricingData.product.images[0] ? pricingData.product.images[0] : '';
  const {type, resourceLink} = pricingData.product.metadata;

  const recurringInterval = pricingData?.recurring?.interval
    ? `/${pricingData?.recurring?.interval}`
    : '';

  const isLoading = loadingData.productId === pricingData.product.id && loadingData.loading;
  const isDisabled = loadingData.loading && isActive;

  return (
    <div className='flex flex-col col-span-12 sm:col-span-6 lg:col-span-4 shadow-md divide-y divide-gray-200 rounded-md'>
      <div className='px-4 py-5 grid grid-cols-12 h-full w-full gap-4'>
        <div className='flex justify-center items-center col-span-4'>
          <img
            className='w-full'
            src={imageLink}
            alt={`Display Image for ${pricingData.product.name} Extension`}
          />
        </div>
        <div className='flex flex-col col-span-8 gap-1'>
          <span className='font-bold w-full break-words'>{pricingData.product.name}</span>
          <span className='text-xs break-words w-full'>{pricingData.product.description}</span>
        </div>
      </div>
      <div className='px-4 py-5 flex justify-between items-center'>
        {isActive && pricingData.type === 'recurring' ? (
          <Button
            variant='cancel'
            disabled={isDisabled}
            onClick={() => {
              cancelSubscription(pricingData);
            }}
          >
            {isLoading ? t('common:btn_canceling') : t('common:btn_cancel')}
          </Button>
        ) : isActive && pricingData.type === 'one_time' ? (
          <Button
            variant='cancel'
            disabled={isDisabled}
            onClick={() => {
              cancelSubscription(pricingData);
            }}
          >
            {isLoading ? t('common:btn_removing') : t('common:btn_remove')}
          </Button>
        ) : (
          <Button
            variant='solid'
            disabled={isDisabled || type === 'coming_soon'}
            onClick={() => {
              activateProduct(pricingData);
            }}
          >
            {type === 'coming_soon'
              ? t('common:coming_soon')
              : isLoading
              ? t('common:Activating')
              : t('common:Activate')}
          </Button>
        )}
        {resourceLink && (
          <Link href={resourceLink} passHref>
            <Button variant='solid'>{t('common:Extension_Page')}</Button>
          </Link>
        )}
        {type === 'active' && (
          <span className='font-semibold'>
            {pricingData.product.metadata?.isFree
              ? 'Free'
              : formatCurrency.format(pricingData.unit_amount / 100)}
            {recurringInterval}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

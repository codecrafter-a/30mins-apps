import {ClockIcon, PlusIcon} from '@heroicons/react/outline';
import Button from '@root/components/button';
import useTranslation from 'next-translate/useTranslation';
import {useState} from 'react';
import {LoaderIcon} from 'react-hot-toast';

export default function ActionBar({
  addOrgServicePress,
  addServicePress,
  toggleWorkingHours,
  LoadingOrg,
}) {
  const {t} = useTranslation('common');
  const [Loading, setLoading] = useState(false);

  return (
    <div className='flex mt-6 justify-between flex-wrap gap-x-6'>
      <div className='flex gap-x-3 flex-grow justify-between'>
        <Button variant='outline' onClick={() => toggleWorkingHours()}>
          <ClockIcon className='mr-2 h-5 w-5' aria-hidden='true' />
          {t('set_availability')}
        </Button>
        <Button
          variant='solid'
          onClick={() => {
            setLoading(true);
            addServicePress();
          }}
        >
          {Loading ? (
            <LoaderIcon style={{width: 18, height: 18}} className='mr-2' />
          ) : (
            <PlusIcon className='mr-2 h-5 w-5' aria-hidden='true' />
          )}
          {t('add_service')}
        </Button>
      </div>
      <Button
        className='w-full md:w-auto mt-4 md:mt-0'
        variant='solid'
        onClick={() => {
          addOrgServicePress();
        }}
      >
        {LoadingOrg ? (
          <LoaderIcon style={{width: 18, height: 18}} className='mr-2' />
        ) : (
          <PlusIcon className='mr-2 h-5 w-5' aria-hidden='true' />
        )}
        {t('add_organization_service')}
      </Button>
    </div>
  );
}

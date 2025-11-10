import {ClipboardListIcon} from '@heroicons/react/outline';
import StepHeader from '@features/services/service-form/step-header';
import {
  Props,
  TranslationTexts,
} from '@root/features/services/service-form/service-details/constants';
import useTranslation from 'next-translate/useTranslation';
import FieldTags from '@root/components/field-tags';
import GetDetailsForm from './getdetails';

export default function ServiceDetails({...rest}: Props) {
  const {t} = useTranslation();

  return (
    <>
      <StepHeader
        question={t(`common:${TranslationTexts[rest.serviceType]?.step_one_title}`)}
        description={t(`common:${TranslationTexts[rest.serviceType]?.step_one_desc}`)}
        icon={<ClipboardListIcon className='w-6 h-6' />}
        editOrgServiceLoading={rest.editOrgServiceLoading}
        editServiceLoading={rest.editServiceLoading}
        submitEditService={rest.submitEditService}
        move={rest.move}
        step={rest.step}
        mode={rest.mode}
      />

      {GetDetailsForm({...rest})}

      <div className='col-span-4 flex mt-4 w-full'>
        <FieldTags value={rest.searchTags} onChange={e => rest.setValue('searchTags', e)} />
      </div>
    </>
  );
}

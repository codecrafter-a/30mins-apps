import React, {useEffect} from 'react';
import {useFormik} from 'formik';
import Modal from '../../Modal';
import StepOne from './Steps/step-one';
import {IValues} from './feutures/constants';

export default function App({upLoadImage, defSize}) {
  const {values, setFieldValue: setValue} = useFormik<IValues>({
    initialValues: {
      imgSrc: '',
      aspect: defSize,
      upLoadImage: upLoadImage,
    },
    onSubmit: () => {},
  });
  useEffect(() => {}, [{...values}]);
  return (
    <Modal title={'Image'}>
      <StepOne values={values} setValue={setValue} />
    </Modal>
  );
}

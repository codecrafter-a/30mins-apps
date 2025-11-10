import {Formik} from 'formik';
import SwitchScreens from './screens/components/SwitchScreens';

type IProps = {
  organization: any;
};

const RoundRobin = ({organization}: IProps) => (
  <Formik initialValues={{organizationID: ''}} onSubmit={() => {}} enableReinitialize={true}>
    {({values, setFieldValue}) => (
      <div className='overflow-hidden relative w-full h-max shadow-md rounded'>
        <SwitchScreens values={values} setFieldValue={setFieldValue} organization={organization} />
      </div>
    )}
  </Formik>
);
export default RoundRobin;

import {SERVICE_TYPES} from 'constants/enums';
import JobCard from '../components/JobCard';

const FullTimeLayout = ({serviceData, user}) => (
  <JobCard user={user} serviceData={serviceData} serviceType={SERVICE_TYPES.PART_TIME_JOB} />
);

export default FullTimeLayout;

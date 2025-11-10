import React from 'react';
import {SERVICE_TYPES} from 'constants/enums';
import ProfileLayout from './InternalLayout/ProfileLayout';
import MFServiceLayout from './InternalLayout/MFServiceLayout';
import FullTimeLayout from './InternalLayout/FullTimeLayout';
import PartTimeLayout from './InternalLayout/PartTimeLayout';
import BottomLayout from './InternalLayout/BottomLayout';

const ServiceLayout = ({serviceData, user}) => {
  const renderServiceType = (serviceType: SERVICE_TYPES) => {
    switch (serviceType) {
      case SERVICE_TYPES.FULL_TIME_JOB:
        return <FullTimeLayout user={user} serviceData={serviceData} />;
      case SERVICE_TYPES.PART_TIME_JOB:
        return <PartTimeLayout user={user} serviceData={serviceData} />;
      default:
        return <MFServiceLayout user={user} serviceData={serviceData} />;
    }
  };

  return (
    <>
      <div className='w-full h-full'>
        <div className='container p-6 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between h-full'>
          <div className='bg-white h-max self-start shadow rounded w-full'>
            <div className='lg:flex'>
              <ProfileLayout user={user} />
              {renderServiceType(serviceData?.serviceType)}
            </div>
            <BottomLayout user={user} serviceData={serviceData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceLayout;

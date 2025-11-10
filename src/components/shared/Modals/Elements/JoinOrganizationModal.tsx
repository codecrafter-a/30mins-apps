import {useState} from 'react';
import {Formik, Form, getIn} from 'formik';
import axios from 'axios';
import {JOIN_ORGANIZATION_YUP, JOIN_ORGANIZATION_STATE} from 'constants/yup/organization';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import {useMutation} from '@apollo/client';
import queries from 'constants/GraphQL/Organizations/queries';
import mutations from 'constants/GraphQL/Organizations/mutations';
import {useSession} from 'next-auth/react';
import client from 'lib/apollo-client';
import {toast} from 'react-hot-toast';
import Button from '@root/components/button';
import Input from '@root/components/forms/input';
import Modal from '../Modal';

const JoinOrganizationModal = () => {
  const {data: session} = useSession();
  const [handlingJoinFor, setHandlingJoinFor] = useState(null);
  const [submittingSearch, setSubmittingSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<any>([]);
  const {store} = ModalContextProvider();
  const {modalProps} = store || {};
  const {refetch, joinedOrgIds} = modalProps;

  const [joinMutation] = useMutation(mutations.addOrganizationMember);
  const [requestJoin] = useMutation(mutations.createPendingJoinRequest);

  const {t} = useTranslation();

  async function onSubmit(values) {
    setSubmittingSearch(true);
    try {
      const response = await axios.post('/api/organizations/searchByTitle', {
        title: values.title,
      });
      const {data} = await client.query({
        query: queries.getPendingJoinRequestsByUserId,
        variables: {
          token: session?.accessToken,
        },
      });
      const pendingRequesOrgIds = data.getPendingJoinRequestsByUserId.pendingJoinRequests.map(
        d => d.organizationId
      );

      let modSearchResult = null;

      if (response.data.orgData.data.getOrganizationsByTitle.organizationData) {
        modSearchResult = response.data.orgData.data.getOrganizationsByTitle.organizationData.map(
          orgData => {
            if (pendingRequesOrgIds.includes(orgData._id)) {
              return {
                ...orgData,
                requestSent: true,
              };
            }
            return {
              ...orgData,
              requestSent: false,
            };
          }
        );
      }

      setSearchResults(modSearchResult);
      setSubmittingSearch(false);
    } catch (err) {
      setSubmittingSearch(false);
      console.log(err);
    }
  }
  const handleJoin = async orgId => {
    setHandlingJoinFor(orgId);
    const data = await joinMutation({
      variables: {
        organizationId: orgId,
        token: session?.accessToken,
      },
    });
    toast.dismiss();
    if (getIn(data, 'data.addOrganizationMember.status') === 200) {
      joinedOrgIds?.push(orgId);
      toast.success(getIn(data, 'data.addOrganizationMember.message'));
      await refetch();
      setHandlingJoinFor(null);
    } else {
      toast.error(getIn(data, 'data.addOrganizationMember.message'));
    }
    setHandlingJoinFor(null);
  };

  const handleRequestJoin = async (orgId, idx) => {
    setHandlingJoinFor(orgId);
    const response = await requestJoin({
      variables: {
        organizationId: orgId,
        token: session?.accessToken,
      },
    });
    const {data} = response;
    if (data?.createPendingJoinRequest?.status === 200) {
      searchResults[idx].requestSent = true;
      toast.success(t('common:request_has_been_send'));
      setHandlingJoinFor(null);
    } else {
      if (data?.createPendingJoinRequest?.message === 'Organization Owner Document Not Found') {
        toast.error(t('common:organization_owner_does_not_exist'));
      } else {
        toast.error(t('common:you_are_already_a_member_of_this_organization'));
      }
      setHandlingJoinFor(null);
    }
  };

  return (
    <Modal title='Join Organization' medium>
      <Formik
        initialValues={JOIN_ORGANIZATION_STATE}
        validationSchema={JOIN_ORGANIZATION_YUP}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({values, handleBlur, setFieldValue}) => (
          <Form className='py-2'>
            <div className='grid gird-flow-cols grid-cols-4 gap-4 mt-2'>
              <div className='flex flex-col col-span-4 gap-1'>
                <div className='flex'>
                  <label htmlFor='first-name' className='block text-sm font-medium text-gray-700'>
                    {t('common:organization_name')}
                  </label>
                </div>
                <div className='grid grid-cols-4 md:flex-row items-center gap-2'>
                  <Input
                    value={values.title}
                    handleChange={({target: {value}}) => {
                      setFieldValue('title', value);
                    }}
                    autoFocus
                    onBlur={handleBlur}
                    type='text'
                    id='title'
                    placeholder={t('common:search_organization')}
                    className='col-span-3'
                  />
                  <Button
                    type='submit'
                    disabled={values.title.trim() === '' || submittingSearch}
                    variant='solid'
                    className='col-span-1 w-full md:w-32 h-[100%]'
                  >
                    {submittingSearch ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </div>
            </div>
            {searchResults?.length > 0 ? (
              <div className='flex flex-col py-4'>
                {searchResults.map((org, idx) => (
                  <div
                    key={org.id}
                    className='flex flex-col py-4 px-2 border-t border-b border-solid'
                  >
                    <div className='flex gap-4 items-center'>
                      <div className='w-16 h-16 rounded-md overflow-hidden'>
                        <img
                          src={org.image || '/assets/organization.png'}
                          className='object-contain object-center w-full h-full'
                          alt='orgImage'
                        />
                      </div>
                      <div className='flex flex-row items-center flex-1 gap-2'>
                        <div className='flex flex-col w-full'>
                          <span className='break-all line-clamp-1 font-bold'>{org.title}</span>
                          <span className='text-sm break-all line-clamp-3 font-sans'>
                            {org.headline}
                          </span>
                        </div>
                        <Button
                          variant='solid'
                          type='button'
                          className='w-36'
                          onClick={async () => {
                            org.restrictionLevel === 'RESTRICTED'
                              ? await handleRequestJoin(org._id, idx)
                              : await handleJoin(org._id);
                          }}
                          disabled={
                            org.restrictionLevel === 'LOCKED' ||
                            joinedOrgIds?.includes(org._id) ||
                            org.requestSent ||
                            handlingJoinFor !== null
                          }
                        >
                          {handlingJoinFor === org._id
                            ? 'Joining...'
                            : joinedOrgIds?.includes(org._id)
                            ? 'Already Joined'
                            : org.requestSent
                            ? 'Request Sent'
                            : org.restrictionLevel === 'LOCKED'
                            ? 'Locked'
                            : org.restrictionLevel === 'RESTRICTED'
                            ? 'Request Access'
                            : 'Join'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchResults === null ? (
              <div className='text-center font-bold text-2xl pt-4'>No results found...</div>
            ) : null}
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
export default JoinOrganizationModal;

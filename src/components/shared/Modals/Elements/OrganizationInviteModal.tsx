import {useEffect, useState} from 'react';
import {Formik, Form} from 'formik';
import {PencilAltIcon} from '@heroicons/react/solid';
import {ORG_INVITE_MEMBERS} from 'constants/yup/organization';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import {useQuery, useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/Organizations/mutations';
import {useSession} from 'next-auth/react';
import queries from 'constants/GraphQL/Organizations/queries';
import Loader from 'components/shared/Loader/Loader';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {FieldError} from '@root/components/forms/error';
import Field from '@root/components/forms/field';
import Input from '@root/components/forms/input';
import Button from '@root/components/button';
import {toast} from 'react-hot-toast';
import axios from 'axios';
import Modal from '../Modal';

const ServiceCategoryModal = () => {
  const {hideModal, store} = ModalContextProvider();
  const {data: session} = useSession();
  const {modalProps} = store || {};
  const {initData} = modalProps || {};
  const [loading, setLoading] = useState(true);
  const [inviteData, setInviteData] = useState<any>([]);
  const [tempArray, setTempArray] = useState<any>([]);
  // const [showError, setError] = useState('');
  const [checkingEmial, setCheckingEmial] = useState(false);

  const membersEmail: string[] = [];

  const {data: membersResults} = useQuery(queries.getOrganizationMemberResults, {
    variables: {
      documentId: initData._id,
      searchParams: {
        keywords: '',
        pageNumber: 1,
        resultsPerPage: 10000000,
      },
    },
  });
  const userData = membersResults?.getOrganizationMemberResults?.userData;
  userData?.filter(el => membersEmail.push(el.accountDetails.email));

  useEffect(() => {
    setLoading(true);
    const getInvites = async () => {
      const {data} = await graphqlRequestHandler(
        queries.getPendingInvitesByOrgId,
        {token: session?.accessToken, organizationId: initData._id},
        session?.accessToken
      );
      setInviteData(data?.data?.getPendingInvitesByOrgId?.pendingInvites);
    };
    getInvites();
    setLoading(false);
  }, []);

  const getInviteEmails = () => {
    const emails = inviteData.map((invite: any) => invite?.inviteeUserId?.accountDetails?.email);
    return emails;
  };
  const emailList = getInviteEmails();

  const {t} = useTranslation();
  const [createPendingInvite] = useMutation(mutations.createPendingInvite);

  const onSubmit = async () => {
    try {
      setLoading(true);
      await Promise.all(
        tempArray.map(async (invite: any) => {
          await createPendingInvite({
            variables: {
              token: session?.accessToken,
              inviteeEmail: invite,
              organizationId: initData._id,
              organizationTitle: initData.title,
            },
          });
        })
      );
      toast.success(t('common:Invite Sent Successfully'));
      setLoading(false);
      toast.success('Invites sent successfully');

      hideModal();
    } catch (err) {
      toast.error(t('common:Couldn`t Sent Invite Successfully'));
      console.log(err);
    }
  };

  const handleAdd = async (values, {resetForm, setFieldError}) => {
    setCheckingEmial(true);
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const inValid = regex.exec(values);
    toast.loading(t('common:loading'));
    if (!inValid) {
      setFieldError('email', t('common:Invalid email address'));
      return;
    }
    if (emailList.includes(values) || tempArray.includes(values)) {
      setFieldError('email', t('common:This email is already added into list'));
      return;
    }
    const response = await axios.post('/api/emailVerify/handleVerifyEmail', {
      email: values,
    });
    if (response?.data?.error) {
      setFieldError('email', response.data?.error);
      return;
    }
    setFieldError('email', undefined);
    resetForm({values: ''});
    setTempArray(prevState => prevState.concat(values));
    setCheckingEmial(false);
  };

  const handleRemoveEmail = async values => {
    if (tempArray.includes(values)) {
      setTempArray(prevState => prevState.filter(email => email !== values));
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <Modal
      icon={PencilAltIcon}
      title={`${t('common:invite_members_for')} ${initData.title}`}
      medium
    >
      <div className='flex flex-wrap gap-8 items-center'>
        <div className='flex-1'>
          <Formik initialValues={ORG_INVITE_MEMBERS} onSubmit={onSubmit} enableReinitialize>
            {({values, errors, handleChange, setFieldError, resetForm}) => (
              <Form
                onKeyPress={e => {
                  e.which === 13 && e.preventDefault();
                }}
              >
                <Field
                  label={t('common:email_address')}
                  error={errors.email && <FieldError position='center' message={errors.email} />}
                >
                  <div className='w-full items-center flex flex-col gap-2 md:flex-row'>
                    <Input
                      type='email'
                      handleChange={handleChange}
                      name='email'
                      value={values.email}
                      onKeyPress={e =>
                        e.key === 'Enter'
                          ? handleAdd(values.email, {resetForm, setFieldError}).finally(() => {
                              toast.dismiss();
                              setCheckingEmial(false);
                            })
                          : null
                      }
                      className='lg:w-3/6 w-full shadow-sm focus:ring-mainBlue focus:border-mainBlue block  sm:text-sm border-gray-300 rounded-md'
                      placeholder='Enter an email'
                    />
                    <Button
                      type='submit'
                      disabled={tempArray?.length === 0 || checkingEmial}
                      variant='solid'
                      className='w-full md:w-max'
                    >
                      {loading ? t('common:txt_loading1') : t('common:send_invites')}
                    </Button>
                    <Button
                      variant='outline'
                      type='button'
                      className='w-full  md:w-max'
                      disabled={checkingEmial}
                      onClick={() => {
                        membersEmail.includes(values.email)
                          ? setFieldError('email', 'Member already exists')
                          : handleAdd(values.email, {resetForm, setFieldError}).finally(() => {
                              toast.dismiss();
                              setCheckingEmial(false);
                            });
                      }}
                    >
                      + {t('common:add_to_the_list')}
                    </Button>
                  </div>
                </Field>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className='flex flex-col pt-4 flex-1'>
        {!loading ? (
          <>
            <div className='max-h-64 overflow-y-auto '>
              {tempArray &&
                tempArray.map((email, index) => (
                  <div
                    key={index}
                    title={email}
                    className='border-t border-b border-solid pl-4 relative py-4 w-full h-min flex justify-between gap-2'
                  >
                    <span className='w-full break-all line-clamp-1 '>{email}</span>
                    <button className='text-red-600' onClick={() => handleRemoveEmail(email)}>
                      {t('common:remove')}
                    </button>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <span className='text-center text-xl pb-4'>{t('common:txt_loading1')}</span>
        )}
      </div>
    </Modal>
  );
};
export default ServiceCategoryModal;

import React, {useCallback, useMemo, useRef, useState} from 'react';
import useTranslation from 'next-translate/useTranslation';
import {useSession} from 'next-auth/react';
import {Column} from 'react-table';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import graphqlRequestHandler from '../../../utils/graphqlRequestHandler';
import userQueries from '../../../constants/GraphQL/User/queries';
import Table from '../AllExtentions/Table';
import userMutations from '../../../constants/GraphQL/User/mutations';
import {ModalContextProvider} from '../../../store/Modal/Modal.context';

dayjs.extend(relativeTime);

enum TableTabs {
  ORGANIZATIONS = 'ORGANIZATIONS',
  USERS = 'USERS',
}

const AffiliateDashboard = () => {
  const {t} = useTranslation();
  const {data: session} = useSession();
  const {showModal, hideModal} = ModalContextProvider();
  const router = useRouter();

  const queryIdRef = useRef(0);
  const [tableData, setTableData] = useState([]);
  const [searchFilter, setSearchFilter] = useState({keywords: '', newSearch: false});
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoresults] = useState(false);
  const [pageCount, setPageCount] = useState(0);

  const queryMarketerResults = useCallback(
    async (searchParams, pageNumber, pageSize) => {
      const queryId = ++queryIdRef.current;

      delete searchParams.newSearch;

      try {
        if (queryId === queryIdRef.current) {
          setIsLoading(true);

          const {data: results} = await graphqlRequestHandler(
            userQueries.getResultsForMarketer,
            {
              searchParams: {
                ...searchParams,
                pageNumber,
                resultsPerPage: pageSize,
                searchType: TableTabs.USERS,
              },
              token: session?.accessToken,
            },
            session?.accessToken
          );

          if (results?.data?.getResultsForMarketer?.response?.status !== 200) {
            setNoresults(true);
            setIsLoading(false);
          } else {
            setNoresults(false);
            setIsLoading(false);
            const returnDataCount = results?.data?.getResultsForMarketer?.returnDataCount || 0;
            setTableData(results?.data?.getResultsForMarketer?.returnUserData);
            setPageCount(Math.ceil(returnDataCount / pageSize));
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [session?.accessToken, TableTabs.USERS]
  );

  const [deleteUserMutation] = useMutation(userMutations.marketerDeleteUser);
  const handleDeleteUser = async userEmail => {
    try {
      await deleteUserMutation({
        variables: {
          userEmail: userEmail,
        },
        context: {
          headers: {
            Authorization: session?.accessToken,
          },
        },
      });
      router.reload();
    } catch (err) {
      console.log('Unknown Error');
      hideModal();
    }
  };

  const WelcomeComplete = ({value}) => <div>{value ? 'yes' : 'no'}</div>;
  const JoinLink = ({value}) => (
    <a
      target={'_blank'}
      href={`${process.env.NEXT_PUBLIC_FRONT_END_URL}/join?code=${value}`}
      rel='noreferrer'
    >{`${process.env.NEXT_PUBLIC_FRONT_END_URL}/join?code=${value}`}</a>
  );
  const ProfileLink = ({value}) => (
    <a
      target={'_blank'}
      href={`${process.env.NEXT_PUBLIC_FRONT_END_URL}/${value}`}
      rel='noreferrer'
    >{`${process.env.NEXT_PUBLIC_FRONT_END_URL}/${value}`}</a>
  );

  const CreatedAt = ({value}) => <div>{dayjs((value / 1000) * 1000).fromNow()}</div>;

  const UserDeleteAction = ({data, row}) =>
    data[row.index].welcomeComplete ? null : (
      <button
        onClick={async () => {
          showModal('CONFIRM', {
            handleConfirm: async () => {
              await handleDeleteUser(data[row.index].accountDetails.email);
            },
            title: t('common:delete_confirm'),
          });
        }}
      >
        {t('common:Delete_record')}
      </button>
    );

  const UserColumns = useMemo(
    () =>
      [
        {
          Header: t('common:createdBy'),
          accessor: 'createdBy.accountDetails.username',
        },
        {
          Header: t('common:email_header'),
          accessor: 'accountDetails.email',
        },
        {
          Header: t('common:joinLink'),
          accessor: 'couponCode',
          Cell: JoinLink,
        },
        {
          Header: t('common:profile_link'),
          accessor: 'accountDetails.username',
          Cell: ProfileLink,
        },
        {
          Header: t('common:welcomeComplete'),
          accessor: 'welcomeComplete',
          Cell: WelcomeComplete,
        },
        {
          Header: t('common:createdAt'),
          accessor: 'createdAt',
          Cell: CreatedAt,
        },
        {
          Header: t('common:Delete_record'),
          accessor: '',
          Cell: UserDeleteAction,
        },
      ] as Column<{Header: string; accessor: string}>[],
    [t]
  );

  return (
    <div className='min-h-screen text-gray-900'>
      <main className='max-w-7xl mx-auto px-0 pt-4'>
        <div className='mt-6'>
          <div className='grid grid-cols-1 mt-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'>
            <div className='grid col-span-1 mr-4 mb-2 p-4 rounded-lg bg-white border border-gray-100'>
              <div className='flex flex-col'>
                <div className='text-xs font-bold text-mainBlue uppercase'>
                  {t('page:Affiliate_Revenue')}
                </div>
                <div className='grid grid-cols-3'>
                  <div className='col-span-1 flex flex-col'>
                    <div className='text-xs mt-4 font-bold'>$135000.00</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Revenue_Total')}
                    </div>
                  </div>
                  <div className='col-span-1 flex flex-col justified-center items-center'>
                    <div className='text-xs mt-4 font-bold'>$135000.00</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Revenue_Monthly_Recurring')}
                    </div>
                  </div>
                  <div className='col-span-1 flex flex-col justified-center items-center'>
                    <div className='text-xs mt-4 font-bold'>$135000.00</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Revenue_Annual_Recurring')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='grid col-span-1 mr-4 mb-2 p-4 rounded-lg bg-white border border-gray-100'>
              <div className='flex flex-col'>
                <div className='text-xs font-bold text-mainBlue uppercase'>
                  {t('page:Affiliate_Team_Commission')}
                </div>
                <div className='grid grid-cols-3'>
                  <div className='col-span-1 flex flex-col'>
                    <div className='text-xs mt-4 font-bold'>$135000.00</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Revenue_Total')}
                    </div>
                  </div>
                  <div className='col-span-1 flex flex-col justified-center items-center'>
                    <div className='text-xs mt-4 font-bold'>$135000.00</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Revenue_Monthly_Recurring')}
                    </div>
                  </div>
                  <div className='col-span-1 flex flex-col justified-center items-center'>
                    <div className='text-xs mt-4 font-bold'>$135000.00</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Revenue_Annual_Recurring')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='grid col-span-1 mr-4 mb-2 p-4 rounded-lg bg-white border border-gray-100'>
              <div className='flex flex-col'>
                <div className='text-xs font-bold text-mainBlue uppercase'>
                  {t('page:Affiliate_Commission')}
                </div>
                <div className='grid grid-cols-3'>
                  <div className='col-span-1 flex flex-col'>
                    <div className='text-xs mt-4 font-bold'>$135000.00</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Revenue_Total')}
                    </div>
                  </div>
                  <div className='col-span-1 flex flex-col justified-center items-center'>
                    <div className='text-xs mt-4 font-bold'>$135000.00</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Revenue_Monthly_Recurring')}
                    </div>
                  </div>
                  <div className='col-span-1 flex flex-col justified-center items-center'>
                    <div className='text-xs mt-4 font-bold'>$135000.00</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Revenue_Annual_Recurring')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='grid col-span-1 mr-4 mb-2 p-4 rounded-lg bg-white border border-gray-100'>
              <div className='flex flex-col'>
                <div className='text-xs font-bold text-mainBlue uppercase'>
                  {t('page:Affiliate_Total_Organizations_Signed_up')}
                </div>
                <div className='grid grid-cols-3'>
                  <div className='col-span-1 flex flex-col'>
                    <div className='text-xs mt-4 font-bold'>41</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Revenue_Total')}
                    </div>
                  </div>
                  <div className='col-span-1 flex flex-col justified-center items-center'>
                    <div className='text-xs mt-4 font-bold'>32</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Revenue_Monthly_Recurring')}
                    </div>
                  </div>
                  <div className='col-span-1 flex flex-col justified-center items-center'>
                    <div className='text-xs mt-4 font-bold'>2</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Revenue_Annual_Recurring')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='grid col-span-1 mr-4 mb-2 p-4 rounded-lg bg-white border border-gray-100'>
              <div className='flex flex-col'>
                <div className='text-xs font-bold text-mainBlue uppercase'>
                  {t('page:Affiliate_Team_Organizations_Signed_up')}
                </div>
                <div className='grid grid-cols-3'>
                  <div className='col-span-1 flex flex-col'>
                    <div className='text-xs mt-4 font-bold'>41</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Revenue_Total')}
                    </div>
                  </div>
                  <div className='col-span-1 flex flex-col justified-center items-center'>
                    <div className='text-xs mt-4 font-bold'>32</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Revenue_Monthly_Recurring')}
                    </div>
                  </div>
                  <div className='col-span-1 flex flex-col items-center justified-center'>
                    <div className='text-xs mt-4 font-bold'>2</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Revenue_Annual_Recurring')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='grid col-span-1 mr-4 mb-2 p-4 rounded-lg bg-white border border-gray-100'>
              <div className='flex flex-col'>
                <div className='text-xs font-bold text-mainBlue uppercase'>
                  {t('page:Affiliate_Organizations_Signed_up')}
                </div>
                <div className='grid grid-cols-3'>
                  <div className='col-span-1 flex flex-col'>
                    <div className='text-xs mt-4 font-bold'>41</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Revenue_Total')}
                    </div>
                  </div>
                  <div className='col-span-1 flex flex-col items-center justified-center'>
                    <div className='text-xs mt-4 font-bold'>32</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Revenue_Monthly_Recurring')}
                    </div>
                  </div>
                  <div className='col-span-1 flex flex-col items-center justified-center'>
                    <div className='text-xs mt-4 font-bold'>2</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Revenue_Annual_Recurring')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='grid col-span-1 mr-4 mb-2 p-4 rounded-lg bg-white border border-gray-100'>
              <div className='flex flex-col'>
                <div className='text-xs font-bold text-mainBlue uppercase'>
                  {t('page:Affiliate_Total_Users')}
                </div>
                <div className='grid grid-cols-3'>
                  <div className='col-span-1 flex flex-col'>
                    <div className='text-xs mt-4 font-bold'>32</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Users_Signed_Up')}
                    </div>
                  </div>
                  <div className='col-span-1 flex flex-col'></div>
                  <div className='col-span-1 flex flex-col items-center justified-center'>
                    <div className='text-xs mt-4 font-bold'>2</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Users_Welcome_Complete')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='grid col-span-1 mr-4 mb-2 p-4 rounded-lg bg-white border border-gray-100'>
              <div className='flex flex-col'>
                <div className='text-xs font-bold text-mainBlue uppercase'>
                  {t('page:Affiliate_Team_Users')}
                </div>
                <div className='grid grid-cols-3'>
                  <div className='col-span-1 flex flex-col'>
                    <div className='text-xs mt-4 font-bold'>32</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Users_Signed_Up')}
                    </div>
                  </div>
                  <div className='col-span-1 flex flex-col'></div>
                  <div className='col-span-1 flex flex-col items-center justified-center'>
                    <div className='text-xs mt-4 font-bold'>2</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Users_Welcome_Complete')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='grid col-span-1 mr-4 mb-2 p-4 rounded-lg bg-white border border-gray-100'>
              <div className='flex flex-col'>
                <div className='text-xs font-bold text-mainBlue uppercase'>
                  {t('page:Affiliate_Users')}
                </div>
                <div className='grid grid-cols-3'>
                  <div className='col-span-1 flex flex-col'>
                    <div className='text-xs mt-4 font-bold'>32</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Users_Signed_Up')}
                    </div>
                  </div>
                  <div className='col-span-1 flex flex-col'></div>
                  <div className='col-span-1 flex flex-col items-center justified-center'>
                    <div className='text-xs mt-4 font-bold'>2</div>
                    <div className='text-[0.5em] text-gray-500 font-base'>
                      {t('page:Affiliate_Users_Welcome_Complete')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div>
        <Table
          data={tableData}
          columns={UserColumns}
          isLoading={isLoading}
          noResults={noResults}
          query={queryMarketerResults}
          pageCount={pageCount}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
        />
      </div>
    </div>
  );
};

export default AffiliateDashboard;

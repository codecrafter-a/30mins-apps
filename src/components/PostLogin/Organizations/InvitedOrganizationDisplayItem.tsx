import useTranslation from 'next-translate/useTranslation';
import {useSession} from 'next-auth/react';
import {useMutation} from '@apollo/client';
import mutations from 'constants/GraphQL/Organizations/mutations';
import Link from 'next/link';
import {NotificationContext} from 'store/Notification/Notification.context';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import {useContext} from 'react';
import sanitizeHtml from 'sanitize-html';
import Button from '@root/components/button';

const InvitedOrganizationDisplayItem = ({pendingInvites, onEvent}) => {
  const {t} = useTranslation();
  const {data: session} = useSession();

  const {
    actions: {showNotification},
  } = useContext(NotificationContext);
  const orgID = pendingInvites?.organizationId?._id;

  const [acceptMutation] = useMutation(mutations.acceptPendingInvite);
  const [rejectMutation] = useMutation(mutations.declinePendingInvite);

  const acceptInvite = async () => {
    try {
      await acceptMutation({
        variables: {
          token: session?.accessToken,
          organizationId: orgID,
          pendingInviteId: pendingInvites?._id,
        },
      });
      onEvent();
      showNotification(NOTIFICATION_TYPES.info, 'Invite Accepted Successfully', false);
    } catch (err) {
      showNotification(NOTIFICATION_TYPES.error, "Couldn't Accept Invite", false);
      console.log(err);
    }
  };

  const rejectInvite = async () => {
    try {
      await rejectMutation({
        variables: {
          token: session?.accessToken,
          organizationId: orgID,
          pendingInviteId: pendingInvites?._id,
        },
      });
      onEvent();
      showNotification(NOTIFICATION_TYPES.error, 'Invite Rejected Successfully', false);
    } catch (err) {
      showNotification(NOTIFICATION_TYPES.error, "Couldn't Invite Rejected Successfully", false);
      console.log(err);
    }
  };
  return (
    <div className='flex flex-col py-4 px-4 border-b-2 border-solid gap-4'>
      <div className='flex gap-4 sm:gap-6 flex-wrap'>
        <div className='w-36 h-36 rounded-md overflow-hidden'>
          <img
            className='w-full h-full object-contain object-center'
            src={
              pendingInvites?.organizationId?.image ||
              'https://files.stripe.com/links/MDB8YWNjdF8xSXExT2dKV2FIT3E3dTdkfGZsX3Rlc3RfMW15OUp4UHNvb29Lem9BVXFrdjBId0JT00jAdxbWe4'
            }
            alt='OrganizationImage'
          />
        </div>
        <div className='flex-1 flex flex-col w-full overflow-hidden break-words'>
          <h3 className='text-sm sm:text-xl font-bold text-gray-900 '>
            {t('common:you_were_invited_to_org')} {pendingInvites?.organizationId?.title}
          </h3>
          <h4 className='sm:text-lg text-gray-500 leading-5'>
            {pendingInvites?.organizationId?.headline}
          </h4>
          <p className='hidden font-light sm:line-clamp-3 leading-5 mt-2 '>
            {pendingInvites?.organizationId?.description && (
              <div className='sm:col-span-2'>
                <dd
                  className='mt-1 custom'
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(pendingInvites?.organizationId?.description),
                  }}
                ></dd>
              </div>
            )}
          </p>

          <br></br>
          <Link href={`/org/${pendingInvites?.organizationId?.title}`}>
            <a target={'_blank'} className='text-sm'>
              {t('event:view_public_page')}
            </a>
          </Link>
        </div>
      </div>
      <div className='w-full flex flex-col sm:flex-row justify-end gap-2 flex-wrap'>
        <Button variant='outline' onClick={rejectInvite}>
          {t('common:btn_ignore')}
        </Button>
        <Button variant='solid' onClick={acceptInvite}>
          {t('common:btn_accept')}
        </Button>
      </div>
    </div>
  );
};
export default InvitedOrganizationDisplayItem;

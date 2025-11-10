import dayjs from 'dayjs';
import {GetServerSideProps} from 'next';
import {useSession} from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import queries from 'constants/GraphQL/Booking/queries';
import userQuery from 'constants/GraphQL/User/queries';
import ProtectedRoute from 'components/PostLogin/Dashboard/ProtectedRoute';
import Loader from 'components/shared/Loader/Loader';
import PostLoginLayout from '@root/components/layout/post-login';
import {unstable_getServerSession} from 'next-auth';
import {authOptions} from 'pages/api/auth/[...nextauth]';
import {ORDER, SERVICE_TYPES} from 'constants/enums';
import {useContext, useState} from 'react';
import {NotificationContext} from 'store/Notification/Notification.context';
import Header from 'components/PostLogin/OrderDetails/Header';
import Table from 'components/PostLogin/OrderDetails/Table';
import ManagementButtons from 'components/PostLogin/OrderDetails/ManagementButtons';
import {cancelOrder, completeOrder, confirmOrder} from 'utils/orderManagement';
import {NOTIFICATION_TYPES} from 'constants/context/notification';
import ButtonFormWrapper from 'components/PostLogin/OrderDetails/ButtonFormWrapper';

dayjs.extend(utc);
dayjs.extend(timezone);

interface OrderStatus {
  providerDeclined: boolean;
  refunded: boolean;
  refundRequested: boolean;
  clientCanceled: boolean;
  conferenceType: boolean;
  providerCanceled: boolean;
  hasOpenReport: boolean;
  clientConfirmed: boolean;
  providerConfirmed: boolean;
}

interface OrderDetailsType {
  _id: string;
  title: string;
  bookerName: string;
  providerName: string;
  provider: string;
  booker: string;
  subject: string;
  status: OrderStatus;
  price: number;
  conferenceType: string;
  meetingDate: string;
  dateBooked: string;
  startTime: string;
  endTime: string;
  serviceType: string;
}

const OrderDetails = ({order, documentId, token, user, serviceExists}) => {
  const {status} = useSession();
  const [reasonConfirm, setReasonConfirm] = useState<string>('');
  const [reasonComplete, setReasonComplete] = useState<string>('');
  const [reasonCancel, setReasonCancel] = useState<string>('');
  const [showConfirmForm, setShowConfirmForm] = useState<boolean>(false);
  const [showCompleteForm, setShowCompleteForm] = useState<boolean>(false);
  const [showCancelForm, setShowCancelForm] = useState<boolean>(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetailsType>(order);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(order.status);

  const [loading, setLoading] = useState(false);

  const User = user?.data?.getUserById?.userData;
  const {
    actions: {showNotification},
  } = useContext(NotificationContext);
  const {t} = useTranslation();

  const getOrderDetails = async () => {
    const {data: orderData} = await graphqlRequestHandler(
      queries.getBookingById,
      {
        documentId,
        token,
      },
      process.env.BACKEND_API_KEY
    );
    setOrderDetails(orderData?.data?.getBookingById?.bookingData);
    setOrderStatus(orderData?.data?.getBookingById?.bookingData.status);
    setShowConfirmForm(false);
    setShowCompleteForm(false);
    setShowCancelForm(false);
    setReasonComplete('');
    setReasonConfirm('');
    setReasonCancel('');
  };

  const onCancel = () => {
    setShowConfirmForm(false);
    setShowCompleteForm(false);
    setShowCancelForm(false);
  };

  const cancelOrderHandler = async () => {
    setLoading(true);
    const response = await cancelOrder(orderDetails, reasonCancel);
    setLoading(false);
    switch (response) {
      case ORDER.ORDER_CANCELLED:
        await getOrderDetails();

        return showNotification(NOTIFICATION_TYPES.success, t('meeting:ORDER_CANCELLED'), false);
      case ORDER.ORDER_NOT_CANCELLED:
        return showNotification(NOTIFICATION_TYPES.error, t('meeting:ORDER_NOT_CANCELLED'), false);
      default:
        return showNotification(NOTIFICATION_TYPES.error, t('meeting:ERROR'), false);
    }
  };

  const confirmOrderHandler = async () => {
    setLoading(true);
    const response = await confirmOrder(orderDetails, reasonConfirm);
    setLoading(false);
    switch (response) {
      case ORDER.ORDER_CONFIRMED:
        await getOrderDetails();
        return showNotification(NOTIFICATION_TYPES.success, t('meeting:ORDER_CONFIRMED'), false);
      case ORDER.ORDER_NOT_CONFIRMED:
        return showNotification(NOTIFICATION_TYPES.error, t('meeting:ORDER_NOT_CONFIRMED'), false);
      default:
        return showNotification(NOTIFICATION_TYPES.error, t('meeting:ERROR'), false);
    }
  };

  const completeOrderHandler = async () => {
    setLoading(true);
    const response = await completeOrder(orderDetails, reasonComplete);
    setLoading(false);
    switch (response) {
      case ORDER.ORDER_COMPLETED:
        await getOrderDetails();
        return showNotification(NOTIFICATION_TYPES.success, t('meeting:ORDER_COMPLETED'), false);
      case ORDER.ORDER_NOT_COMPLETED:
        return showNotification(NOTIFICATION_TYPES.error, t('meeting:ORDER_NOT_COMPLETED'), false);
      default:
        return showNotification(NOTIFICATION_TYPES.error, t('meeting:ERROR'), false);
    }
  };
  const isSeller = () => User._id === orderDetails?.provider;
  const isBuyer = () => User._id === orderDetails?.booker;
  const locationDetails = user?.data?.getUserById?.userData?.locationDetails;
  const dueDateUTC = () => dayjs(orderDetails?.endTime);
  const bookedTimeUTC = () => dayjs(orderDetails?.dateBooked);
  const isOneHourPassedSinceBooking = dayjs().isAfter(bookedTimeUTC().add(1, 'hour'));
  const isDueDatePassed = dayjs().isAfter(dueDateUTC());

  const showCompleteButton = () =>
    dayjs().isAfter(dueDateUTC()) &&
    isSeller() &&
    !orderStatus?.providerConfirmed &&
    !orderStatus?.providerCanceled;

  const showConfirmButton = () =>
    isBuyer() &&
    dayjs().isAfter(dueDateUTC()) &&
    !orderStatus.clientConfirmed &&
    !orderStatus.clientCanceled &&
    !orderStatus.hasOpenReport &&
    !orderStatus.refundRequested;

  const showRefundButton = () =>
    isBuyer() &&
    dayjs().isAfter(dueDateUTC()) &&
    !(orderDetails.price > 0) &&
    !orderStatus.clientConfirmed &&
    !orderStatus.clientCanceled &&
    !orderStatus.refundRequested &&
    !orderStatus.hasOpenReport;

  const showCancelButton = () =>
    isBuyer() &&
    (isDueDatePassed || !isOneHourPassedSinceBooking) &&
    !orderStatus.clientConfirmed &&
    !orderStatus.clientCanceled &&
    !orderStatus.refundRequested &&
    !orderStatus.hasOpenReport;

  const showButtonBar = () =>
    showCompleteButton() || showConfirmButton() || showCancelButton() || showRefundButton();

  if (status === 'loading') {
    return <Loader />;
  }
  return (
    <ProtectedRoute status={status}>
      <PostLoginLayout>
        <Header title={orderDetails?.title} />
        <ManagementButtons
          showButtonBar={showButtonBar}
          showCancelButton={showCancelButton}
          showConfirmButton={showConfirmButton}
          showRefundButton={showRefundButton}
          showCompleteButton={showCompleteButton}
          showCancelForm={showCancelForm}
          showCompleteForm={showCompleteForm}
          showConfirmForm={showConfirmForm}
          setShowConfirmForm={setShowConfirmForm}
          setShowCompleteForm={setShowCompleteForm}
          setShowCancelForm={setShowCancelForm}
          orderDetails={orderDetails}
          serviceExists={serviceExists}
        />
        {orderDetails && (
          <Table
            orderDetails={orderDetails}
            locationDetails={locationDetails}
            dueDate={dueDateUTC}
          />
        )}
        <ButtonFormWrapper
          showCompleteForm={showCompleteForm}
          showCancelForm={showCancelForm}
          showConfirmForm={showConfirmForm}
          loading={loading}
          onCancel={onCancel}
          orderDetails={orderDetails}
          cancelOrderHandler={cancelOrderHandler}
          completeOrderHandler={completeOrderHandler}
          confirmOrderHandler={confirmOrderHandler}
          reasonCancel={reasonCancel}
          setReasonCancel={setReasonCancel}
          reasonComplete={reasonComplete}
          setReasonComplete={setReasonComplete}
          reasonConfirm={reasonConfirm}
          setReasonConfirm={setReasonConfirm}
        />
      </PostLoginLayout>
    </ProtectedRoute>
  );
};
export default OrderDetails;
OrderDetails.auth = true;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);
  const router = context.resolvedUrl;

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?url=${router}`,
        permanent: false,
      },
    };
  }
  const {data: order} = await graphqlRequestHandler(
    queries.getBookingById,
    {
      documentId: context.query.orderDetails,
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  const serviceID = order?.data?.getBookingById?.bookingData?.serviceID;
  const providerName = order?.data?.getBookingById?.bookingData?.providerName;

  if (
    order?.data?.getBookingById?.bookingData?.serviceType !== SERVICE_TYPES.FREELANCING_WORK ||
    order?.data?.getBookingById?.bookingData === null
  ) {
    return {
      redirect: {destination: '/user/orders', permanent: false},
    };
  }
  const {data: user} = await graphqlRequestHandler(
    userQuery.getUserById,
    {
      token: session?.accessToken,
    },
    process.env.BACKEND_API_KEY
  );

  const {data: publicUserData} = await graphqlRequestHandler(
    userQuery.getPublicUserData,
    {
      username: providerName,
    },
    process.env.BACKEND_API_KEY
  );
  const userData = publicUserData?.data?.getPublicUserData?.userData;
  const userServices = userData?.services;
  const serviceFilter = userServices?.filter(service => service._id === serviceID);
  const serviceExists = () => (serviceFilter?.length === 0 ? false : true);

  return {
    props: {
      documentId: context.query.orderDetails,
      token: session?.accessToken,
      user,
      order: order?.data?.getBookingById?.bookingData,
      serviceExists: serviceExists(),
    },
  };
};

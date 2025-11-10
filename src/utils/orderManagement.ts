import {NOTIFICATION_TYPES} from 'constants/context/notification';
import {ORDER} from 'constants/enums';
import axios from 'axios';

export const confirmOrder = async (data, reason) => {
  try {
    const res = await axios.post('/api/meetings/confirm', {
      meetingDetails: data,
      feedback: reason,
    });
    if (res?.data?.success) {
      return ORDER.ORDER_CONFIRMED;
    }
    return ORDER.ORDER_NOT_CONFIRMED;
  } catch {
    return ORDER.ORDER_NOT_COMPLETED;
  }
};

export const completeOrder = async (data, reason) => {
  try {
    const res = await axios.post('/api/meetings/complete', {
      meetingDetails: data,
      feedback: reason,
    });
    if (res?.data?.success) {
      return ORDER.ORDER_COMPLETED;
    }
    return ORDER.ORDER_NOT_COMPLETED;
  } catch {
    return ORDER.ORDER_NOT_COMPLETED;
  }
};
export const cancelOrder = async (data, reason) => {
  try {
    await axios.post('/api/meetings/cancel', {
      meetingDetails: data,
      reason: reason,
    });

    return ORDER.ORDER_CANCELLED;
  } catch {
    return ORDER.ORDER_NOT_CANCELLED;
  }
};

export const declineOrder = async (meetingData, values, reason, setLoading, showNotification) => {
  if (reason === '') {
    showNotification(NOTIFICATION_TYPES.success, 'Please provide reason', false);
    return;
  }
  setLoading(true);
  await axios.post('/api/meetings/decline', {
    meetingDetails: meetingData,
    reason: values,
  });
};

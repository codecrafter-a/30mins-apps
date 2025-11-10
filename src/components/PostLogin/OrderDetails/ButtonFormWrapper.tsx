import BottomForm from './BottomForm';

const ButtonFormWrapper = ({
  showCancelForm,
  showCompleteForm,
  showConfirmForm,
  loading,
  onCancel,
  orderDetails,
  cancelOrderHandler,
  completeOrderHandler,
  confirmOrderHandler,
  reasonCancel,
  setReasonCancel,
  reasonComplete,
  setReasonComplete,
  reasonConfirm,
  setReasonConfirm,
}) => (
  <>
    {showCancelForm && (
      <BottomForm
        loading={loading}
        reason={reasonCancel}
        setReason={setReasonCancel}
        onCancelHandler={onCancel}
        meetingDetails={orderDetails}
        txtMessage='cancel_msg_order'
        txtButton='cancel_btn_order'
        ManagementHandler={cancelOrderHandler}
      />
    )}
    {showCompleteForm && (
      <BottomForm
        loading={loading}
        reason={reasonComplete}
        setReason={setReasonComplete}
        onCancelHandler={onCancel}
        meetingDetails={orderDetails}
        txtMessage='completion_msg_order'
        txtButton='completion_btn_order'
        ManagementHandler={completeOrderHandler}
      />
    )}
    {showConfirmForm && (
      <BottomForm
        loading={loading}
        reason={reasonConfirm}
        setReason={setReasonConfirm}
        onCancelHandler={onCancel}
        meetingDetails={orderDetails}
        txtMessage='confirmation_msg_order'
        txtButton='confirmation_btn_order'
        ManagementHandler={confirmOrderHandler}
      />
    )}
  </>
);

export default ButtonFormWrapper;

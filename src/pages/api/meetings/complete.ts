import type {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/react';
import sendEmail from 'utils/sendEmailHandler';
import TEMPLATES from 'constants/emailTemplateIDs';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import bookingMutations from 'constants/GraphQL/Booking/mutations';
import bookingQueries from 'constants/GraphQL/Booking/queries';
import {SERVICE_TYPES} from '../../../constants/enums';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({req: req});
    if (!session) {
      return res.status(401).json({success: false, message: 'Not authenticated'});
    }
    if (req.method !== 'POST') {
      return res.status(400).json({
        success: false,
        message: 'This endpoint only accepts POST requests!',
      });
    }

    const {meetingDetails, notes} = req.body;

    const queryRes = await graphqlRequestHandler(
      bookingMutations.updateBookingStatus,
      {
        statusUpdateData: {
          bookingId: meetingDetails._id,
          providerConfirmed: true,
          postMeetingNotes: notes,
        },
      },
      session?.accessToken
    );

    if (queryRes.data.data.updateBookingStatus.status === 200) {
      if (
        meetingDetails.serviceType === SERVICE_TYPES.MEETING ||
        meetingDetails.serviceType === SERVICE_TYPES.ROUND_ROBIN
      ) {
        const {data: postStatusAuthCodeResult} = await graphqlRequestHandler(
          bookingQueries.getStatusAuthCode,
          {
            email: meetingDetails.bookerEmail,
            bookingId: meetingDetails._id,
          },
          process.env.BACKEND_API_KEY
        );

        await sendEmail(
          {
            clientName: meetingDetails.bookerName,
            bookingId: meetingDetails._id,
            providerName: meetingDetails.providerName || 'Account Deleted',
            postMeetingNotes: notes,
            isPaid: meetingDetails.price > 0,
            paymentType: meetingDetails.paymentType,
            authCode: postStatusAuthCodeResult.data.getStatusAuthCode.statusAuthCode.authCode,
          },
          meetingDetails.bookerEmail,
          process.env.EMAIL_FROM!,
          TEMPLATES.POST_BOOKING.PROVIDER_COMPLETED_MEETING
        );
      }

      if (meetingDetails.serviceType === SERVICE_TYPES.FREELANCING_WORK) {
        await sendEmail(
          {
            clientName: meetingDetails.bookerName,
            bookingId: meetingDetails._id,
            providerName: meetingDetails.providerName || 'Account Deleted',

            postMeetingNotes: notes,
          },
          meetingDetails.bookerEmail,
          process.env.EMAIL_FROM!,
          TEMPLATES.POST_BOOKING.FREELANCE_PROVIDER_COMPLETE_TO_CLIENT
        );
      }
      return res.status(200).json({success: true, message: 'Meeting has been completed'});
    }
    return res.status(400).json({success: false, message: 'Meeting has not canceled'});
  } catch (error) {
    return res.status(400).json({message: error});
  }
};

export default handler;

import bookingMutations from 'constants/GraphQL/Booking/mutations';
import type {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import sendReschduleEmails from 'utils/rescheduleEmailHandler';
import graphqlRequestHandler from 'utils/graphqlRequestHandler';
import {clientStatusCodes, providerStatusCodes} from 'constants/statusCodes';

dayjs.extend(utc);
dayjs.extend(timezone);

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

    const providerRes = await graphqlRequestHandler(
      bookingMutations.addStatusAuthCode,
      {
        input: {
          availableStatus: providerStatusCodes,
          bookingId: req.body._id,
          email: req.body.providerEmail,
          expireAt: req.body.endTime,
        },
      },
      process.env.BACKEND_API_KEY
    );
    const clientRes = await graphqlRequestHandler(
      bookingMutations.addStatusAuthCode,
      {
        input: {
          availableStatus: clientStatusCodes,
          bookingId: req.body._id,
          email: req.body.bookerEmail,
          expireAt: req.body.endTime,
        },
      },
      process.env.BACKEND_API_KEY
    );

    await sendReschduleEmails(
      req,
      req.body.providerTimeZone,
      req.body._id,
      providerRes.data.data.addStatusAuthCode.authCode,
      clientRes.data.data.addStatusAuthCode.authCode
    );
    return res.status(200).json({success: true, message: 'Meeting has been completed'});
  } catch (error) {
    return res.status(400).json({message: error});
  }
};

export default handler;

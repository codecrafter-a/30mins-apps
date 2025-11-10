/* eslint-disable @typescript-eslint/dot-notation */
import {NextApiRequest, NextApiResponse} from 'next';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SERVER_ID_TEST!, {
  apiVersion: '2020-08-27',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const {price, email} = req.body;

  try {
    const paymentIntent: Stripe.Response<Stripe.PaymentIntent> = await stripe.paymentIntents.create(
      {
        amount: price * 100,
        receipt_email: email,
        currency: 'usd',
        automatic_payment_methods: {enabled: true},
      }
    );

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({statusCode: 500, message: 'Unknown Error'});
  }
}

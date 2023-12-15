import mongoose from 'mongoose';
import { createCheckoutSession } from "../services/stripe.js";

const { Schema, model } = mongoose;

const ReservationSchema = new Schema(
  {
    dateReservation: {
      type: Date,
      required: true
    },
    typePayment: {
      type: String,
      enum: ['pay Later', 'Credit Card'],
      required: true
    },
    
    etat: {
      type: Boolean,
      default: false,
      required: true
    },
    idUser: {
      type: String,
      required: false
    },
    idVelo: {
      type: String,
      required: false
    },
    promoCode: {
      type: String,
      required: false,
      default: generatePromoCode
    },
    stripeCheckoutSessionId: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

function generatePromoCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let promoCode = '';

  for (let i = 0; i < 6; i++) {
    promoCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return promoCode;
}

ReservationSchema.pre('save', async function (next) {
  if (!this.isModified('promoCode')) {
    return next();
  }

  this.promoCode = generatePromoCode();

  // If the payment type is 'Credit Card', create a Stripe Checkout Session and store the session ID
  if (this.typePayment === 'Credit Card') {
    try {
      const session = await createCheckoutSession();
      this.stripeCheckoutSessionId = session.id;
    } catch (error) {
      // Handle the error (e.g., log it)
      console.error('Error creating Stripe Checkout Session:', error);
    }
  }

  next();
});

export default model('Reservation', ReservationSchema);

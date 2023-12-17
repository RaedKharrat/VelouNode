import User from "../models/user.js";
import Reservation from "../models/reservation.js";
import Velo from "../models/velo.js";
import { createCheckoutSession } from "../services/stripe.js";
// import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

// controllers/reservation.js
// ... (other imports)

export const sendPromoCodeByEmail = async (req, res) => {
  try {
    const { promoCode, userId } = req.body;

    // Modify the logic to fetch user email based on userId, assuming you have a User model
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a nodemailer transporter using Gmail credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kharrat.raed@esprit.tn',
        pass: 'dbjc nggx rreq sssu'
      }
    });

    // Setup email options
    const mailOptions = {
      from: 'kharrat.raed@esprit.tn',
      //  to: user.email, // Replace with the actual field that holds the user's email
      to: 'kharrat.raed@esprit.tn', 

      subject: 'Promo Code',
      html: `
        <div style="text-align: center;">
          <p style="font-size: 16px;">Congratulation Velou! We've sent you a promo code:</p>
          <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${promoCode}</p>
          <p style="font-size: 16px;">Use this promo code for your reservation and get a 25% discount!</p>
        </div>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent: ', info);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};


// ... (other functions)



export async function totalReservation(_req, res) {
  try {
    const totalReservations = await Reservation.count();
    res.status(200).json({ totalReservations });
  } catch (error) {
    console.error('Error fetching total reservations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}




export async function getTotalReservations(_req, res) {
  try {
    // Use Mongoose to find all reservations
    const allReservations = await Reservation.find();

    // Log the reservations for debugging
    console.log('All Reservations:', allReservations);

    // Serialize each document in the array
    const serializedReservations = allReservations.map(reservation => reservation.toJSON());

    // Send the response with explicit serialization
    res.status(200).json({ allReservations: serializedReservations });
  } catch (error) {
    console.error('Error fetching all reservations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



// Update your server-side code

export async function loadedReservation(_req, res) {
  try {
    const currentDate = new Date();
    const loadedReservations = await Reservation.countDocuments({
      dateReservation: { $lt: currentDate },
    });

    res.status(200).json({ loadedReservations });
  } catch (error) {
    console.error('Error fetching loaded reservations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


export async function FinishedReservation(_req, res) {
  try {
    const currentDate = new Date();

    // Find reservations where dateReservation is greater than the current date
    const finishedReservations = await Reservation.countDocuments({
      dateReservation: { $gt: currentDate },
    });

    res.status(200).json({ finishedReservations });
  } catch (error) {
    console.error('Error fetching finished reservations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


export async function totalTransaction(_req, res) {
  try {
    // Use Mongoose aggregate pipeline to calculate the sum of prixTotal
    const totalTransaction = await Velo.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$prixTotal" }
        }
      }
    ]);

    // Extract the totalTransaction value from the result
    const result = totalTransaction.length > 0 ? totalTransaction[0].total : 0;

    res.status(200).json({ totalTransaction: result });
  } catch (error) {
    console.error('Error calculating total transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


export async function commandeVelo(req, res) {
  try {
    const velo = await Velo.findById(req.params.idVelo);

    if (velo.disponible === "true") {
      const user = await User.findById(req.params.idUser);

      const reservation = await Reservation.create({
        idUser: req.params.idUser,
        idVelo: req.params.idVelo,
        dateReservation: req.body.dateReservation,
        typePayment: req.body.typePayment,
        etat: true,
      });

      if (reservation.codePromo && reservation.codePromo !== '') {
        const updatedPrice = (velo.prixTotal * 75) / 100;
        await Velo.findByIdAndUpdate(req.params.idVelo, {
          prixTotal: updatedPrice,
        });
      }

      if (reservation.typePayment === 'Credit Card' || reservation.typePayment === 'pay Later') {
        // Handle both payment types
        // ...

        // Example: Create a checkout session for Credit Card payments
        if (reservation.typePayment === 'Credit Card') {
          const session = await createCheckoutSession(velo, reservation.typePayment);

          reservation.stripeCheckoutSessionId = session.id;
          await reservation.save();

          res.status(200).json({
            message: "Payment session created",
            sessionId: session.id,
          });
        } else {
          // Handle pay Later logic
          res.status(200).json({
            message: "Reservation submitted successfully",
          });
        }
      } else {
        res.status(400).json({
          error: "Invalid payment type. Only 'Credit Card' and 'pay Later' payments are supported.",
        });
      }
    } else {
      res.status(200).json({
        message: "Bike not available! Choose another one!",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}


export async function deleteReservation(req, res) {
  try {
    const { id } = req.params; // Destructure the 'id' property from req.params

    console.log('Reservation ID:', id); // Log the extracted ID value

    if (!id) {
      return res.status(400).json({ error: 'Invalid reservation ID' });
    }

    const deletedReservation = await Reservation.findByIdAndDelete(id);

    if (deletedReservation) {
      return res.status(200).json({ success: { msg: 'Reservation deleted successfully', deletedReservation } });
    } else {
      return res.status(404).json({ errors: { message: 'Failed to delete reservation' } });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getReservationsU(req, res) {
  try {
    const userId = req.params.idUser;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Modify the query to use the correct field name for user ID
    const reservations = await Reservation.find({ idUser: userId });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
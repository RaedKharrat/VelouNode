import User from "../models/user.js";
import Reservation from "../models/reservation.js";
import Velo from "../models/velo.js";
import { createCheckoutSession } from "../services/stripe.js";
import mongoose from 'mongoose';






export async function commandeVelo(req, res) {
  try {
    const velo = await Velo.findById(req.params.idVelo);

    if (velo.disponible === true) {
      const user = await User.findById(req.params.idUser);

      const reservation = await Reservation.create({
        idUser: req.params.idUser,
        idVelo: req.params.idVelo,
        dateReservation: req.body.dateReservation,
        typePayment:req.body.typePayment,
        etat: true,

      });

      if (reservation.codePromo && reservation.codePromo !== '') {
        const updatedPrice = (velo.prixTotal * 75) / 100;
        await Velo.findByIdAndUpdate(req.params.idVelo, {
          prixTotal: updatedPrice,
        });
      }
       
      else {
        const session = await createCheckoutSession();

        reservation.stripeCheckoutSessionId = session.id;
        await reservation.save();

        res.status(200).json({ message: "Payment session created", sessionId: session.id });
      }
    } else {
      res.status(200).json({ message: "Bike not available! Choose another one!" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
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

export async function getReservations(req, res) {
  try {
    const userId = req.params.idUser;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const reservations = await Reservation.find({ userId: userId });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
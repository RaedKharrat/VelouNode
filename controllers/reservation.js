import User from "../models/user.js";
import Reservation from "../models/reservation.js";
import Velo from "../models/velo.js";
import { createCheckoutSession } from "../services/stripe.js";





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
    const reservationId = req.params.id;

    const deletedReservation = await Reservation.findByIdAndDelete(reservationId);

    if (!deletedReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json({ message: 'Reservation deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

export async function getReservations(req, res) {
  try {
    const user = await User.findById(req.params.idUser);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const reservations = await Reservation.findAll({ userId: user._id });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
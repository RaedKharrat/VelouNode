import User from "../models/user.js";
import Reservation from "../models/reservation.js";
import Velo from "../models/velo.js";
import { createCheckoutSession } from "../services/stripe.js";





export async function commandeVelo(req, res) {
  try {
    const velo = await Velo.findById(req.params.idVelo);

    if (velo.disponibilite === true) {
      const user = await User.findById(req.params.idUser);

      const reservation = await Reservation.create({
        idUser: req.params.idUser,
        idVelo: req.params.idVelo,
        etat: true
      });

      if (reservation.codePromo && reservation.codePromo !== '') {
        const doc1 = await Velo.findByIdAndUpdate(req.params.idUser, {
          prixTotal: (velo.prixTotal * 90) / 100,
        });
      } else {
        // Call the createCheckoutSession function and get the session object
        const session = await createCheckoutSession();

        // You can now use the 'session' object as needed, for example, you might want to store the session ID in the reservation
        reservation.stripeCheckoutSessionId = session.id;
        
        // Save the updated reservation with the Stripe Checkout Session ID
        await reservation.save();

        // Respond with the session ID or any other relevant information
        res.status(200).json({ message: "Payment session created", sessionId: session.id });
      }

    } else {
      res.status(200).json({ message: "Velo non Disponible! choose another one !" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
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

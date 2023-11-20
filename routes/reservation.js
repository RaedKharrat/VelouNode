import express from 'express';
import { commandeVelo, getReservations, deleteReservation } from '../controllers/reservation.js';
// import { deleteReservation } from '../controllers/reservation.js';

const router = express.Router();

router
  .route('/reservation/:idUser/:idGame')
  .post(commandeVelo);

router.delete('/reservation/:_id', deleteReservation);
router.get("/reservations/:idUsder", getReservations);


export default router;
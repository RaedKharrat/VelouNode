import express from 'express';
import { commandeVelo } from '../controllers/reservation.js';
import { deleteReservation } from '../controllers/reservation.js';

const router = express.Router();

router
  .route('/reservation/:idUser/:idGame')
  .post(commandeVelo);

router.delete('/reservation/:id', deleteReservation);

export default router;
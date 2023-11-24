import express from 'express';
import { commandeVelo, getReservations, deleteReservation } from '../controllers/reservation.js';
// import { deleteReservation } from '../controllers/reservation.js';

const router = express.Router();


router.post('/reservation/:idUser/:idVelo', commandeVelo)
router.delete('/reservation/:id', deleteReservation);
router.get("/reservations/:idUser", getReservations);

export default router;
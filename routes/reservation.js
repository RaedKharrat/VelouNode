import express from 'express';
import { commandeVelo, getReservationsU, deleteReservation , totalReservation,loadedReservation,FinishedReservation,totalTransaction,getTotalReservations} from '../controllers/reservation.js';
// import { deleteReservation } from '../controllers/reservation.js';

const router = express.Router();


router.post('/reservation/:idUser/:idVelo', commandeVelo)
router.get('/reservation/totalreservation', totalReservation)
router.get('/reservation/loadedreservation', loadedReservation)
router.get('/reservation/finishedreservation', FinishedReservation)
router.get('/reservation/totaltransaction', totalTransaction)
router.get('/reservation/allreservations', getTotalReservations)
router.delete('/reservation/:id', deleteReservation);
router.get("/reservations/:idUser", getReservationsU);

export default router;


import express from 'express';
import { banUser, unbanUser, banUserWithDuration,getBannedUsers } from '../controllers/admin.js';
import { body } from 'express-validator';

const router = express.Router();

// Routes pour le bannissement d'utilisateur
router.put('/:email/ban',
  [
    // Ajoutez les validateurs express si nécessaires
   // body('durationInMinutes').isInt().withMessage('La durée doit être un nombre entier positif'),
  ],
  banUser
);

router.get('/getBannedUsers',getBannedUsers)

router.put('/:email/unban', unbanUser);

router.put(
  '/:email/banWithDuration',
  [
    // Ajoutez les validateurs express si nécessaires
    body('durationInMinutes').isInt().withMessage('La durée doit être un nombre entier positif'),
  ],
  banUserWithDuration
);

export default router;
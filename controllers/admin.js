

import User from '../models/user.js';
import mongoose from 'mongoose';

export async function banUser(req, res) {
    const email = req.params.email; // ou tout autre moyen d'obtenir l'ID de l'utilisateur à bannir
    console.log("aaa");
    if (!mongoose.Types.ObjectId.isValid(email)) {

     
      return res.status(400).json({ message: 'Invalid user ID' });
  }
    try {
      // Recherchez l'utilisateur dans la base de données
      const user = await User.findById(email);
  
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur introuvable' });
      }
  
      // Vérifiez si l'utilisateur est déjà banni
      if (user.isBanned) {

        return res.status(400).json({ message: 'Utilisateur déjà banni' });
      }
  
      // Marquez l'utilisateur comme banni
      user.isBanned = true;
      
      // Sauvegardez les modifications dans la base de données
      await user.save();
  
      res.status(200).json({ message: 'Utilisateur banni avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  export async function unbanUser(req, res) {
    const id = req.params.email; // ou tout autre moyen d'obtenir l'ID de l'utilisateur à débannir
  
    try {
      // Recherchez l'utilisateur dans la base de données
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur introuvable' });
      }
  
      // Vérifiez si l'utilisateur est déjà débanni
      if (!user.isBanned) {
        return res.status(400).json({ message: 'Utilisateur n\'est pas banni' });
      }
  
      // Marquez l'utilisateur comme débanni
      user.isBanned = false;
      
      // Sauvegardez les modifications dans la base de données
      await user.save();
  
      res.status(200).json({ message: 'Utilisateur débanni avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  // Fonction pour bannir un utilisateur pour une durée définie
export async function banUserWithDuration(req, res) {
    const email = req.params.email; // ou tout autre moyen d'obtenir l'ID de l'utilisateur à bannir
    const banDurationInMinutes = req.body.durationInMinutes; // La durée du bannissement en minutes
  
    try {
      // Recherchez l'utilisateur dans la base de données
      const user = await User.findById(email);
  
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur introuvable' });
      }
  
      // Vérifiez si l'utilisateur est déjà banni
      if (user.isBanned) {
        return res.status(400).json({ message: 'Utilisateur déjà banni' });
      }
  
      // Obtenez la date actuelle
      const currentDate = new Date();
  
      // Calculez la date d'expiration du bannissement en ajoutant la durée à la date actuelle
      const banExpirationDate = new Date(currentDate.getTime() + banDurationInMinutes * 60000);
  
      // Marquez l'utilisateur comme banni avec la date d'expiration
      user. isBannedTemp = true;
      user.banExpirationDate = banExpirationDate;
  
      // Sauvegardez les modifications dans la base de données
      await user.save();
  
      res.status(200).json({
        message: 'Utilisateur banni avec succès pour une durée définie',
        banExpirationDate: banExpirationDate,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  export async function getBannedUsers(req, res) {
    console.log("getBannedUsers")
    try {
      // Find all users that are currently banned
      const bannedUsers = await User.find({ isBanned: true });
  
      res.status(200).json(bannedUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

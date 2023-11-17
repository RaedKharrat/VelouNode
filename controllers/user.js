
import user from "../models/user.js";

import { validationResult } from 'express-validator';



// TODOO 1 Permet d'ajouter un nouveau user

export  function adduser(req, res) {
 console.log(validationResult(req));
  if (!validationResult(req).isEmpty()){  // verifiw les condition mte3na 
    res.status(400).json({errors: validationResult(req).array()})
}else{
   user.create(
    {
      adresse:req.body.adresse,
      email: req.body.email,    
      first_name: req.body.first_name,  
      last_name: req.body.last_name,
      phone: req.body.phone,
      password: req.body.password,
      image : `${req.protocol}://${req.get("host")}/image/${req.file.filename}`,
      wallet: req.body.wallet,
      role: req.body.role,
    }
)


  .then((newuser) => {
    res.status(200).json(newuser)/*({
        email: newuser.username, 
        first_name: newuser.first_name,  
        last_name: newuser.last_name,
        phone: newuser.phone,
        password: newuser.password,
        image : `${req.protocol}://${req.get("host")}/image/${req.file.filename}`,
        wallet: newuser.wallet,
        adresse: newuser.adresse,
        role: newuser.role,

    })*/
})
    
    .catch(error => res.status(400).json({ error }));



}
}


// TODOO 3 Permet de récupérer un user à l'aide de son full_name
export async function getuser(req, res) {

  await user.find({"first_name":req.params.user})
    .then(user => {res.status(200).json(user)})
    .catch(error => res.status(400).json({ error }));
}

export async function updateuser(req, res) {
  
    const existinguser = await user.findById(req.params.id);

    if (!existinguser) {   _id : req.params.id
      return res.status(404).json({ message: 'user not found' });
    }

    if (req.body.first_name) {
      existingUser.phone= req.body.phone;
    }
    if (req.body.email) {
      existingUser.email = req.body.email;
    }
    if (req.body.password) {
      existingUser.password = req.body.password;
    }
    if (req.body.role) {
      existingUser.role = req.body.role;
    }

      console.log(existinguser);
    await existinguser.save()
    .then(user => res.status(200).json({ updateduser: user }))
    .catch(error => res.status(400).json({ error }));

 
  
}


// TODO 5: Permet de récupérer la liste des USERS 
/*export async function getAllUser(req, res, next) {
  try {
    const penu = await user.find();
    res.status(200).json({ user: penu });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}*/



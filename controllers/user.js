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
      wallet: req.body.wallet
    }
)


  .then((newuser) => {
    res.status(200).json(newuser)({
        email: newuser.username, 
        first_name: newuser.first_name,  
        last_name: newuser.last_name,
        phone: newuser.phone,
        password: newuser.password,
        image : `${req.protocol}://${req.get("host")}/image/${req.file.filename}`,
        wallet: newuser.wallet,
        adresse: newuser.adresse,
    })
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

/* update  user 

export async function updateuser(req, res) {
  
    const existinguser = await user.findById(req.params.id);

    if (!existinguser) {id : req.params.id
      return res.status(404).json({ message: 'user not found' });
    }

    if (req.body.first_name) {
      existinguser.first_name= req.body.first_name;
    }
    if (req.body.email) {
      existinguser.email = req.body.email;
    }
    if (req.body.password) {
      existingUser.password = req.body.password;
    }
    if (req.body.image) {
      existinguser.image = req.body.image;
    }

     
    await existinguser.save()
    console.log(existinguser)
    .then(user => res.status(200).json({ updateduser: user }))
    .catch(error => res.status(400).json({ error }));

 
  
}*/

// Update a user
export function updateuser(req, res) {

  try {
   
    user.findOneAndUpdate({"_id":req.params.id} , {
      email: req.body.email,
      phone: req.body.phone,    
      first_name: req.body.first_name,  
      password:  req.body.password,
      image :`${req.protocol}://${req.get("host")}/image/${req.file.filename}`,
    }, {new: true})
    .then((updatedUser)=> {
      if (updatedUser) {
        res.status(200).json({ msg:"user modifié avec succes", user: updatedUser });
    } else {
        res.status(404).json({ error: "User not found." });
    }
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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


//delete user
export async function deleteuser(req, res) {
  try { 
  const deleteduser = await user.findByIdAndDelete({_id:req.params.id})
  deleteduser?
   res.status(200).send({success:{msg:"user supprimée avec succes",deleteduser}})
   :
   res.status(404).json({errors:{message:'Suppression echoué'}})

   } catch (error) {
    res.status(400).json({ error: error.message });
  }

}
import express, { Router } from 'express';
import * as user   from '../controllers/user.js';

//import multer from "../middlewares/multer-config.js";
//import { body } from 'express-validator';
//import multer from 'multer';

import { adduser } from '../controllers/user.js';



const router = express.Router();

router.route("/")
    .post( adduser ),


router.route("/:user")
.get(user.getuser);

router.route("/:id")
  // .put(multer("image"),user.updateuser)
   .delete(user.deleteuser);

 /*  //Handlers from controllers

<<<<<<< Updated upstream

router.post('/login', login)
router.post('/signup', signup)
router.post('/send-otp', sendOTP)
=======
   // .router.post("/user", upload, adduser);
   //.put(multer("image"),user.updateuser)
    router.route("/:user")
    .get(user.getuser)
    router.route("/:id")
    .put(user.updateuser)
<<<<<<< Updated upstream
    .delete(user.deleteuser);
>>>>>> Stashed changes

=======
    .delete(user.deleteuser)
>>>>>> Stashed changes



//testing protected route
router.get("/test",auth, (req,res)=>{
    res.json({
        success: true,
        message: "You are a valid Tester "
    })
})


*/
    export default router;
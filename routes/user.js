import express, { Router } from 'express';
import * as User   from '../controllers/user.js';

//import multer from "../middlewares/multer-config.js";
//import { body } from 'express-validator';
//import multer from 'multer';

import { adduser } from '../controllers/user.js';



const router = express.Router();

router.route("/")
    .post( adduser ),


// router.route("/:email")
// .get(user.getuser);

router.route("/getAllUser")
.get(User.getAllUsers);

router.route("/:id")
  // .put(multer("image"),user.updateuser)
   .delete(User.deleteuser);

   router.route("/login")
   .post(User.login)
   
   router.route("/forgetPassword")
   .post( User.forgetPasssword )

   router.route("/sendOTP")
    .post( User.sendOTP )

    router.route("/VerifyOTP")
    .post( User.verifyOtp )

    router.route("/resetPassword")
    .post( adduser )

   


    export default router;

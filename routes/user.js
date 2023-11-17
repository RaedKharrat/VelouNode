import express, { Router } from 'express';
import * as user   from '../controllers/user.js';
import multer from "../middlewares/multer-config.js";
import { body } from 'express-validator';



const router = express.Router();

router.route("/")
    .post( multer("image"),
    body("wallet").isNumeric(),
    body("adresse").isLength({min:5,max:100}),
    body("password").isLength({min:5,max:10}),
    body("last_name").isLength({min:5,max:10}),
    body("first_name").isLength({min:5,max:10}),
    body("email").isEmail(),
    body("phone").isLength({min:8,max:8}),
    user.adduser);

router.route("/:user")
.get(user.getuser);

router.route("/:id")
   .put(multer("image"),user.updateuser)
   .delete(user.deleteuser);

  // router.route("/:id")
   // .patch(user.updateuser)

    export default router;
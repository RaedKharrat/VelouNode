import User from "../models/user.js";
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken'; // Import the jsonwebtoken module
import otpGenerator from 'otp-generator';
import Otp from '../models/otp.js';


// TODO 1: Add a new user
export function adduser(req, res) {
  const { fullname, username,email, phone, password} = req.body;

  console.log(validationResult(req));

  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ errors: validationResult(req).array() });
  } else {
    User.create({
  
      email: email,
      fullname: fullname,
      username: username,
      phone: phone,
      password: password, // Store the password directly (without encryption)
     
    })
      .then(() => res.status(200).json({ message: "success" }))
      .catch(error => {res.status(404).json({ error }); console.log(error);});
  }
}

// TODO 3: Get a user by full_name
export async function getuser(req, res) {
  await User.findOne({ "email": req.params.email })
    .then(user => { res.status(200).json(user) })
    .catch(error => res.status(401).json({ error }));
}

// export function getAlluser(req, res) {
//   user(req, res, () => {
//     user.find({})
//       .then((users) => {
//         if (!users || users.length == null) {
//           return res.status(404).json({ message: 'No users found' });
//         }

//         let userList = user.map((user) => {
//           return {
//             id: user._id,
//             email: user.email,
//             fullname: user.fullname,
//             username: user.username,
//             //isValid: user.isValid,
//            // imageRes: user.imageRes,
//            // role: user.role,
//             phone: user.phone,
//             isBanned: user.isBanned,
//           };
//         });
//         res.status(200).json(users);
//       })
//       .catch((err) => {
//         res.status(500).json({ error: err });
//       });
//   });

// }
export async function getAllUsers(req , res){
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log("bla bla bla . ;. .");
    res.status(500).json({error : "eroor"});
  }
}

// Update a user
export function updateuser(req, res) {
  try {
    user.findOneAndUpdate({ "_id": req.params.id }, {
      email: req.body.email,
      phone: req.body.phone,
      first_name: req.body.first_name,
      password: req.body.password,
    }, { new: true })
      .then((updatedUser) => {
        if (updatedUser) {
          res.status(200).json({ msg: "User modified successfully", user: updatedUser });
        } else {
          res.status(404).json({ error: "User not found." });
        }
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
/*
export async function resetPassword(req, res, next) {
  console.log(req.body);

  const token = req.body.email;
  try {
    const decoded = jwt.verify(token, 'your-secret-key'); // Replace 'your-secret-key' with your actual secret key
    req.user = decoded.user;

    // Hacher le mot de passe avec le sel
    const hash = await bcrypt.hash(req.body.password, 10);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { password: hash },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'Password changed!', user });
  } catch (error) {
    console.error('Error resetting password:', error);

    // Check the type of error thrown by jwt.verify
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Handle other types of errors as needed
    res.status(500).json({ error: 'Internal Server Error' });
  }

}*/

// Delete a user
export async function deleteuser(req, res) {
  try {
    const deletedUser = await user.findByIdAndDelete({ _id: req.params.id });
    deletedUser ?
      res.status(200).send({ success: { msg: "User deleted successfully", deletedUser } })
      :
      res.status(404).json({ errors: { message: 'Deletion failed' } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export function login(req, res, next) {
  console.log(req.body)
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'User is not registered' });

      }
console.log(user)
      if (req.body.password !== user.password) {
        return res.status(402).json({ message: 'Password incorrect' });
      } else {
        const maxAge = 1 * 60 * 60;
        const uniqueIdentifier = Date.now(); // Generate a unique identifier (timestamp)
        const token = jwt.sign(
          { 
            userId: user._id,
            email: user.email,
            uniqueIdentifier: uniqueIdentifier // Include the unique identifier in the token payload
          },
          "" + process.env.JWT_SECRET,
          { expiresIn: maxAge } // 1hr in sec
        );

        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000, // 1hr in ms
          Secure: true,
        });

        res.status(200).json({
          user:user,
          token: token, // Include the new token in the response
          message: "User successfully logged in",
        });
      }
    })
    .catch(error => {
      console.error('Error in User.findOne:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
}

export async function sendOTP(req,res,next){
  try {
    const existingUser = await User.findOne(
      { email: req.body.email },
    );

    if (existingUser!=existingUser) {
      return res.status(400).json({ message: "It seems you already have an account, please log in instead." });
    }
    const otp = otpGenerator.generate(6,{
      secret: process.env.JWT_SECRET,
      digits: 6,
      algorithm: 'sha256',
      epoch: Date.now(),
      upperCaseAlphabets: false, specialChars: false,
      lowerCaseAlphabets: false,
  });
        const otpDocument = new Otp({
            userId: req.body.eamil, 
            otp
        });

        await otpDocument.save();
        res.status(200).json({ otp : otpDocument });

} catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
}
export async function forgetPasssword(req,res,next){
  try{
    User.findOne({ email: req.body.email })

    .then(user => {
        if (!user) {
            return res.status(401).json({ message: 'user is not registered' });
        }
        const otp = otpGenerator.generate(6,{
          secret: process.env.JWT_SECRET,
          digits: 6,
          algorithm: 'sha256',
          epoch: Date.now(),
          upperCaseAlphabets: false, specialChars: false,
          lowerCaseAlphabets: false,
      });
      const otpDocument = new Otp({
        userId: req.body.eamil, 
        otp,
      });
       otpDocument.save();
      return res.status(200).json({otp})
        
      })
  }
      catch(error) {
        console.error('Error in user.findOne:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    };
}

export async function verifyOtp(req, res, next) {
  try {
    const {otp} = req.body;
    const otpDocument = await Otp.findOne({ otp: otp});

    if (!otpDocument) {
      return res.status(404).json({ error: 'OTP not found' });
    }

    // Verify the OTP
    if (otp == otpDocument.otp) {
      // Delete the OTP document
      await otpDocument.deleteOne();

      return res.status(200).json({ message: 'OTP verified' });
    } else {
      return res.status(401).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function resetPassword(req,res,next){
  try {
 
    const hash = await bcrypt.hash(req.body.newPassword, 10);
  
    const user = await user.findOneAndUpdate(
      { email: req.body.email },
      { password: hash },
      { new: true } 
      );             
      if (!user) {
       return res.status(404).json({ error: 'User not found' });
       }
                     
      return res.status(200).json({ message: 'Password changed !', user });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
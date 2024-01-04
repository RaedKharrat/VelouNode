import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const UserSchema = new Schema({               // tetbadel  selon el  esm el model 
//  bech  nda5el les variables eli  fel  diagramme 
    email: {
    type: String,
    required: false
    //
    },

   fullname: {
        type: String,
        required: false
      //  
    },

    id: {
      type: String,
      required: false
    //  
  },


    username: {
        type: String,
        required: false
      //  
    },
   
    phone: {
        type: Number,
        required: false
      //  

    },

    password: {
        type: String,
        required: false
      //  

    },

    /*image:{
     type:String,
        required: false
        
    },*/
    isBanned: {
      type: Boolean,
      default: false,
  },
  banExpirationDate: {
      type: Date,
      default: null,
  },
  isBannedTemp: {
      type: Boolean,
      default: false,
  },
  lastLoginTimestamp: Date,
  lastLogoutTimestamp: Date,
  lastActive: Date,
  totalTimeSpent: {
      type: Number,
      default: 0, // Temps en millisecondes ou en secondes
  },


},


    {
        timestamp: true
    }
);

export default mongoose.model('User', UserSchema);


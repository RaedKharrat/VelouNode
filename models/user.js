import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const UserSchema = new Schema({               // tetbadel  selon el  esm el model 
//  bech  nda5el les variables eli  fel  diagramme 
    email: {
    type: String,
    //
    },

   first_name: {
        type: String,
      //  
    },

    last_name: {
        type: String,
      //  
    },
   
    phone: {
        type: Number,
      //  

    },

    password: {
        type: String,
      //  

    },

    image:{
        type:String,
        
    },
    wallet: {
        type: String,
        

    },
    adresse: {
        type: String,
        

    },

    role:{
        type: String,
    }


  
  

   
},
    {
        timestamp: true
    }
);

export default mongoose.model('user', UserSchema);
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const veloSchema = new Schema({
  // Define the schema fields for the "velos" table
  type: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,

  },
  prix: {
    type: Number,
  },
  description: {
    type: String,
    required: true,
  },
  disponible: {
    type: Boolean,
    required: true,
    default: true
  },
  prixTotal: {
    type: Number,
    required: true,
  },  
  cordinatee: {
    type: String, 
    required: true,
  }
 
},
{timestamps: true});

export default model("velos", veloSchema);

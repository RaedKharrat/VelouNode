import Velo from "../models/velo.js";
import { validationResult } from "express-validator";

// Add a new product
export const createvelo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { type, prix, description, disponible, longitude, latitude } = req.body;

  // Check if the file is included in the request
  let image;
  if (req.file) {
      image = req.file.path;
  } else {
      // Handle the case where the file is not included
      // You can either set a default image or return an error
      // For example, setting a default image path or returning an error:
      // return res.status(400).json({ error: 'File not provided' });
      image = 'defaultImagePath'; // Set this to your default image path
  }

  try {
    Velo.create({
      image,
      type,
      prix,
      description,
      disponible,
      longitude,
      latitude,
    })
    .then(newVelo => {
      res.status(201).json(newVelo);
    })
    .catch(err => {
      console.error("Erreur lors de la création de velo:", err);
      res.status(500).json({ error: err.message });
    });
  } catch (error) {
    console.error("Erreur lors de la création de velo:", error);
    res.status(500).json({ error: error.message });
  }
};


  

// Get a product by its ID
export async function getvelo(req, res) {
  const { _id } = req.params;
  try {
    const foundVelo = await Velo.findById(_id);
    if (!foundVelo)
      res.status(400).send({ errors: [{ msg: "velo n'existe pas" }] });
    else res.status(200).send({ success: { msg: "velo trouvée", foundVelo } });
  } catch (error) {
    res.status(400).send({ errors: [{ msg: error.message }] });
  }
}

// Update a product
export async function updatevelo(req, res) {
  const { id } = req.params;

  try {
    const newVelo = req.body;
    await Velo.updateOne({ _id: id }, { $set: newVelo });
    res
      .status(200)
      .send({ success: { msg: "velo modifié avec succes", newVelo } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Get a list of all products
export async function getvelos(req, res) {
  try {
    const velos = await Velo.find();
    res.status(200).json(velos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Delete a product
export async function deletevelo(req, res) {
  try {
    const deletedVelo = await Velo.findByIdAndDelete({ _id: req.params.id });
    if (deletedVelo) {
      res.status(200).send({
        success: { msg: "velo supprimée avec succes", deletedVelo },
      });
    } else {
      res.status(404).json({ errors: { message: "Suppression echouée" } });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
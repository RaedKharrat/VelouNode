import Velo from "../models/velo.js";
import { validationResult } from "express-validator";

// Add a new product
/*
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
    // Set this to your default image path or consider using null
    image = null;
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
      .then((newVelo) => {
        res.status(201).json(newVelo);
      })
      .catch((err) => {
        console.error("Erreur lors de la création de velo:", err);
        res.status(500).json({ error: err.message });
      });
  } catch (error) {
    console.error("Erreur lors de la création de velo:", error);
    res.status(500).json({ error: error.message });
  }
};*/

export async function createvelo(req, res) {
  try {
    if (!validationResult(req).isEmpty()) {
      return res.status(400).json({ error: validationResult(req).array() });
    }

    let newVelo = await Velo.create({
      type: req.body.type,
      image: `${req.protocol}://${req.get("host")}/img/${req.file.filename}`,
      description: req.body.description,
      prix: req.body.prix,
      disponible: req.body.disponible,
    });
    

    res.status(200).json({
      title: newVelo.type,
      image: newVelo.image,
      description: newVelo.description,
      prix: newVelo.prix,
      disponible: newVelo.disponible,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

// Get a product by its ID
export async function getvelo(req, res) {
  const { _id } = req.params;
  try {
    const foundVelo = await Velo.findById(_id);
    if (!foundVelo)
      res.status(404).send({ errors: [{ msg: "velo n'existe pas" }] });
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
    let docs = await Velo.find({});
    let list = docs.map(doc => ({
      id: doc._id,
      type: doc.type,
      image: doc.image,
      description: doc.description,
      disponible: doc.disponible

    }));
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ error: err });
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

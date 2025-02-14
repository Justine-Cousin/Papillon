import type { RequestHandler } from "express";
import MoodRepository from "./MoodRepository";

const getMoodByChildId: RequestHandler = async (req, res, next) => {
  try {
    const childId = Number(req.params.childId);
    const mood = await MoodRepository.findByChildId(childId);
    res.json(mood);
  } catch (error) {
    next(error);
  }
};

const editMoodByChildId: RequestHandler = async (req, res, next) => {
  try {
    const childId = Number(req.params.childId);
    const { mood } = req.body;

    // Mise à jour de l'humeur
    await MoodRepository.update({
      child_id: childId,
      mood,
    });

    // Récupérer l'humeur mise à jour
    const updatedMood = await MoodRepository.findByChildId(childId);

    // Renvoyer l'humeur mise à jour
    res.json(updatedMood);
  } catch (error) {
    console.error("Error in editMoodByChildId:", error);
    // Envoyer une réponse d'erreur plus détaillée
    res.status(500).json({
      message: "Error updating mood",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export default {
  getMoodByChildId,
  editMoodByChildId,
};

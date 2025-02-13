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

export default {
  getMoodByChildId,
};

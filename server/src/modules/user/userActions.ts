import type { RequestHandler } from "express";
import userRepositeory from "./userRepository";

const read: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const user = await userRepositeory.read(userId);

    if (user == null) {
      res.status(404).send("User not found");
    } else {
      res.json(user);
    }
  } catch (error) {
    next(error);
  }
};

export default { read };

import argon2 from "argon2";
import type { RequestHandler } from "express";
import userRepositeory from "./userRepository";

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 4,
  parallelism: 2,
};

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

const add: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password_hash } = req.body;
    if (!name || !email || !password_hash) {
      res.status(400).json({
        message: "Les champs nom, email et mot de passe sont requis",
      });
      return;
    }

    const hashedPassword = await argon2.hash(password_hash, hashingOptions);
    const userId = await userRepositeory.add(name, email, hashedPassword);

    res.status(201).json({
      message: "Bienvenue ! Votre compte a été créé avec succès",
      id: userId,
    });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ER_DUP_ENTRY"
    ) {
      res.status(400).json({
        message: "Cet email est déjà utilisé",
      });
      return;
    }
    next(error);
  }
};

export default { read, add };

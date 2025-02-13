import argon2 from "argon2";
import type { Request, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import userRepository from "../user/userRepository";

interface AuthenticatedRequest extends Request {
  user?: { userId: number };
}

const login: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific user from the database based on the provided email
    const user = await userRepository.readByEmail(req.body.email);

    if (user == null) {
      res.sendStatus(422);
      return;
    }

    const verified = await argon2.verify(user.password_hash, req.body.password);

    if (verified) {
      // Respond with the user and a signed token in JSON format (but without the hashed password)
      const { password_hash, ...userWithoutHashedPassword } = user;

      const myPayload: MyPayload = {
        sub: user.id.toString(),
      };

      const token = await jwt.sign(
        myPayload,
        process.env.APP_SECRET as string,
        {
          expiresIn: "1h",
        },
      );

      res.json({
        token,
        user: userWithoutHashedPassword,
      });
    } else {
      res.sendStatus(422);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const verifyToken: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Non authentifié" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.APP_SECRET as string,
    ) as unknown as { userId: number };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Non autorisé" });
  }
};

export default { login, verifyToken };

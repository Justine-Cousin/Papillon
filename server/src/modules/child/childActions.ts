import type { RequestHandler } from "express";
import childRepository from "./childRepository";

export interface child {
  id: number;
  name: string;
  parent_id: number;
}

const readByParentId: RequestHandler = async (req, res, next) => {
  try {
    const parentId = Number(req.params.id);
    const children = await childRepository.readByParentId(parentId);
    res.json(children);
  } catch (error) {
    next(error);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const childId = Number(req.params.id);
    const child = await childRepository.read(childId);

    if (child == null) {
      res.sendStatus(404);
    } else {
      res.json(child);
    }
  } catch (error) {
    next(error);
  }
};

export default { readByParentId, read };

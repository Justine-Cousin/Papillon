import type { RequestHandler } from "express";
import appointmentRepository from "./appointmentRepository";

const getAppointmentByChildId: RequestHandler = async (req, res, next) => {
  try {
    const childId = Number(req.params.childId);
    const appointments =
      await appointmentRepository.getAppointmentsByChildId(childId);
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

const addAppointment: RequestHandler = async (req, res, next) => {
  try {
    const childId = Number(req.params.childId);
    const appointment = req.body;
    const result = await appointmentRepository.addAppointment(
      childId,
      appointment,
    );
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};

export default {
  getAppointmentByChildId,
  addAppointment,
};

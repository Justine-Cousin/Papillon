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
    const result = await appointmentRepository.create(childId, appointment);
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const appointment = {
      id: Number(req.params.appointmentId),
      child_id: Number(req.params.childId),
      title: req.body.title,
      date_time: new Date(req.body.date_time).toISOString(),
    };

    const affectedRows = await appointmentRepository.update(appointment);

    if (affectedRows === 0) {
      res.status(404).send("Appointment not found");
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error("Error in edit appointment:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).send(`Error updating appointment: ${errorMessage}`);
    next(error);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const appointmentId = Number(req.params.appointmentId);
    const affectedRows = await appointmentRepository.delete(appointmentId);

    if (affectedRows === 0) {
      res.status(404).send("Appointment not found");
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    next(error);
  }
};

export default {
  getAppointmentByChildId,
  addAppointment,
  edit,
  destroy,
};

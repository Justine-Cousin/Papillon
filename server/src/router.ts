import express from "express";

import appointmentActions from "./modules/appointment/appointmentActions";
import childActions from "./modules/child/childActions";
import MoodActions from "./modules/mood/MoodActions";
import taskActions from "./modules/task/taskActions";
import userActions from "./modules/user/userActions";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
router.get("/api/users/:id", userActions.read);

router.get("/api/users/:id/children", childActions.readByParentId);
router.get("/api/children/:id", childActions.read);

router.get(
  "/api/children/:childId/appointments",
  appointmentActions.getAppointmentByChildId,
);
router.post(
  "/api/children/:childId/appointments",
  appointmentActions.addAppointment,
);

router.get("/api/children/:childId/tasks", taskActions.getTasksByChildId);
router.post("/api/children/:childId/tasks", taskActions.addTask);
router.put("/api/tasks/:taskId/status", taskActions.updateTaskStatus); // Changement de :id en :taskId/* ************************************************************************* */

router.get("/api/children/:childId/emotion", MoodActions.getMoodByChildId);

export default router;

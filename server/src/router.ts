import express from "express";

import appointmentActions from "./modules/appointment/appointmentActions";
import authActions from "./modules/auth/authActions";
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
router.post("/api/users", userActions.add);
router.post("/api/auth/login", authActions.login);

router.get("/api/children/:id", childActions.read);

router.get(
  "/api/children/:childId/appointments",
  appointmentActions.getAppointmentByChildId,
);
router.post(
  "/api/children/:childId/appointments",
  appointmentActions.addAppointment,
);
router.put(
  "/api/children/:childId/appointments/:appointmentId",
  appointmentActions.edit,
);
router.delete(
  "/api/children/:childId/appointments/:appointmentId",
  appointmentActions.destroy,
);

router.get("/api/children/:childId/tasks", taskActions.getTasksByChildId);
router.post("/api/children/:childId/tasks", taskActions.addTask);
router.put("/api/tasks/:taskId/status", taskActions.updateTaskStatus);
router.put("/api/children/:childId/tasks/:taskId", taskActions.edit);
router.delete("/api/children/:childId/tasks/:taskId", taskActions.destroy);

router.get("/api/children/:childId/emotion", MoodActions.getMoodByChildId);
router.post("/api/children", childActions.add);
router.get("/api/", authActions.verifyToken);

export default router;

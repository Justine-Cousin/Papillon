import express from "express";

import userActions from "./modules/user/userActions";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
router.get("/api/users/:id", userActions.read);

/* ************************************************************************* */

export default router;

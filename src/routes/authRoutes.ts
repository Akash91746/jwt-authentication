import { Router } from "express";
import * as controller from "../controller/authController";

const router = Router();

router.post("/sign-in", controller.signinWithEmail);

router.post("/sign-up", controller.signupWithEmail);

router.post("/sign-out", controller.signOut);

router.post("/refresh-token", controller.refresh);

export default router;
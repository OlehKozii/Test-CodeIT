import { Router } from "express";
import userController from "../controller/userController";
import { checkAuth } from "../middleware/checkAuth";

const router: Router = Router();

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.get("/getone", checkAuth, userController.getOne);

export default router;

import express from "express"
import { applyTest, getTests, Login, signup,uploadMiddleware } from "../controllers/userController";
import { verifyJWT } from "../middlewares/verifyJWT";

const router = express.Router();

router.get("/login/success",verifyJWT, Login);

router.post("/signup", verifyJWT,uploadMiddleware,signup);
router.get("/getTests", getTests);
router.post("/test/:testId/booktest",verifyJWT, applyTest);

export default router;
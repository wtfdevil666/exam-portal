import express from "express"
import { applyTest, getTests, signup,uploadMiddleware } from "../controllers/userController";
import { verifyJWT } from "../middlewares/verifyJWT";

const router = express.Router();

router.get("/login/success", (req, res) => {
    res.send({ success: true, user: req.user });
});

router.post("/signup", uploadMiddleware,signup);
router.get("/getTests", getTests);
router.post("/test/:testId/booktest",verifyJWT, applyTest);

export default router;
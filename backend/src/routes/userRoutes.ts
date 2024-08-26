import express from "express"
import { signup,uploadMiddleware } from "../controllers/userController";

const router = express.Router();

router.get("/login/success", (req, res) => {
    res.send({ success: true, user: req.user });
});

router.post("/signup", uploadMiddleware,signup);
router.post("/verify-face", );

export default router;
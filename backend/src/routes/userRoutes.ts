import express from "express"
import { signup } from "../controllers/userController";

const router = express.Router();

router.get("/login/success", (req, res) => {
    res.send({ success: true, user: req.user });
});

router.post("/signup", signup);

export default router;
import express from "express"

const router = express.Router();

router.get("/login/success", (req, res) => {
    res.send({ success: true, user: req.user });
});

export default router;
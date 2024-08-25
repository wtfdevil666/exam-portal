import express from "express";
import { adminLogin, isAdminLogined } from "../controllers/adminAuth";
import { verifyJWT } from "../middlewares/verifyJWT";

const router = express.Router();

router.post("/getotp", adminLogin);
router.get("/islogined",verifyJWT,isAdminLogined);

export default router;
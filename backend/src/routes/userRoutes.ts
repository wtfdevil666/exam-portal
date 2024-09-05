import express from "express"
import { applyTest, getTests, login,  } from "../controllers/userController";
import { checkCookiesMiddleware } from "../middlewares/verifyCookies";

const router = express.Router();

router.get("/login/success",checkCookiesMiddleware, login);


router.get("/getTests", checkCookiesMiddleware, getTests);
router.post("/test/:testId/booktest", checkCookiesMiddleware,applyTest);

export default router;
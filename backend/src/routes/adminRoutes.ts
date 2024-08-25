import express from "express";
import { adminLogin, isAdminLogined } from "../controllers/adminAuth";
import { verifyJWT } from "../middlewares/verifyJWT";
import { addCodingQuestion, addMcq, createTest, deleteTest, getTests, updateMcq, updateTest } from "../controllers/adminController";

const router = express.Router();

router.post("/getotp", adminLogin);
router.get("/islogined", verifyJWT, isAdminLogined);
router.get("/tests", verifyJWT, getTests);
router.post("/createTest", verifyJWT, createTest);
router.delete("/deleteTest/:id", verifyJWT, deleteTest);
router.put("/updateTest/:id", verifyJWT, updateTest);
router.post("/test/:testId/addmcq", verifyJWT, addMcq);
router.get("/test/:testId/mcqs", verifyJWT, addMcq);
router.delete("/test/:testId/mcq/:mcqId", verifyJWT, addMcq);
router.put("/test/:testId/mcq/:mcqId", verifyJWT, updateMcq);
router.post("/test/:testId/addcodingquestion", verifyJWT, addCodingQuestion);
router.get("/test/:testId/codingquestions", verifyJWT, addCodingQuestion);
router.delete("/test/:testId/codingquestion/:codingQuestionId", verifyJWT, addCodingQuestion);
router.put("/test/:testId/codingquestion/:codingQuestionId", verifyJWT, addCodingQuestion);

export default router;
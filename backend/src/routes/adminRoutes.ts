import express from "express";
import { adminLogin, isAdminLogined } from "../controllers/adminAuth";
import { verifyJWT } from "../middlewares/verifyJWT";
import { addCodingQuestion, addMcq, createTest, createTestSlot, deleteCodingQuestion, deleteTest, deleteTestSlot, getCodingQuestions, getMcqs, getTests, getTestSlots, updateCodingQuestion, updateMcq, updateTest, updateTestSlot } from "../controllers/adminController";

const router = express.Router();

//Auth routes
router.post("/getotp", adminLogin);
router.get("/islogined", verifyJWT, isAdminLogined);

//Test routes
router.get("/tests",verifyJWT, getTests);
router.post("/createTest", verifyJWT, createTest);
router.delete("/deleteTest/:id", verifyJWT, deleteTest);
router.put("/updateTest/:id", verifyJWT, updateTest);

//Test slot routes
router.get("/test/:testId/slots", verifyJWT, getTestSlots);
router.post("/test/:testId/addslots", verifyJWT,createTestSlot);
router.delete("/test/:testId/slot/:testSlotId", verifyJWT, deleteTestSlot);
router.put("/test/:testId/slot/:testSlotId", verifyJWT, updateTestSlot);

//Question routes
//Mcq routes
router.get("/test/:testId/:testSlotId/mcqs", verifyJWT, getMcqs);
router.post("/test/:testId/:testSlotId/addmcq", verifyJWT, addMcq);
router.delete("/test/:testId/:testSlotId/mcq/:mcqId", verifyJWT, addMcq);
router.put("/test/:testId/mcq/:mcqId", verifyJWT, updateMcq);

//Coding question routes
router.get("/test/:testId/:testSlotId/codingquestions", verifyJWT, getCodingQuestions);
router.post("/test/:testId/:testSlotId/addcodingquestion", verifyJWT, addCodingQuestion);
router.delete("/test/:testId/:testSlotId/codingquestion/:codingQuestionId", verifyJWT, deleteCodingQuestion);
router.put("/test/:testId/:testSlotId/codingquestion/:codingQuestionId", verifyJWT, updateCodingQuestion);



export default router;
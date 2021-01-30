import { Router } from "express";

import { index, validator } from "../controllers/TaskController";
import requestValidator from "../middleware/RequestValidator";

const router = Router();

router.get("/", index);
router.post("/validate-rule", requestValidator, validator);

export default router;
import express from "express";
import * as tasks from "../controllers/tasks";
import { authenticate } from "../controllers/middleware";

const router = express.Router();

router.use(authenticate);
router.post("/", tasks.create);
router.get("/", tasks.getAll);
router.get("/:taskId", tasks.getOne);
router.put("/:taskId", tasks.update);
router.delete("/:taskId", tasks.remove);

export default router;
const express = require("express");
const router = express.Router();
const controller = require("../controllers/grade");

router.post("/", controller.create);
router.post("/calculate", controller.calculate);
router.get("/", controller.getAll);
router.put("/manual", controller.manualUpdate);

module.exports = router;
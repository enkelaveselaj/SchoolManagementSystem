const express = require("express");
const router = express.Router();
const schoolController = require("../controllers/school.controller");

router.get("/", schoolController.getSchool);
router.put("/", schoolController.updateSchool);

module.exports = router;
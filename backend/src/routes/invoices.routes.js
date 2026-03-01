const express = require("express");
const controller = require("../controllers/invoices.controller");

const router = express.Router();

router.get("/", controller.getAll);
router.post("/generate", controller.generate);
router.patch("/:id/pay", controller.markAsPaid);
router.get("/:id/pdf", controller.downloadPdf);

module.exports = router;
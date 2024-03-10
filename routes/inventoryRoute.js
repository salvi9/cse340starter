// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const regValidate = require("../utilities/account-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildByInventoryId);

// Build Vehicle Management Page
router.get("/", invController.buildVehicleManagement);
router.get("/add-classification", invController.buildClassification);
router.post(
  "/add-classification",
  regValidate.checkClassData,
  invController.postClassification
);

router.get("/add-inventory", invController.buildByInventory);
router.post(
  "/add-inventory",
  regValidate.sendInventoryRules(),
  invController.sendInventory
);

module.exports = router;

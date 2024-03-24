// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const regValidate = require("../utilities/account-validation");
const utilities = require("../utilities");
const validate = require("../utilities/account-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildByInventoryId);

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Build Vehicle Management Page
router.get(
  "/",
  utilities.checkAccountType,
  invController.buildVehicleManagement
);
router.get(
  "/add-classification",
  utilities.checkAccountType,
  invController.buildClassification
);
router.post(
  "/add-classification",
  regValidate.checkClassData,
  invController.postClassification
);

router.get(
  "/add-inventory",
  utilities.checkAccountType,
  invController.buildByInventory
);
router.post(
  "/add-inventory",
  regValidate.sendInventoryRules(),
  invController.sendInventory
);

router.get(
  "/edit/:inv_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.editInventoryItemView)
);
router.post(
  "/update/",
  validate.checkVehicleUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

router.get(
  "/delete/:invId",
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteVehicleConfirmation)
);
router.post(
  "/deleteVehicle/",
  utilities.handleErrors(invController.deleteVehicle)
);

module.exports = router;

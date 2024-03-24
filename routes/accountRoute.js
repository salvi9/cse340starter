// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const utilities = require("../utilities");

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.accountManagement)
);

router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

router.get("/logout", utilities.handleErrors(accountController.accountLogout));

router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

router.post(
  "/register-user",
  regValidate.registationRules(),
  regValidate.checkRegData,
  accountController.registerAccount,
  utilities.handleErrors(accountController.accountLogin)
);

router.get(
  "/updateAccount/:account_id",
  utilities.handleErrors(accountController.accountEditView)
);
router.post(
  "/updateAccount",
  regValidate.checkAccountUpdate,
  utilities.handleErrors(accountController.accountUpdate)
);

router.post(
  "/updatePassword",
  regValidate.checkPasswordUpdate,
  utilities.handleErrors(accountController.updatePassword)
);

router;
module.exports = router;

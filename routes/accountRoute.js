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

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

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

module.exports = router;

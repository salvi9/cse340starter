const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_image +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildInventoryGrid = async function (data) {
  console.log(`*******DATA*****${data[0]}`);
  let grid = "";
  grid += '<div id="vehicle_details">';
  grid +=
    '<img src="' +
    (data.inv_image ? data.inv_image : "") +
    '" alt="Image of ' +
    data.inv_make +
    " " +
    data.inv_model +
    ' on CSE Motors" />';
  grid += "<div>";
  grid +=
    "<h3>" + data.inv_make + " " + data.inv_model + " " + "Details" + "</h3>";
  grid +=
    "<p >Price:$" +
    new Intl.NumberFormat("en-US").format(data.inv_price) +
    "</p>";
  grid += "<p>" + "Description:" + " " + data.inv_description + "</p>";
  grid += "<p>" + "Color:" + " " + data.inv_color + "</p>";
  grid +=
    "<p>Miles: " +
    new Intl.NumberFormat("en-US").format(data.inv_miles) +
    "</p>";
  grid += "</div>";
  grid += "</div>";
  return grid;
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  console.log(`*******************************************${data.rows[0]}`);
  let options = data.rows.map((row) => {
    let selected =
      classification_id != null && row.classification_id == classification_id
        ? "selected"
        : "";

    return `<option value="${row.classification_id}" ${selected}>${row.classification_name}</option>`;
  });

  let vehicle_classification = `<select name="classification_id" id="classificationList">
                                <option>Choose a Classification</option>
                                ${options.join("")}
                                </select>`;

  return vehicle_classification;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

Util.checkAccountType = async (req, res, next) => {
  if (req.cookies.jwt) {
    const accountData = await jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET
    );

    if (
      accountData &&
      (accountData.account_type === "Employee" ||
        accountData.account_type === "Admin")
    ) {
      res.locals.accountData = accountData;
      res.locals.loggedin = 1;
      return next();
    } else {
      req.flash(
        "notice",
        "This must NOT be used when delivering the classification or detail views as they are meant for site visitors who may not be logged in."
      );
      return res.redirect("/account/login");
    }
  }
};

module.exports = Util;

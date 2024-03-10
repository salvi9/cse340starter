const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  });
};

invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.invId;
  const data = await invModel.getInventoryByInventoryId(inventory_id);
  console.log(data);
  const grid = await utilities.buildInventoryGrid(data);
  let nav = await utilities.getNav();
  const className = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
  res.render("./inventory/vehicle_details", {
    title: className,
    nav,
    grid,
    errors: null,
  });
};

/* ***************************
 *  Build Vehicle Management view
 * ************************** */
invCont.buildVehicleManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  });
};

invCont.buildClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

invCont.postClassification = async function (req, res) {
  const { classification_name } = req.body;
  const classResult = await invModel.sendClassification(classification_name);
  if (classResult) {
    let nav = await utilities.getNav();
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${classification_name}.`
    );
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    let nav = await utilities.getNav();
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  }
};

invCont.buildByInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let dropdown = await utilities.buildVehicleClassification();
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    dropdown,
    errors: null,
  });
};

invCont.sendInventory = async function (req, res) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;

  const inventoryResult = await invModel.sendInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  );
  if (inventoryResult) {
    let nav = await utilities.getNav();
    req.flash(
      "notice",
      `Congratulations, you\'ve registered to the Inventory.`
    );
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    let dropdown = await utilities.buildClassificationDropDown();
    let nav = await utilities.getNav();
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      dropdown,
      errors: null,
    });
  }
};

module.exports = invCont;

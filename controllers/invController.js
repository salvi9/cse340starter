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

module.exports = invCont;

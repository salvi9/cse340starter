const invModel = require("../models/inventory-model");
const Util = {};

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
  let grid = "";
  grid += '<div id="vehicle_details">';
  grid +=
    '<img src="' +
    (data[0].inv_image ? data[0].inv_image : "") +
    '" alt="Image of ' +
    data[0].inv_make +
    " " +
    data[0].inv_model +
    ' on CSE Motors" />';
  grid += "<div>";
  grid +=
    "<h3>" +
    data[0].inv_make +
    " " +
    data[0].inv_model +
    " " +
    "Details" +
    "</h3>";
  grid +=
    "<p >Price:$" +
    new Intl.NumberFormat("en-US").format(data[0].inv_price) +
    "</p>";
  grid += "<p>" + "Description:" + " " + data[0].inv_description + "</p>";
  grid += "<p>" + "Color:" + " " + data[0].inv_color + "</p>";
  grid +=
    "<p>Miles: " +
    new Intl.NumberFormat("en-US").format(data[0].inv_miles) +
    "</p>";
  grid += "</div>";
  grid += "</div>";
  return grid;
};

Util.buildVehicleClassification = async function (classification_id = null) {
  let data = await invModel.getClassifications();

  let options = data.rows.map((row) => {
    let selected =
      classification_id != null && row.classification_id == classification_id
        ? "selected"
        : "";

    return `<option value="${row.classification_id}" ${selected}>${row.classification_name}</option>`;
  });

  let vehicle_classification = `<select name="classification_id" id="classification_id">
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

module.exports = Util;

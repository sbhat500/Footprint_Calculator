let state_region = new Map();

//regions: Index 0
// hot-humid
// cold
// marine
// hot-dry
// mixed-humid

//sources: Index 1
//Natural Gas
//Nuclear
//Coal
//Petroleum
//Hydro
state_region.set("Alabama", ["hot-humid", "Natural Gas"]);
state_region.set("Alaska", ["cold", "Natural Gas"]);
state_region.set("Arizona", ["hot-dry", "Nuclear"]);
state_region.set("Arkansas", ["mixed-humid", "Coal"]);
state_region.set("California", ["marine", "Natural Gas"]);
state_region.set("Colorado", ["cold", "Coal"]);
state_region.set("Conneticut", ["cold", "Nuclear"]);
state_region.set("DC", ["mixed-humid", "Nuclear"]);
state_region.set("Delaware", ["mixed-humid", "Natural Gas"]);
state_region.set("Florida", ["hot-humid", "Natural Gas"]);
state_region.set("Georgia", ["hot-humid", "Natural Gas"]);
state_region.set("Hawaii", ["hot-humid", "Petroleum"]);
state_region.set("Idaho", ["cold", "Hydro"]);
state_region.set("Illinois", ["cold", "Nuclear"]);
state_region.set("Indiana", ["cold", "Coal"]);
state_region.set("Iowa", ["cold", "Coal"]);
state_region.set("Kansas", ["mixed-humid", "Coal"]);
state_region.set("Kentucky", ["mixed-humid", "Coal"]);
state_region.set("Louisiana", ["hot-humid", "Natural Gas"]);
state_region.set("Maine", ["cold", "Hydro"]);
state_region.set("Maryland", ["mixed-humid", "Nuclear"]);
state_region.set("Massachusetts", ["cold", "Nuclear"]);
state_region.set("Michigan", ["cold", "Coal"]);
state_region.set("Minnesota", ["cold", "Coal"]);
state_region.set("Mississippi", ["hot-humid", "Natural Gas"]);
state_region.set("Missouri", ["mixed-humid", "Coal"]);
state_region.set("Montana", ["cold", "Coal"]);
state_region.set("Nebraska", ["cold", "Coal"]);
state_region.set("Nevada", ["cold", "Natural Gas"]);
state_region.set("New Hampshire", ["cold", "Nuclear"]);
state_region.set("New Jersey", ["cold", "Natural Gas"]);
state_region.set("New Mexico", ["hot-dry", "Coal"]);
state_region.set("New York", ["cold", "Natural Gas"]);
state_region.set("North Carolina", ["mixed-humid", "Nuclear"]);
state_region.set("North Dakota", ["cold", "Coal"]);
state_region.set("Ohio", ["cold", "Coal"]);
state_region.set("Oklahoma", ["mixed-humid", "Natural Gas"]);
state_region.set("Oregon", ["marine", "Hydro"]);
state_region.set("Pennsylvania", ["cold", "Nuclear"]);
state_region.set("Rhode Island", ["cold", "Natural Gas"]);
state_region.set("South Carolina", ["mixed-humid", "Nuclear"]);
state_region.set("South Dakota", ["cold", "Hydro"]);
state_region.set("Tennesse", ["mixed-humid", "Coal"]);
state_region.set("Texas", ["hot-humid", "Natural Gas"]);
state_region.set("Utah", ["cold", "Coal"]);
state_region.set("Vermont", ["cold", "Hydro"]);
state_region.set("Virginia", ["mixed-humid", "Natural Gas"]);
state_region.set("Washington", ["marine", "Hydro"]);
state_region.set("West Virginia", ["cold", "Coal"]);
state_region.set("Wisconsin", ["cold", "Coal"]);
state_region.set("Wyoming", ["cold", "Coal"]);

let region_rate = new Map();
//Air Conditioning, Space Heating, Water Heating, Refrigerators
region_rate.set("cold", [
  0.337361273629739,
  6.88340800506917,
  2.17273040447777,
  0.328076100961031,
]);
region_rate.set("mixed-humid", [
  0.924214657537206,
  4.99244721400235,
  2.13117991806525,
  0.358713451555536,
]);
region_rate.set("hot-dry", [
  1.03761046281085,
  1.89536844540116,
  2.54560433542929,
  0.456548603636776,
]);
region_rate.set("hot-humid", [
  2.38337495216227,
  2.01443146111548,
  1.82258084577114,
  0.442732189256148,
]);
region_rate.set("marine", [
  0.118734908519293,
  3.01586667639004,
  2.56467402401672,
  0.427445670669454,
]);

let region_percentages = new Map();
//Air Conditioning, Space Heating, Water Heating, Refrigerators, Other
region_percentages.set("cold", [
  0.02797,
  0.56871,
  0.17945,
  0.0271,
  0.196778221778222,
]);
region_percentages.set("mixed-humid", [
  0.08351,
  0.45054,
  0.19227,
  0.03238,
  0.241293900184843,
]);
region_percentages.set("hot-dry", [
  0.12485,
  0.22712,
  0.30076,
  0.05394,
  0.293333333333333,
]);
region_percentages.set("hot-humid", [
  0.24806,
  0.21034,
  0.18921,
  0.046,
  0.306382978723404,
]);
region_percentages.set("marine", [
  0.01702,
  0.38665,
  0.32513,
  0.05419,
  0.217015706806283,
]);

let source_emissions = new Map();

source_emissions.set("Coal", 1.002438);
source_emissions.set("Nuclear", 0.004);
source_emissions.set("Natural Gas", 0.412769);
source_emissions.set("Hydro", 0.0185);
source_emissions.set("Petroleum", 0.957079);
source_emissions.set("Solar", 0.05);
source_emissions.set("Wind", 0.03411);

//Form Elements
let household = document.getElementById("household_form");
let transportation = document.getElementById("transportation");
let special_transportation = document.getElementById("special_transportation");
let food_consumption = document.getElementById("food_consumption");
let waste_and_recycling = document.getElementById("waste_and_recycling");
//

/** START OF HOUSEHOLD CALC */
let house_size_elem = document.getElementById("home_size");
let state_selector_elem = document.getElementById("state_selector");
let energy_source_elem = document.getElementById("electricity_source");
let submit_elem = document.getElementById("submit_house");

const AVERAGE_HOUSE_SIZE = 2600;

let house_size = 0;
let region = "";
let source = "";

let totalWh = 0;
let house_emissions = 0;

submit_elem.onclick = () => {
  if (Number.isNaN(house_size_elem.value) || house_size_elem.value < 120) {
    house_size = AVERAGE_HOUSE_SIZE;
  } else {
    house_size = house_size_elem.value;
  }
  let region_stats = state_region.get(state_selector_elem.value);
  region = region_stats[0];

  if (energy_source_elem.value === "Default") {
    source = region_stats[1];
  } else {
    source = energy_source_elem.value;
  }

  totalWh += house_calculation();

  house_emissions = totalWh * source_emissions.get(source);
  transportation.style.visibility = "visible";
};

let house_calculation = () => {
  let arr = region_rate.get(region);
  let consumption = 0;
  for (let i = 0; i < arr.length; i++) {
    consumption += house_size * arr[i];
  }
  let num_members_of_house = 0;
  if (
    Number.isNaN(document.getElementById("num_members_of_house").value) ||
    document.getElementById("num_members_of_house").value < 120
  ) {
    num_members_of_house = 1;
  } else {
    num_members_of_house = document.getElementById("num_members_of_house")
      .value;
  }
  let otherRate = region_percentages.get(region)[4];
  let otherConsumption = (consumption / (1 - otherRate)) * otherRate;
  consumption += otherConsumption;
  let individual_consumption = consumption / num_members_of_house;
  return individual_consumption;
};

/**END OF HOUSEHOLD CALC */

/**START OF TRANSPORT CALC */
let transport_emissions = 0;

let vehicle_selection_elem = document.getElementById("personal_vehicle");
let vehicleElements = [];

let vehicleVisibility = () => {
  console.log(
    "|||||||||||||||||||| VEHICLE VISIBILITY NOW IN QUESTION ||||||||||||"
  );
  console.log("\t" + document.getElementById("personal_vehicle").value);

  if (vehicle_selection_elem.value === "none") {
    makeVehicleInfoInvisible();
  } else if (vehicle_selection_elem.value === "auto") {
    vehicleAutoVisible();
  } else {
    vehicleElectricVisible();
  }
};

let makeVehicleInfoInvisible = () => {
  console.log("REMOVE VEHICLE ELEMENTS");
  console.log("\t" + document.getElementById("personal_vehicle").value);
  let fe_row = document.getElementById("fuel_eff_row");
  vehicleElements.push(fe_row);
  fe_row.remove();

  let miles_used_row = document.getElementById("mileage");
  vehicleElements.push(miles_used_row);
  miles_used_row.remove();

  let weeks_row = document.getElementById("weeks");
  vehicleElements.push(weeks_row);
  weeks_row.remove();

  let fuel_choices_row = document.getElementById("fuel_choices");
  vehicleElements.push(fuel_choices_row);
  fuel_choices_row.remove();
};

let vehicleAutoVisible = () => {
  console.log("MAKE ALL VEHICLE ELEMENTS VISIBLE AGAIN");
  console.log("\t" + document.getElementById("personal_vehicle").value);

  if (vehicleElements.length > 0) {
    let vehicleForm = document.getElementById("personal");
    let transitForm = document.getElementById("end_of_vehicle_form");
    while (vehicleElements.length > 0) {
      vehicleForm.insertBefore(vehicleElements.shift(), transitForm);
    }
  }

  document.getElementById("FE_Label").innerHTML = "Fuel Economy (MPG)";
};

let vehicleElectricVisible = () => {
  console.log("MAKE EV VEHICLE ELEMENTS VISIBLE AGAIN");
  console.log("\t" + document.getElementById("personal_vehicle").value);

  if (vehicleElements.length > 0) {
    let vehicleForm = document.getElementById("personal");
    let transitForm = document.getElementById("end_of_vehicle_form");
    while (vehicleElements.length > 1) {
      vehicleForm.insertBefore(vehicleElements.shift(), transitForm);
    }
  } else {
    let fuel_choices_row = document.getElementById("fuel_choices");
    let contain_fuel_choices = vehicleElements.includes(fuel_choices_row);
    if (!contain_fuel_choices) {
      vehicleElements.push(fuel_choices_row);
    }
    fuel_choices_row.remove();
  }
  document.getElementById("FE_Label").innerHTML = "Fuel Economy (MPGe)";
};

vehicle_selection_elem.addEventListener("change", vehicleVisibility);

let vehicleEmissions = 0;

let vehicle_emissions_calculation = () => {
  if (vehicle_selection_elem.value === "none") {
    vehicleEmisions = 0;
  } else if ((vehicle_selection_elem.value = "auto")) {
    let fuel_emissions_per_gallon = 0;
    if (document.getElementById("Fuel_Type") === "Diesel") {
      fuel_emissions_per_gallon = 10.18;
    } else {
      fuel_emissions_per_gallon = 8.887;
    }

    let miles_driven =
      document.getElementById("Mileage").value *
      document.getElementById("Weeks_Used").value;
    let mpg = document.getElementById("Fuel_Efficiency").value;

    vehicleEmissions = (miles_driven / mpg) * fuel_emissions_per_gallon;
  } else {
    let fuel_emissions_per_kwh = source_emissions.get(
      document.getElementById("electricity_source").value
    );
    if (Number.isNaN(fuel_emissions_per_kwh)) {
      fuel_emissions_per_kwh = 0.99 * 0.453592;
    }
    let miles_driven =
      document.getElementById("Mileage").value *
      document.getElementById("Weeks_Used").value;
    let miles_per_kwh =
      document.getElementById("Fuel_Efficiency").value * 0.029669188547693;

    vehicleEmissions = (miles_driven / miles_per_kwh) * fuel_emissions_per_kwh;
    if (Number.isNaN(vehicleEmissions)) {
      vehicleEmissions = 0;
    }
  }
};

let transit_emissions = 0;
let transit_elements_list = [];

let transit_type_element = document.getElementById("transit_type");

let eraseTransitElements = () => {
  let transit_mileage = document.getElementById("transit_mileage_row");
  transit_elements_list.push(transit_mileage);
  transit_mileage.remove();

  let transit_weeks = document.getElementById("transit_weeks_row");
  transit_elements_list.push(transit_weeks);
  transit_weeks.remove();
};

let add_transit_element_back_in = () => {
  let transitForm = document.getElementById("transit_form");
  let rideshareForm = document.getElementById("end_of_transit_form");
  for (let i = transit_elements_list.length; i > 0; i--) {
    transitForm.insertBefore(transit_elements_list.shift(), rideshareForm);
  }
};

transit_type_element.onchange = () => {
  if (transit_type_element.value === "none") {
    eraseTransitElements();
  } else {
    add_transit_element_back_in();
  }
};

let transit_emissions_calculation = () => {
  if (transit_type_element.value === "none") {
    transit_emissions = 0;
  } else {
    let CO2_per_mile = 0;
    switch (transit_type_element.value) {
      case "Bus":
        CO2_per_mile = 0.64;
        break;
      case "Heavy Rail":
        CO2_per_mile = 0.22;
        break;
      case "Light Rail":
        CO2_per_mile = 0.36;
        break;
      case "Commuter Rail":
        CO2_per_mile = 0.36;
        break;
      default:
        CO2_per_mile = 0;
        break;
    }

    CO2_per_mile *= 0.453592;

    let miles_transit = document.getElementById("transit_mileage").value;
    let weeks_transit = document.getElementById("weeks_transit_used").value;

    transit_emissions = miles_transit * weeks_transit * CO2_per_mile;
    if (Number.isNaN(transit_emissions)) {
      transit_emissions = 0;
    }
    console.log(transit_emissions);
  }
};

let rideshare_emissions = 0;
let rideshare_elements = [];
let rideshare_select = document.getElementById("ride_share_type");

let make_rideshare_elements_invisible = () => {
  let rideshare_mileage_row = document.getElementById("rideshare_mileage_row");
  rideshare_elements.push(rideshare_mileage_row);
  rideshare_mileage_row.remove();

  let rideshare_weeks_row = document.getElementById("rideshare_weeks_row");
  rideshare_elements.push(rideshare_weeks_row);
  rideshare_weeks_row.remove();
};

let add_rideshare_elements = () => {
  let rideshareForm = document.getElementById("ride_share_form");
  let transport_submit = document.getElementById("end_of_rideshare_form");
  console.log(rideshareForm.firstChild);
  while (rideshare_elements.length > 0) {
    rideshareForm.insertBefore(rideshare_elements.shift(), transport_submit);
  }
};

rideshare_select.onchange = () => {
  if (rideshare_select.value === "none") {
    make_rideshare_elements_invisible();
  } else {
    add_rideshare_elements();
  }
};

let rideshare_emissions_calculation = () => {
  if (rideshare_select.value === "none") {
    rideshare_emissions = 0;
  } else {
    let selection = rideshare_select.value;

    let rideshare_emissions_per_mile =
      selection === "individual" ? 0.5938 : 0.3979;

    let mileage = document.getElementById("rideshare_mileage").value;

    let weeks = document.getElementById("weeks_rideshare_used").value;

    rideshare_emissions = rideshare_emissions_per_mile * mileage * weeks;

    if (Number.isNaN(rideshare_emissions)) {
      vehicleEmissions = 0;
    }
  }
};

document.getElementById("submit_transportation").onclick = () => {
  vehicle_emissions_calculation();
  transit_emissions_calculation();
  rideshare_emissions_calculation();

  transport_emissions =
    vehicleEmissions + transit_emissions + rideshare_emissions;
  special_transportation.style.visibility = "visible";
};

/******END OF TRANSPORTATION */

/** START OF SPECIAL TRANSPORTATION */
let special_emissions = 0;

let flight_emissions = 0;
let flight_calculation = () => {
  let num_flights = document.getElementById("num_flights").value;
  let average_flight_distance = document.getElementById("average_dist_flight")
    .value;

  let flight_mileage = num_flights * average_flight_distance;

  flight_emissions = flight_mileage * 0.24 * 0.453592;

  if (Number.isNaN(flight_emissions)) {
    flight_emissions = 0;
  }
  console.log("Flight Emissions are: " + flight_emissions);
};

let road_trip_emissions = 0;

let road_trip_calculation = () => {
  let num_road_trips = document.getElementById("num_road_trips").value;
  console.log("\t The number of road trips taken is: " + num_road_trips);
  let average_road_trip_dist = document.getElementById("avg_miles_driven")
    .value;
  console.log(
    "\t The average distance of each roadtrip is: " + average_road_trip_dist
  );

  let mpg = document.getElementById("vehicle_mpg").value;
  console.log("\t MPG of the road trip vehicle is: " + mpg);

  let roadtrip_miles = num_road_trips * average_road_trip_dist;
  console.log(
    "\t The number of miles travelled for roadtrips is: " + roadtrip_miles
  );

  let members = document.getElementById("num_road_trippers").value;
  console.log("\t The number of people on each roadtrip is: " + members);

  let emission_factor =
    document.getElementById("RT_Fuel_Type").value === "Gasoline"
      ? 8.887
      : 10.18;

  console.log("\t The emission factor is: " + emission_factor);

  road_trip_emissions = ((roadtrip_miles / mpg) * emission_factor) / members;

  if (Number.isNaN(road_trip_emissions)) {
    road_trip_emissions = 0;
  }

  console.log("Road Trips Emissions are: " + road_trip_emissions);
};

let commuter_bus_emissions = 0;

let bus_calculations = () => {
  let num_bus_trips = document.getElementById("num_bus_trips").value;
  let avg_dist_buses = document.getElementById("avg_distance_per_bus_trip")
    .value;

  commuter_bus_emissions = num_bus_trips * avg_dist_buses * 0.18;
  if (Number.isNaN(commuter_bus_emissions)) {
    commuter_bus_emissions = 0;
  }
  console.log("Long Distance Bus Emissions are: " + commuter_bus_emissions);
};

let commuter_train_emissions = 0;

let train_calculations = () => {
  let num_train_trips = document.getElementById("num_train_trips").value;
  let avg_train_dist = document.getElementById("avg_distance_per_train_trip")
    .value;

  commuter_train_emissions = num_train_trips * avg_train_dist * 0.147870992;
  if (Number.isNaN(commuter_train_emissions)) {
    commuter_train_emissions = 0;
  }
  console.log("Long Distance Train Emissions are: " + commuter_train_emissions);
};

document.getElementById("special_transportation_submit").onclick = () => {
  flight_calculation();
  road_trip_calculation();
  bus_calculations();
  train_calculations();

  special_emissions =
    flight_emissions +
    road_trip_emissions +
    commuter_bus_emissions +
    commuter_train_emissions;
  food_consumption.style.visibility = "visible";
};

/** END OF SPECIAL TRANSPORTATION */

/** START OF DIET EMISSIONS */
let diet_emissions = 0;

let diet_calculations = () => {
  let user_diet = document.getElementById("diet").value;

  let emissions_per_cal = 0;

  switch (user_diet) {
    case "normal":
      emissions_per_cal = 2.72;
      break;
    case "fat":
      emissions_per_cal = 2.97;
      break;
    case "vegetarian":
      emissions_per_cal = 1.18;
      break;
    case "vegan":
      emissions_per_cal = 1.0;
      break;
    default:
      emissions_per_cal = 2.72;
      break;
  }

  let cals_consumed = document.getElementById("calories").value;

  if (Number.isNaN(cals_consumed) || cals_consumed == 0) {
    cals_consumed =
      document.getElementById("sex").value === "male" ? 2500 : 2000;
  }

  diet_emissions = emissions_per_cal * cals_consumed;
  if (Number.isNaN(diet_emissions)) {
    diet_emissions = 0;
  }
  document.getElementById("waste_and_recycling").style.visibility = "visible";
};

document
  .getElementById("diet_submit")
  .addEventListener("click", diet_calculations);

/** End of Diet Emissions */

/** Beginning of Waste Emissions */
let waste_emissions = 0;
let pounds_waste = 0;
let pounds_recycled = 0;
let recycle_rate = 0.343;
let recycle_emissions = 0;

let waste_calc = () => {
  let waste_elem = document.getElementById("waste_level");
  let waste_level = waste_elem.value;
  if (waste_elem.value === "above") {
    pounds_waste = 6.6;
  } else if (waste_elem.value === "avg") {
    pounds_waste = 4.4;
  } else if (waste_elem.value === "below") {
    pounds_waste = 2.2;
  }
  pounds_waste *= 365;
  if (waste_elem.value == null || waste_elem.value === "") {
    console.log("ERROR");
  }
  let recycle_elem = document.getElementById("recycling");
  if (recycle_elem.value === "alot") {
    recycle_rate *= 1.5;
  } else if (recycle_elem.value === "little") {
    recycle_rate *= 0.5;
  }
  if (recycle_elem.value == null || recycle_elem.value === "") {
    console.log("ERROR FOR RECYCLING");
  }

  let pounds_recycled = pounds_waste * recycle_rate;

  waste_emissions = pounds_waste * 54.08462691;
  waste_emissions -= pounds_recycled * 1.95;
  waste_emissions *= 0.0453592;
  if (Number.isNaN(waste_emissions)) {
    waste_emissions = 0;
  }
};
let total_emissions = 0;

document.getElementById("waste_submit").onclick = () => {
  waste_calc();
  document.getElementById("final_consumption").style.visibility = "visible";
  total_emissions =
    house_emissions +
    transport_emissions +
    special_emissions +
    diet_emissions +
    waste_emissions;
  document.getElementById("final_consumption").innerText =
    "Total Estimated Annual Emissions: " + total_emissions + " Kg";
  makeSuggestions();
};

/** End of Waste Emissions */

let makeSuggestions = () => {
  //Household

  let household_recs_count = 0;

  if (document.getElementById("electricity_source").value === "Default") {
    household_recs_count++;
    let household_suggestion_label = document.createElement("label");
    household_suggestion_label.setAttribute("id", "household_suggestion_label");
    household_suggestion_label.setAttribute("class", "suggestion_label");
    household_suggestion_label.innerText =
      "How to Reduce your Footprint from Electricity:";
    document
      .getElementById("suggestions_box")
      .appendChild(household_suggestion_label);

    let household_rec_list = document.createElement("ul");
    household_rec_list.setAttribute("id", "household_rec_list");
    document.getElementById("suggestions_box").appendChild(household_rec_list);
    let house_electricity_source = document.createElement("li");
    house_electricity_source.setAttribute("id", "house_electricity_source");
    house_electricity_source.setAttribute("class", "suggestion");
    house_electricity_source.innerText =
      "Consider switching your household's electricity source to a cleaner alternative";
    document
      .getElementById("household_rec_list")
      .appendChild(house_electricity_source);
  }
  //Transportation
  let transportation_rec_count = 0;
  let transportation_suggestion_label = document.createElement("label");
  transportation_suggestion_label.setAttribute(
    "id",
    "transportation_suggestion_label"
  );
  transportation_suggestion_label.setAttribute("class", "suggestion_label");
  let pub_transport_rec = null;
  let ride_share_type = null;
  let transport_rec_list = document.createElement("ul");
  transport_rec_list.setAttribute("id", "transport_rec_list");

  if (
    document.getElementById("transit_mileage") == null ||
    document.getElementById("transit_mileage").value *
      document.getElementById("weeks_transit_used") <
      document.getElementById("Mileage") * document.getElementById("Weeks_Used")
  ) {
    transportation_rec_count++;
    pub_transport_rec = document.createElement("li");
    pub_transport_rec.setAttribute("id", "pub_transport_rec");
    pub_transport_rec.setAttribute("class", "suggestion");
    pub_transport_rec.innerText =
      "Consider using public transportation more often, especially for your daily commute";
  }

  if (document.getElementById("ride_share_type").value === "individual") {
    transportation_rec_count++;
    ride_share_type = document.createElement("li");
    ride_share_type.setAttribute("id", "ride_share_type");
    ride_share_type.setAttribute("class", "suggestion");
    ride_share_type.innerText =
      "When possible, considering choosing the pool option on your rideshare of choice";
  }

  if (transportation_rec_count > 0) {
    document
      .getElementById("suggestions_box")
      .appendChild(transportation_suggestion_label);
    document.getElementById("suggestions_box").appendChild(transport_rec_list);
    document.getElementById("transportation_suggestion_label").innerText =
      "Suggestions in your Transportation use to reduce your carbon emissions";
    if (pub_transport_rec != null) {
      document
        .getElementById("transport_rec_list")
        .appendChild(pub_transport_rec);
    }
    if (ride_share_type != null) {
      document
        .getElementById("transport_rec_list")
        .appendChild(ride_share_type);
    }
  }

  //Special Transportation
  if (
    ((Number.isNaN(document.getElementById("num_road_trips").value) ||
      Number.isNaN(document.getElementById("num_bus_trips").value) ||
      Number.isNaN(document.getElementById("num_train_trips").value)) &&
      !Number.isNaN(document.getElementById("num_flights").value)) ||
    document.getElementById("num_flights").value *
      document.getElementById("average_dist_flight").value <
      (document.getElementById("num_road_trips").value *
        document.getElementById("avg_miles_driven").value) /
        document.getElementById("num_road_trippers").value +
        document.getElementById("num_bus_trips").value *
          document.getElementById("avg_distance_per_bus_trip").value +
        document.getElementById("num_train_trips").value *
          document.getElementById("avg_distance_per_train_trip").value
  ) {
    let special_transportation_suggestion_label = document.createElement(
      "label"
    );
    special_transportation_suggestion_label.setAttribute(
      "id",
      "special_transportation_suggestion_label"
    );
    special_transportation_suggestion_label.setAttribute(
      "class",
      "suggestion_label"
    );
    document
      .getElementById("suggestions_box")
      .appendChild(special_transportation_suggestion_label);
    document.getElementById(
      "special_transportation_suggestion_label"
    ).innerText =
      "Suggestions in your Special Transportation use to reduce your carbon emission";
    let spec_transport_rec_list = document.createElement("ul");
    spec_transport_rec_list.setAttribute("id", "spec_transport_rec_list");
    document
      .getElementById("suggestions_box")
      .appendChild(spec_transport_rec_list);
    let special_transportation_suggestion = document.createElement("li");
    special_transportation_suggestion.setAttribute(
      "id",
      "special_transportation_suggestion"
    );
    special_transportation_suggestion.setAttribute("class", "suggestion");
    special_transportation_suggestion.innerText =
      "Considering replacing some of your long distance flights with alternative modes of transportation.";
    document
      .getElementById("spec_transport_rec_list")
      .appendChild(special_transportation_suggestion);
  }

  //Diet

  if (
    document.getElementById("diet").value !== "vegetarian" &&
    document.getElementById("diet").value !== "vegan"
  ) {
    let diet_suggestions_label = document.createElement("label");
    diet_suggestions_label.setAttribute("id", "diet_suggestions_label");
    diet_suggestions_label.setAttribute("class", "suggestion_label");
    document
      .getElementById("suggestions_box")
      .appendChild(diet_suggestions_label);
    document.getElementById("diet_suggestions_label").innerText =
      "Suggestions in your Diet to reduce your Carbon Emissions";
    let diet_rec_list = document.createElement("ul");
    diet_rec_list.setAttribute("id", "diet_rec_list");
    document.getElementById("suggestions_box").appendChild(diet_rec_list);
    let diet_suggestion = document.createElement("li");
    diet_suggestion.setAttribute("id", "diet_suggestion");
    diet_suggestion.setAttribute("class", "suggestion");
    diet_suggestion.innerText =
      "Considered reducing your meat consumption and attempt to incorporate more plant-based foods into your diet.";
    document.getElementById("diet_rec_list").appendChild(diet_suggestion);
  }

  //Waste and Recycling
  let waste_counter = 0;
  let waste_suggestion_label = document.createElement("label");
  waste_suggestion_label.setAttribute("id", "waste_suggestion_label");
  waste_suggestion_label.setAttribute("class", "suggestion_label");
  waste_suggestion_label.innerText =
    "Suggestions in your waste and recycling to reduce your Carbon Emissions";
  let waste_rec_list = document.createElement("ul");
  waste_rec_list.setAttribute("id", "waste_rec_list");
  let waste_amount = "null";
  let recyle_amount = "null";

  if (document.getElementById("waste_level").value === "above") {
    waste_counter++;
    waste_amount = document.createElement("li");
    waste_amount.setAttribute("id", "waste_amount");
    waste_amount.setAttribute("class", "suggestion");
    waste_amount.innerText =
      "Consider reducing the amount of trash you create through one-time use products";
  } else if (document.getElementById("waste_level").value === "avg") {
    waste_counter++;
    waste_amount = document.createElement("li");
    waste_amount.setAttribute("id", "waste_amount");
    waste_amount.innerText =
      "Consider reusing products, such as reusing old containers or plastic bags rather than disposing or recycling them";
  }

  if (document.getElementById("recycling").value !== "little") {
    waste_counter++;
    recyle_amount = document.createElement("li");
    recyle_amount.setAttribute("id", "recyle_amount");
    recyle_amount.setAttribute("class", "suggestion");
    recyle_amount.innerText =
      "Try to systematically recycle more of your products on a daily basis";
  }

  if (waste_counter > 0) {
    document
      .getElementById("suggestions_box")
      .appendChild(waste_suggestion_label);
    document.getElementById("suggestions_box").appendChild(waste_rec_list);
    if (waste_amount !== "null") {
      document.getElementById("waste_rec_list").appendChild(waste_amount);
    }

    if (recyle_amount !== "null") {
      document.getElementById("waste_rec_list").appendChild(recyle_amount);
    }
  }

  document.getElementById("suggestions_box").style.visibility = "visible";
};

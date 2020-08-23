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
region_rate.set("cold", [0.337361273629739, 6.88340800506917, 2.17273040447777, 0.328076100961031]);
region_rate.set("mixed-humid", [0.924214657537206, 4.99244721400235, 2.13117991806525, 0.358713451555536]);
region_rate.set("hot-dry", [1.03761046281085, 1.89536844540116, 2.54560433542929, 0.456548603636776]);
region_rate.set("hot-humid", [2.38337495216227, 2.01443146111548, 1.82258084577114, 0.442732189256148]);
region_rate.set("marine", [0.118734908519293, 3.01586667639004, 2.56467402401672, 0.4274456706694540]);

let region_percentages = new Map();
//Air Conditioning, Space Heating, Water Heating, Refrigerators, Other
region_percentages.set("cold", [.02797, .56871, .17945, .02710, .1967782217782220]);
region_percentages.set("mixed-humid", [.08351, .45054, .19227, .03238, .2412939001848430]);
region_percentages.set("hot-dry", [.12485, .22712, .30076, .05394, .2933333333333330]);
region_percentages.set("hot-humid", [.24806, .21034, .18921, .04600, .3063829787234040]);
region_percentages.set("marine", [.01702, .38665, .32513, .05419, .2170157068062830]);

let source_emissions = new Map();

source_emissions.set("Coal", 1.002438);
source_emissions.set("Nuclear", .004);
source_emissions.set("Natural Gas", .412769);
source_emissions.set("Hydro", .0185);
source_emissions.set("Petroleum", .957079);
source_emissions.set("Solar", .05);
source_emissions.set("Wind", .03411);

//Form Elements
let household = document.getElementById("household_form");
let transportation = document.getElementById("transportation");
let special_transportation = document.getElementById("special_transportation");
let food_consumption = document.getElementById("food_consumption");
let waste_and_recycling = document.getElementById("waste_and_recycling");
//

//
let household_done = false;
let transport_done = false;
let special_done = false;
let food_done = false;
//
let house_size_elem = document.getElementById("home_size");
let state_selector_elem = document.getElementById("state_selector")
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
    alert("house_size is: " + house_size);
    let region_stats = state_region.get(state_selector_elem.value);
    region = region_stats[0];
    alert("Region is: " + region);

    if (energy_source_elem.value === "Default") {
        source = region_stats[1];
    } else {
        source = energy_source_elem.value;
    }

    alert("Source of Electricity: " + source);

    totalWh += house_calculation();

    alert("Total wH is: " + totalWh);
    house_emissions = totalWh * source_emissions.get(source);
    alert(house_emissions);
    transportation.style.visibility = 'visible';
    document.getElementById("transportation").style.visibility = 'visible';
    household_done = true;
};


let house_calculation = () => {
    let arr = region_rate.get(region);
    let consumption = 0;
    for (let i = 0; i < arr.length; i++) {

        consumption += house_size * arr[i];
    }
    let num_members_of_house = 0;
    if (Number.isNaN(document.getElementById("num_members_of_house").value) || document.getElementById("num_members_of_house").value < 120) {
        num_members_of_house = 1;
    } else {
        num_members_of_house = document.getElementById("num_members_of_house").value;
    }
    let otherRate = region_percentages.get(region)[4];
    let otherConsumption = consumption / (1 - otherRate) * otherRate;
    consumption += otherConsumption;
    let individual_consumption = consumption / num_members_of_house;
    return individual_consumption;
};
if (household_done) {
    transportation.style.visibility = 'visible';
}
let vehicle_selection_elem = document.getElementById("personal_vehicle");
let vehicleElements = [];
let submit_vehicle_master = document.getElementById("submit_vehicle");

let vehicleVisibility = () => {
    if (vehicle_selection_elem.value === "none") {
        makeVehicleInfoInvisible();
    } else if (vehicle_selection_elem.value === "auto") {
        vehicleAutoVisible();
    } else {
        vehicleElectricVisible();
    }
}

let makeVehicleInfoInvisible = () => {
    let fe_label = document.getElementById("FE_Label");
    vehicleElements.push(fe_label);
    fe_label.remove();

    let fuel_eff = document.getElementById("Fuel_Efficiency");
    vehicleElements.push(fuel_eff);
    fuel_eff.remove();

    let br2 = document.getElementById("br2");
    vehicleElements.push(br2);
    br2.remove();

    let m_label = document.getElementById("M_Label");
    vehicleElements.push(m_label);
    m_label.remove();

    let mileage = document.getElementById("Mileage");
    vehicleElements.push(mileage);
    mileage.remove();

    let br3 = document.getElementById("br3");
    vehicleElements.push(br3);
    br3.remove();

    let weeks_label = document.getElementById("Weeks_Label");
    vehicleElements.push(weeks_label);
    weeks_label.remove();

    let weeks = document.getElementById("Weeks_Used");
    vehicleElements.push(weeks);
    weeks.remove();

    let br4 = document.getElementById("br4");
    vehicleElements.push(br4);
    br4.remove();

    let fuel_type_label = document.getElementById("FT_Label");
    vehicleElements.push(fuel_type_label);
    fuel_type_label.remove();

    let fuel_t = document.getElementById("Fuel_Type");
    vehicleElements.push(fuel_t);
    fuel_t.remove();

    let br5 = document.getElementById("br5");
    vehicleElements.push(br5);
    br5.remove();
}

let vehicleAutoVisible = () => {

    if (vehicleElements.length > 0) {
        let vehicleForm = document.getElementById("personal");
        while (vehicleElements.length > 0) {
            vehicleForm.insertBefore(vehicleElements.shift(), submit_vehicle_master);
        }
    }


    document.getElementById("FE_Label").innerHTML = "Fuel Economy (MPG)";

}

let vehicleElectricVisible = () => {

    if (vehicleElements.length > 0) {
        let vehicleForm = document.getElementById("personal");
        while (vehicleElements.length > 2) {
            vehicleForm.insertBefore(vehicleElements.shift(), submit_vehicle_master);
        }
    } else {
        let fuel_type_label = document.getElementById("FT_Label");
        let lab_contain = vehicleElements.includes(fuel_type_label);
        if (!lab_contain) {
            vehicleElements.push(fuel_type_label);
        }

        fuel_type_label.remove();

        let fuel_type_input = document.getElementById("Fuel_Type");
        let input_contain = vehicleElements.includes(fuel_type_input);
        if (!input_contain) {
            vehicleElements.push(fuel_type_input);
        }

        fuel_type_input.remove();

        let br5 = document.getElementById("br5");
        let br_contain = vehicleElements.includes(br5);
        if (!br_contain) {
            vehicleElements.push(br5);
        }

        br5.remove();
    }
    document.getElementById("FE_Label").innerHTML = "Fuel Economy (MPGe)";
}


vehicle_selection_elem.addEventListener("mouseleave", vehicleVisibility);


let vehicleEmissions = 0;

let vehicleSubmit = document.getElementById("submit_vehicle");

vehicleSubmit.onclick = () => {
    if (vehicle_selection_elem.value === "none") {
        vehicleEmisions = 0;
    } else if (vehicle_selection_elem.value = "auto") {
        let fuel_emissions_per_gallon = 0;
        if (document.getElementById("Fuel_Type") === "Diesel") {
            fuel_emissions_per_gallon = 10.180;
        } else {
            fuel_emissions_per_gallon = 8.887;
        }

        let miles_driven = document.getElementById("Mileage").value * document.getElementById("Weeks_Used").value;
        let mpg = document.getElementById("Fuel_Efficiency").value;

        vehicleEmissions = miles_driven / mpg * fuel_emissions_per_gallon;
    } else {
        let fuel_emissions_per_kwh = source_emissions.get(document.getElementById("electricity_source").value);
        if (Number.isNaN(fuel_emissions_per_kwh)) {
            fuel_emissions_per_kwh = .99 * 0.453592;
        }
        let miles_driven = document.getElementById("Mileage").value * document.getElementById("Weeks_Used").value;
        let miles_per_kwh = document.getElementById("Fuel_Efficiency").value * 0.029669188547693;

        vehicleEmissions = miles_driven / miles_per_kwh * fuel_emissions_per_kwh;
    }

}

let transit_emissions = 0;
let transit_elements_list = [];

let transit_type_element = document.getElementById("transit_type");

let eraseTransitElements = () => {
    let transit_mileage_label_element = document.getElementById("transit_mileage_label");
    transit_elements_list.push(transit_mileage_label_element);
    transit_mileage_label_element.remove();

    let transit_mileage_element = document.getElementById("transit_mileage");
    transit_elements_list.push(transit_mileage_element);
    transit_mileage_element.remove();

    let transit_weeks_used_label_element = document.getElementById("transit_weeks_used_label");
    transit_elements_list.push(transit_weeks_used_label_element);
    transit_weeks_used_label_element.remove();

    let weeks_transit_used_element = document.getElementById("weeks_transit_used");
    transit_elements_list.push(weeks_transit_used_element);
    weeks_transit_used_element.remove();
}

let add_transit_element_back_in = () => {
    let transitForm = document.getElementById("transit_form");
    let submit_transit_button = document.getElementById("submit_transit");
    for (let i = transit_elements_list.length; i > 0; i--) {
        transitForm.insertBefore(transit_elements_list.shift(), submit_transit_button);
    }

}

transit_type_element.onmouseleave = () => {
    if (transit_type_element.value === "none") {
        eraseTransitElements();
    } else {
        add_transit_element_back_in();
    }
}

let calculate_transit_emissions = () => {
    if (transit_type_element.value === 'none') {
        transit_emissions = 0;
    } else {
        let CO2_per_mile = 0;
        switch (transit_type_element.value) {
            case "Bus":
                CO2_per_mile = .64;
                break;
            case "Heavy Rail":
                CO2_per_mile = .22;
                break;
            case "Light Rail":
                CO2_per_mile = .36;
                break;
            case "Commuter Rail":
                CO2_per_mile = .36;
                break;
            default:
                CO2_per_mile = 0;
                break;
        }

        CO2_per_mile *= 0.453592;

        let miles_transit = document.getElementById("transit_mileage").value;
        let weeks_transit = document.getElementById("weeks_transit_used").value;

        transit_emissions = miles_transit * weeks_transit * CO2_per_mile;

        console.log(transit_emissions);
    }

}

let transit_submit = document.getElementById("submit_transit");
transit_submit.addEventListener("click", calculate_transit_emissions);

let rideshare_emissions = 0;
let rideshare_elements = [];
let rideshare_select = document.getElementById("ride_share_type");

let make_rideshare_elements_invisible = () => {
    let rideshare_mileage_label = document.getElementById("rideshare_mileage_label");
    rideshare_elements.push(rideshare_mileage_label);
    rideshare_mileage_label.remove();

    let rideshare_mileage = document.getElementById("rideshare_mileage");
    rideshare_elements.push(rideshare_mileage);
    rideshare_mileage.remove();

    let rideshare_week_label = document.getElementById("rideshare_weeks_used_label");
    rideshare_elements.push(rideshare_week_label);
    rideshare_week_label.remove();

    let rideshare_week = document.getElementById("weeks_rideshare_used");
    rideshare_elements.push(rideshare_week);
    rideshare_week.remove();
}

let add_rideshare_elements = () => {
    let rideshareForm = document.getElementById("ride_share_form");
    let rideshare_submit = document.getElementById("submit_rideshare");
    console.log(rideshareForm.firstChild);
    while (rideshare_elements.length > 0) {
        rideshareForm.insertBefore(rideshare_elements.shift(), rideshare_submit);
    }
}

rideshare_select.onmouseleave = () => {
    if (rideshare_select.value === "none") {
        make_rideshare_elements_invisible();
    } else {
        add_rideshare_elements();
    }
}

let rideshare_emissions_calculation = () => {
    if (rideshare_select.value === "none") {
        rideshare_emissions = 0;
    } else {
        let selection = rideshare_select.value;

        let rideshare_emissions_per_mile = (selection === "individual") ? .5938 : .3979;

        let mileage = document.getElementById("rideshare_mileage").value;

        let weeks = document.getElementById("weeks_rideshare_used").value;

        rideshare_emissions = rideshare_emissions_per_mile * mileage * weeks;
    }

}

document.getElementById("submit_rideshare").addEventListener("click", rideshare_emissions_calculation);

let flight_emissions = 0;
let flight_calculation = () => {
    let num_flights = document.getElementById("num_flights").value;
    let average_flight_distance = document.getElementById("average_dist_flight").value;

    let flight_mileage = num_flights * average_flight_distance;

    flight_emissions = flight_mileage * 0.24 * 0.453592;
}

document.getElementById("flight_submit").addEventListener("click", flight_calculation);

let road_trip_emissions = 0;

let road_trip_calculation = () => {
    let num_road_trips = document.getElementById("num_road_trips").value;
    let average_road_trip_dist = document.getElementById("avg_miles_driven").value;

    let mpg = document.getElementById("vehicle_mpg").value;

    let roadtrip_miles = num_road_trips * average_road_trip_dist;
    let members = document.getElementById("num_road_trippers").value;
    let emission_factor = (document.getElementById("RT_Fuel_Type").value === "Gasoline") ? 8.887 : 10.180;
    road_trip_emissions = roadtrip_miles / mpg * emission_factor / members;
}

document.getElementById("road_trip_submit").addEventListener("click", road_trip_calculation);

let commuter_bus_emissions = 0;

let bus_calculations = () => {
    let num_bus_trips = document.getElementById("num_bus_trips").value;
    let avg_dist_buses = document.getElementById("avg_distance_per_bus_trip").value;

    commuter_bus_emissions = num_bus_trips * avg_dist_buses * .18;
}

document.getElementById("commuter_bus_submit").addEventListener("click", bus_calculations);

let commuter_train_emissions = 0;

let train_calculations = () => {
    let num_train_trips = document.getElementById("num_train_trips").value;
    let avg_train_dist = document.getElementById("avg_distance_per_train_trip").value;

    commuter_train_emissions = num_train_trips * avg_train_dist * .147870992;
}

document.getElementById("commuter_train_submit").addEventListener("click", train_calculations);

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
            emissions_per_cal = 1.00;
            break;
        default:
            emissions_per_cal = 2.72;
            break;
    }

    let cals_consumed = document.getElementById("calories").value;

    if (Number.isNaN(cals_consumed) || cals_consumed == 0) {
        cals_consumed = (document.getElementById("sex").value === "male") ? 2500 : 2000;
    }

    diet_emissions = emissions_per_cal * cals_consumed;
}

document.getElementById("diet_submit").addEventListener("click", diet_calculations);

let waste_emissions = 0;
let pounds_waste = 0;
let pounds_recycled = 0;
let recycle_rate = .343;
let recycle_emissions = 0;

let waste_calc = () => {
    let waste_elem = document.getElementById("waste_level");
    //alert(waste_elem.value == "" ? "WHY is This Elem NoT shOwinG uP" : waste_elem.value);
    let waste_level = waste_elem.value;
    if (waste_elem.value === "above") {
        pounds_waste = 6.6;
    } else if (waste_elem.value === "avg") {
        pounds_waste = 4.4;
    } else if (waste_elem.value === "below") {
        pounds_waste = 2.2;
    }
    pounds_waste *= 365;
    //alert("Pounds of Waste: " + pounds_waste);
    if (waste_elem.value == null || waste_elem.value === "") {
        console.log("ERROR");
    }
    let recycle_elem = document.getElementById("recycling");
    //alert(recycle_elem.value === "" ? "Why is this recycle selection not working?" : recycle_elem.value);
    if (recycle_elem.value === "alot") {
        recycle_rate *= 1.5;
    } else if (recycle_elem.value === "little") {
        recycle_rate *= .5;
    }
    if (recycle_elem.value == null || recycle_elem.value === "") {
        console.log("ERROR FOR RECYCLING");
    }

    let pounds_recycled = pounds_waste * recycle_rate;

    //alert("Pounds Recycled: " + pounds_recycled);
    waste_emissions = pounds_waste * 54.08462691;
    waste_emissions -= pounds_recycled * 1.95;
    waste_emissions *= 0.0453592;
    //alert(waste_emissions + "KG of CO2");
}

document.getElementById("waste_submit").addEventListener("onclick", waste_calc());
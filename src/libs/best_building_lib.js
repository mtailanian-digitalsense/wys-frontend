const min_scale = 1;
const max_scale = 10;
const factor = 10
Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

Array.prototype.min = function() {
    return Math.min.apply(null, this);
};

export function set_average(buildings_data, criteria){
    var scaled_buildings_data = scale_buildings_rent_values(buildings_data);
    let averages = find_best_building(criteria, scaled_buildings_data);
    let returnedObj = {
        result: [],
        bestOption: averages[0]
    }

    for(let i = 0; i < scaled_buildings_data.length; i++){
        let indexAvg = averages[1].findIndex(x => x.id === scaled_buildings_data[i].id)
        scaled_buildings_data[i].average = averages[1][indexAvg].average.toFixed(1)
    }

    returnedObj.result = scaled_buildings_data
    return returnedObj
}

export function scale_buildings_rent_values(buildings_data){
    if (buildings_data.length === 1) {
        buildings_data[0].data[0] = 10
    } else {
        var rent_values = buildings_data.map(function(x) {
            return x.data[0];
        });
    
        var better_rent= rent_values.max();
        var worst_rent = rent_values.min();
        var scaled_rent_values = rent_values.map(function(x) {
            return Number(((((x-worst_rent)/(better_rent-worst_rent))*(max_scale-min_scale)) + 1).toFixed(0));
        });
        
        for(let i = 0; i < scaled_rent_values.length; i++){ 
            buildings_data[i].data[0] = scaled_rent_values[i]
        }
    }
    
    return buildings_data

}

export function find_best_building(criteria, std_buildings_data){
    var criteria_sum = criteria.reduce((a, b) => a + b, 0);
    
    var weighted_averages =[];
    for(let i = 0; i < std_buildings_data.length; i++){
        let weighted_sum = 0
        for(let j = 0; j < std_buildings_data[i].data.length; j++){
            weighted_sum = weighted_sum + std_buildings_data[i].data[j]*criteria[j]
        }
        weighted_averages.push({average: Number((weighted_sum/criteria_sum)), id: std_buildings_data[i].id})
    }
    let allAvg = weighted_averages.map(avg=>avg.average)
    var best_building_index = allAvg.indexOf(Math.max(...allAvg));

    return [best_building_index, weighted_averages];
}
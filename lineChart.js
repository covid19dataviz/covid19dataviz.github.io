var stateData = null;
d3.json("assets/knowledge/covid-data/states_data.json", function(error, data) {
    stateData = data;
});

/**
 * 
 * @param {String Abbrivation in Caps} state 
 */
function getCumulitiveDataForState(state) {
    return stateData[state]["cumulitive_data"];
}

/**
 * 
 * @param {String Abbrivation in Caps} state 
 * @param {String YYYY-mm-dd format} date 
 */
function getStateDataForDate(state, date) {
    return stateData[state]["date_data"][date];
}


// Set the dimensions of the canvas / graph
var	margin = {top: 30, right: 20, bottom: 30, left: 50},
	width = 600 - margin.left - margin.right,
	height = 270 - margin.top - margin.bottom;
 
// Parse the date / time
var	parseDate = d3.time.format("%Y%m%d").parse;
 
// Set the ranges
var	x = d3.time.scale().range([0, width]);
var	y = d3.scale.linear().range([height, 0]);
 
// Define the axes
var	xAxis = d3.svg.axis().scale(x)
	.orient("bottom").ticks(5);
 
var	yAxis = d3.svg.axis().scale(y)
	.orient("left").ticks(5);
 
// Define the line
var	valueline = d3.svg.line()
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.positive); });
    
// Adds the svg canvas
var	svg = d3.select("body")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/**
 * 
 * @param {String Abrrivation in Caps} state 
 */
function drawLineChartForState(state) {
	d3.csv("assets/knowledge/covid-data/states/"+state+".csv", function(error, data) {
        //Code for line chart
        data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.positive = +d.positive;
        });
     
        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.positive; })]);
     
        // Add the valueline path.
        svg.append("path")	
            .attr("class", "line")
            .attr("d", valueline(data));
     
        // Add the X Axis
        svg.append("g")		
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
     
        // Add the Y Axis
        svg.append("g")		
            .attr("class", "y axis")
            .call(yAxis);
	});
}


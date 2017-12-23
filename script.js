// margin conventions
let margin = { top: 20, right: 30, bottom: 30, left: 30 };
let constant = {
	width: 600 - margin.left - margin.right,
	height: 325 - margin.top - margin.bottom,
	x: d3.scaleBand().rangeRound([0, 600 - margin.right]).padding(0.05),
	y: d3.scaleLinear().rangeRound([500 - margin.top - margin.bottom, 0])
};

let menu = document.querySelector('.state-menu');
let svg =  d3.select('.chart-container');
let slopeElem = svg.append('g').attr('class', 'slope-chart').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
let rangeElem = svg.append('g').attr('class', 'year-range').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


function loadData() {
	d3.json('data.json', function(err, targetData) {
		if(err) throw err;

		// load data object into data module
		data.source = targetData;
		// initialize year helper array in order to draw range
		data.years = data.source[0].data.map((entry) => entry.year);
		// initialize range selected array to zero
		data.range = data.source[0].data.map((entry) => false);

		draw.dropdown();
		draw.slopeChart();
		draw.range();
	});
};

let data = function() {
	let dataSource = {};

	let targetRange = [];

	// defines initialized value of drop down state value
	let targetState = 'Alabama';

	// defines all years in the data object
	let allYears = [];

	let chartColorsArr = ['#80b1d3', '#fb8072', '#bebada', '#ffffb3', '#8dd3c7', '#a6d854', '#e78ac3', '#8da0cb', '#fc8d62', '#66c2a5', '#fb9a99', '#33a02c', '#b2df8a', '#1f78b4', '#a6cee3', '#decbe4'];


	return {
		source: dataSource,
		range: targetRange,
		state: targetState,
		years: allYears
	}
}();

let draw = function() {
	function drawDropdown() {

		for(let i = 0; i < data.source.length; i++){
			let newElem = document.createElement('option');
			newElem.setAttribute('class', 'state-options')
			newElem.setAttribute('data-menu-id', i);
			newElem.textContent = data.source[i].state;
			menu.appendChild(newElem);
		}

	}

	function drawSlopeChart() {

	}

	function drawRange() {

		constant.x.domain(data.years);

		//define x axis
		rangeElem.append('g')
			.attr('class', 'x-axis')
			.style('stroke-width', '.5')
			.attr('transform', 'translate(-15,' + constant.height + ')')
		.call(d3.axisBottom(constant.x).tickSizeOuter(0).tickSizeInner(0));

		rangeElem.append('g')
			.selectAll('.circles')
			.data(data.years)
			.enter()
			.append('circle')
			.attr('class', 'circles')
			.attr('r', 8)
			.attr('cy', 275)
			.attr('cx', function(d,) { return constant.x(d); } )
			.attr('fill', 'white')
			.attr('stroke', 'black')
			.attr('stroke-width', '.5px');

		// transform text on x axis
		rangeElem.selectAll('.x-axis text')
			.style('transform', 'translateY(20px)translateX(-9px) rotate(-45deg)');

	}

	return {
		dropdown: drawDropdown,
		slopeChart: drawSlopeChart,
		range: drawRange

	};
}();

let update = function() {
	
	function updateRangeVals() {

	}

	function updateSlopeChart() {

	}

	function updateStateVal() {

	}

	return {
		rangeVals: updateRangeVals,
		slopeChart: updateSlopeChart,
		stateVal: updateStateVal
	};
}();

loadData();

// todos
// 1 - add initialized year values
// 2 - allow user behavior to change targetState and targetYears
// 3 - add instructions to range element
// 4 - create slope chart container
// 5 - create slope chart connectors
// 6 - create transitions with range changes
// 7 - add tooltip or accentuate info on hover
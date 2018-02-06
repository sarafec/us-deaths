// margin conventions
const margin = { top: 20, right: 30, bottom: 30, left: 30 };
const constant = {
	width: 600 - margin.left - margin.right,
	height: 325 - margin.top - margin.bottom,
	x: d3.scaleBand().rangeRound([0, 600 - margin.right]).padding(0.05),
	y: d3.scaleLinear().rangeRound([500 - margin.top - margin.bottom, 0])
};

const menu = document.querySelector('.state-menu');
const svg =  d3.select('.chart-container');
const slopeElem = svg.append('g').attr('class', 'slope-chart').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
const gridLinesArea = svg.append('g').attr('class', 'grid-lines').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
const rangeElem = svg.append('g').attr('class', 'year-range').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


function loadData() {
	d3.json('data.json', function(err, targetData) {
		if(err) throw err;

		// load data object into data module
		data.source = targetData;
		// initialize year helper array in order to draw range
		data.years = data.source[0].data.map((entry) => entry.year);
		// initialize range selected array
		data.range = data.source[0].data.map((entry, index, arr) => index % 5 === 0 ? true : false);

		draw.dropdown();
		draw.range();
		draw.userInstructions();
	});
};

const data = function() {
	let dataSource = {};

	// defines initialized value of drop down state value
	let targetState = 'Alabama';

	// defines all years in the data object
	let allYears = [];

	// define year choices
	let chosenYears = [];

	let yearsLeft = 5;

	let chartColorsArr = ['#80b1d3', '#fb8072', '#bebada', '#ffffb3', '#8dd3c7', '#a6d854', '#e78ac3', '#8da0cb', '#fc8d62', '#66c2a5', '#fb9a99', '#33a02c', '#b2df8a', '#1f78b4', '#a6cee3', '#decbe4'];


	return {
		source: dataSource,
		state: targetState,
		years: allYears,
		chosenYears: chosenYears,
		yearsLeft: yearsLeft
	}
}();

const draw = function() {
	function drawDropdown() {

		for(let i = 0; i < data.source.length; i++){
			let newElem = document.createElement('option');
			newElem.setAttribute('class', 'state-options')
			newElem.setAttribute('data-menu-id', i);
			newElem.textContent = data.source[i].state;
			menu.appendChild(newElem);
		}

	}

	function makeGridlines() {
		console.log(data.chosenYears);
		return d3.axisBottom(constant.x)
			.ticks(data.chosenYears.length);
	}

	function drawGridLines() {
		constant.x.domain(data.chosenYears);

		gridLinesArea.append('g')
			.attr('class', 'grid')
			.attr("transform", "translate(-15," + constant.height + ")")
			.call(makeGridlines()
				.tickSize(-constant.height)
				.tickFormat("")
			)

		const domainPath = document.querySelector('.grid .domain');
		const gridArea = document.querySelector('.grid');
		gridArea.removeChild(domainPath);
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
			.attr('data-year', function(d) { return d; })
			.attr('r', 8)
			.attr('cy', 275)
			.attr('cx', function(d) { return constant.x(d); } )
			.attr('fill', 'white')
			.attr('stroke', 'black')
			.attr('stroke-width', '.5px');

		// transform text on x axis
		rangeElem.selectAll('.x-axis text')
			.style('transform', 'translateY(20px)translateX(-9px) rotate(-45deg)');

		update.rangeVals();

	}

	function drawUserInstructions() {
		const userInstructionArea = document.querySelector('.user-instructions');

		if(data.yearsLeft === 0) {
			userInstructionArea.textContent = 'Unselect a year to change the year';
		} else if (data.yearsLeft === 1) {
			userInstructionArea.textContent = `Select ${data.yearsLeft} more year`;
		} else {
			userInstructionArea.textContent = `Select ${data.yearsLeft} more years`;
		}
	}

	return {
		dropdown: drawDropdown,
		gridLines: drawGridLines,
		range: drawRange,
		userInstructions: drawUserInstructions

	};
}();

const update = function() {
	
	function updateYear(evt) {
		const elem = evt.target;
		const elemYear = evt.target.dataset.year;

		if(helper.yearAlreadySelected(elem)){
			let yearIndex = data.chosenYears.indexOf(elemYear);
			elem.classList.toggle('selected');
			data.chosenYears.splice(yearIndex, 1);
			data.yearsLeft++;
		} else if(data.yearsLeft > 0 && data.yearsLeft <= 5) {
			elem.classList.toggle('selected');
			data.chosenYears.push(elemYear);
			data.yearsLeft--;
		}

		draw.userInstructions();
		update.gridLines();
	}

	function updateState(evt) {
		data.state = evt.target.value;
	}

	function updateRangeVals() {
		// given rangeArea, iterate through
		// change fill color fo those year values

	}

	function updateGridlines() {
		const gridLines = document.querySelector('.grid-lines');

		while(gridLines.firstChild) {
			gridLines.removeChild(gridLines.firstChild);
		}

		draw.gridLines();

	}

	return {
		year: updateYear,
		state: updateState,
		rangeVals: updateRangeVals,
		gridLines: updateGridlines
	};
}();

const helper = function() {
	function yearAlreadySelected(elem) {
		return elem.classList.contains('selected') ? true : false;
	}

	return {
		yearAlreadySelected: yearAlreadySelected
	}

}();

loadData();


/** BROWSER EVENTS  **/
const rangeArea = document.querySelector('.year-range');
rangeArea.addEventListener('click', update.year);
const stateArea = document.querySelector('.state-menu');
stateArea.addEventListener('change', update.state);

// todos
// 1 - create single slope chart region
// 2 - create multiple slope chart regions
// 3 - add path connectors to the slope chart regions
// 4 - add transitions to the slope chart regions and paths
// 5 - add tooltip for more details
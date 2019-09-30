// @TODO: YOUR CODE HERE!
// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }
 
  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var margin = {
    top: 50,
    bottom: 50,
    right: 50,
    left: 50
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // Append SVG element
  var svg = d3
    .select(".scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  // Append group element
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    

  // Read CSV
  d3.csv('assets/data/data.csv').then(function(fullData) {
    fullData.forEach(function(data) {
    data.healthcare = +data.healthcare;
    console.log(data.healthcare);
    //if (!data.healthcare) {data.healthcare = 0};
    data.obesity = +data.obesity;
    //console.log(fullData);
    data.state = data.state;
    data.abbr = data.abbr;
  });

labelArea = 30;

    
      // create scales
      var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(fullData, d => d.obesity))
        .range([margin.left + labelArea, width - margin.right]);

      var yLinearScale = d3.scaleLinear()
        .domain(d3.extent(fullData, d => d.healthcare))
        .range([height- margin.top - labelArea, margin.bottom]);

      // create axes
      var xAxis = d3.axisBottom(xLinearScale);
      var yAxis = d3.axisLeft(yLinearScale);

      
      

      // append circles
      var circles = 
      chartGroup
        .selectAll("circle")
        .data(fullData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.obesity))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 15)
        .attr("fill", "blue")
        .attr("opacity", ".6");
        //.attr("class", "stateCircle");
        circles
        chartGroup.selectAll("text")
        .data(fullData)
        .enter()
        .append("text")
        .classed("stateText", true)
         .attr("x", d => xLinearScale(d.obesity))
         .attr("y", d => yLinearScale(d.healthcare))
         .attr("text-anchor","middle")
        .attr("font-size","12px")
        .attr("fill", "black")
        .text(d => d.abbr);
        

svg.append("g")
        .call(xAxis)
        .attr("transform","translate(0,"+ (height-margin.bottom-labelArea) + ")");

        svg.append("g")
        .call(yAxis)
        .attr("transform","translate("+ (margin.left+labelArea) + ", 0)");

  
      // Step 1: Initialize Tooltip
      var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(fullData) {
          return (`<strong>State: ${d.state}<strong><hr>Obesity: ${d.obesity}<strong><hr>Health Care: ${d.healthcare}`);
        });
       
      // Step 2: Create the tooltip in chartGroup.
      chartGroup.call(toolTip);

      // Step 3: Create "mouseover" event listener to display tooltip
      chartGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
      })
      // Step 4: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(d) {
          toolTip.hide(d);
        });
      });
      chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Health Care %");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 120})`)
      .attr("class", "axisText")
      .text("Obesity %");
    };


// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);

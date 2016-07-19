// by Kristin Henry
// modified from  Mike Bostock's example at http://bl.ocks.org/mbostock/3887051

function drawGroupedBarChart(dataFile, targ, grpHeader, yLabel, colorRange){


  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var groupGap = .3; //.2;  // original was .1
  var x0 = d3.scale.ordinal()
      .rangeRoundBands([0, width], groupGap);
  
  var x1 = d3.scale.ordinal();  /// used within each step of x0, for groups

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.ordinal()
      .range(colorRange);


  var xAxis = d3.svg.axis()
      .scale(x0)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".2s"));

  // var svg = d3.select("body").append("svg")
   var svg = d3.select(targ).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  console.log('in D3: ', grpHeader);

  var data = d3.csv.parse(dataFile, function(d){
      var item = {}
     
        for(grp in grpHeader){
          var grpname = grpHeader[grp];
          if(grp != 0){
            item[grpname] = +d[grpname];
          } else {
            item[grpname] = d[grpname];
          }
        }
        return item;
      
  });
  console.log(data)


    
    var subgroupNames = d3.keys(data[0]).filter(function(key) { return key !== grpHeader[0]; });
   // console.log(subgroupNames);

    data.forEach(function(d) {
      d.subgroups = subgroupNames.map(function(name) { return {name: name, value: +d[name]}; });
      console.log(grpHeader[0])
      console.log(d);
    });

    x0.domain(data.map(function(d) { return d[grpHeader[0]]; }));
    x1.domain(subgroupNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.subgroups, function(d) { return d.value; }); })]);


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yLabel);

    var group = svg.selectAll(".group")
        .data(data)
      .enter().append("g")
        .attr("class", "group")
        // .attr("transform", function(d) { return "translate(" + x0(d[groupsHeader]) + ",0)"; });
        .attr("transform", function(d) { return "translate(" + x0(d[grpHeader[0]]) + ",0)"; });

    group.selectAll("rect")
        .data(function(d) { return d.subgroups; })
      .enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.name); })
        .attr("y", function(d) { return y(d.value); })
        //.attr("y", function(d) { return 0; })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { return color(d.name); });

    var legend = svg.selectAll(".legend")
        .data(subgroupNames.slice().reverse())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

  // });

}

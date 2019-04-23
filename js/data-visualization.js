function doGraph(event){


  $("#modal-1-title").html(event.data.title);
  $("#legend").html(event.data.legend);
  var data;
  var graph_id = event.data.id;


  var factor, spacing, colWidth, xFactor, fontSize, marginLeft, textSkew;

  function senateConfig(){
    spacing = 25;
    colWidth = 25;
    xFactor = 50;
    fontSize = 15;
    marginLeft = 50;
    textSkew = -30;
  }
  function houseConfig(){
    spacing = 10;
    colWidth = 10;
    xFactor = 15;
    fontSize = 8;
    marginLeft = 30;
    textSkew = -90;
  };
  if (graph_id == "most-engaged"){
    dataset = graphData.most_engaged;
    factor = 100;
    senateConfig();
  } else if (graph_id == "least-engaged"){
    dataset = graphData.least_engaged;
    factor = 10;
    senateConfig();
  } else if ( graph_id == "most-engaged-house"){
    dataset = graphData.most_engaged;
    factor = 50;
    houseConfig();
  } else if (graph_id == "least-engaged-house"){
    dataset = graphData.least_engaged;
    factor = 2;
    houseConfig();
  } else if ( graph_id == "most-loyal" ) {
    dataset = graphData.most_loyal;
    factor = 3;
    senateConfig();
  } else if ( graph_id == "least-loyal" ) {
    dataset = graphData.least_loyal;
    factor = 3;
    senateConfig();
  }else if ( graph_id == "most-loyal-house"){
    dataset = graphData.most_loyal;
    factor = 3;
    houseConfig();
  } else if (graph_id == "least-loyal-house"){
    dataset = graphData.least_loyal;
    factor = 3;
    houseConfig();
  }



  const w = 800;
  const h = 400;
  const marginBottom = 75;


  const svg = d3.select("div#graph")
                .append("svg")
                .attr("width", w)
                .attr("height", h + marginBottom)
                .attr("transform", "translate(30, 0)");



        svg.selectAll("rect")
          .data(dataset)
          .enter()
          .append("g")
          .append("rect")
          .attr("x", (d, i) => (i * xFactor) + spacing)
          .attr("y", (d) => h - 50 - factor * d.vwp)
          .attr("width", colWidth)
          .attr("height", (d, i) =>  { return d.vwp * factor })
          .attr("fill", "#25B7D2")
          .attr("transform", "translate(" + marginLeft + ", 0)");

        svg.selectAll("text")
         .data(dataset)
         .enter()
         .append("g")
         .attr("transform", (d, i) => { return "translate( " + (i *  xFactor + marginLeft + spacing +  5)  + ", " + (h - 50 - factor * d.vwp - 5)  + ")"; })
         .append("text")
         .style("font-size", fontSize + "px")
         .text((d) => d.vwp + " %")
         .attr("transform", "rotate(" + textSkew + ")")

         // without textSkew
         // svg.selectAll("text")
         //  .data(dataset)
         //  .enter()
         //  .append("g")
         //  .append("text")
         //  .style("font-size", fontSize + "px")
         //  .attr("x", (d,i) => i * xFactor + spacing)
         //  .attr("y", (d,i) => h - 50 - factor * d.vwp - 5)
         //  .text((d) => d.vwp + " %")
         //  .attr("transform", "translate(" + marginLeft + ", 0)")

        svg.selectAll("label")
        .data(dataset)
        .enter().append("g")
        .attr("x", 0)
        .attr("y", 0)
        .attr("transform", (d, i) => { return "translate( " + (i *  xFactor + marginLeft + spacing)  + ", " + (h - 30)  + ")"; })
        .append("text")
        .text((d) => d.name)
        .attr("fill", "black")
        .style("text-anchor", "end")
        .style("font-size", fontSize + "px")
        .attr("transform", "rotate(-45)")

};

function undoGraph(){

  d3.selectAll("svg").remove();
}

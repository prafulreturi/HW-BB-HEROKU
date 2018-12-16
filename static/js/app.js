function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

    d3.json(`/metadata/${sample}`).then(function(response) {

      console.log(response);

      var meta = d3.select('#sample-metadata');
  
      meta.html("")

      Object.entries(response).forEach(([key, value]) => {
        var newLine = meta.append("p");
        newLine.text(`${key}: ${value}`);
  
      });
  
    })
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).



    d3.json(`/samples/${sample}`).then(function(data) {
    

      var bubbleData = [{
        x: data["otu_ids"],
        y: data["sample_values"],
        text: data["otu_labels"], 
        type: "scatter",
        mode: "markers",
        marker: {
          color: data["otu_ids"],
          size: data["sample_values"],
          colorscale: "Earth"
        },
      }];
      var bubbleLayout = {
        xaxis: {
          title: "OTU ID"
        },
        yaxis: {
          title: "Value",
          range: [0, Math.max(data["sample_values"])]
          
        }
      };
      var bubble = document.getElementById("bubble");
      Plotly.newPlot(bubble, bubbleData, bubbleLayout);

      
  var dataArray = [];
  for (var i=0; i<data.otu_ids.length; i++) {
    dataArray.push({
      "sample_values": data.sample_values[i],
      "otu_ids": data.otu_ids[i],
      "otu_labels": data.otu_labels[i]
    })
  }


   var pieData = [{
    labels: dataArray.map(d => d["otu_ids"]).slice(0,10),
    values: dataArray.map(d => d["sample_values"]).slice(0,10),
    text: dataArray.map(d => d["otu_labels"]).slice(0,10), 
    type: "pie",
    name: dataArray.map(d => d["otu_ids"]).slice(0,10),
    "textinfo": "percent"
  }];


  var pieLayout
  var pie = document.getElementById("pie");
  Plotly.newPlot(pie, pieData, pieLayout);

    });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

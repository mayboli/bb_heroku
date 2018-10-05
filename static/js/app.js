function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  url = "/metadata/" + sample;
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(url).then(function(data) {
    console.log(data);
    d3.select("#sample-metadata").html("")
    Object.entries(data).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    
    d3.select("#sample-metadata")
      .append()
      .text(`${key}: ${value}`)
      .append("br")
  

    });

  
  });

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

}

function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  var url = "/samples/" + sample;

  d3.json(url).then(function(data) {
    console.log(data);

    // Build a Bubble Chart using the sample data
    var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: "markers",
      marker: {
        color: data.otu_ids,
        size: data.sample_values
      }
    };

    var bubble = [trace1];

    Plotly.newPlot("bubble", bubble);

    // Creating empty list to store values
    var dataSort = [];

    // Using a for loop to add values
    for(var i=0; i<data.sample_values.length;i++) {
      dataSort.push({otu_ids:data.otu_ids[i],
                    otu_labels:data.otu_labels[i],
                    sample_values:data.sample_values[i]
      })
    };

    dataSort.sort(function(a, b) {
      return b.sample_values-a.sample_values;
    });

    
    topTen = dataSort.slice(0,10);
    topTen = topTen.reverse();
    console.log(topTen);

    // Build a pie chart using sample data
    var trace2 = {
      values: topTen.map(row => row.sample_values),
      labels: topTen.map(row => row.otu_ids),
      type: "pie",
      hoverinfo: topTen.map(row => row.otu_labels),
      textinfo: "percent"

    };

    var pie = [trace2];

    Plotly.newPlot("pie", pie);
    
  });

};



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

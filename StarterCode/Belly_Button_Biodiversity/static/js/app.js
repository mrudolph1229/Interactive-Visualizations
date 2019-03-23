function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
    console.log(sample)
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var meta = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    meta.html("")
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.json(`/metadata/${sample}`).then((sampleNames) => {
    Object.entries(sampleNames).forEach(([key, value]) => meta.append("div").text(`${key}: ${value}`))
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(response) {
  
    // @TODO: Build a Bubble Chart using the sample data
    var trace= [{
      "x": response['otu_ids'],
      "y": response['sample_values'],
      "labels": response['otu_labels'],
      "type": "scatter",
      "mode": "markers",
      "marker": {size: response['sample_values']}
    }]
    var layout= [{
      title: "Biodiversity of Selected Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Values"}
    }]
    var tag = document.getElementById("bubble");
    Plotly.plot(tag, trace, layout)

  
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var dataArray = [];
    for (var i=0; i<response.otu_ids.length; i++) {
      dataArray.push({
        "sample_values": response.sample_values[i],
        "otu_ids": response.otu_ids[i],
        "otu_labels": response.otu_labels[i]
      })
    }
    var dataArraySorted = dataArray.sort((a, b) =>
      parseFloat(b.sample_values) - parseFloat(a.sample_values)
    );
  })
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

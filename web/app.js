proj4.defs("EPSG:3006", "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=500000 +y_0=0 +datum=WGS84 +units=m +no_defs");

// Register the projection
ol.proj.proj4.register(proj4);


// Initialize the map
//var projection = new ol.proj.Projection({
//  code: 'EPSG:3006', // Change this to your desired CRS code (e.g., EPSG:3067 for Sweden)
//  units: 'degrees'  // Use appropriate units for your CRS
//});

var projection = ol.proj.get('EPSG:3006'); // SWEREF 99 TM


var swedenExtent =  [     -1551505.8142122081,
  5355710.132426114,
  2760932.62646641,
  8119355.595077298
]

const map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: 'https://{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
          //tileSize: 1024,  // Retina tiles have double size for better resolution
      }),        
      projection: projection,  // Specify your custom CRS

      })
    ],
    view: new ol.View({
      projection: projection,  // Use custom projection
      center: [458447.3354474632, 6768014.380647408],  // Approximate center of Sweden (longitude, latitude)
      zoom: 6,  // Adjust zoom level
      maxZoom: 10,
     extent: swedenExtent,
       // Restrict view to Sweden
     })
  });


// Add our historic map

const histLayer =  new ol.layer.Tile({
  title: 'Overlay',
  // opacity: 0.7,
        
  extent: ol.proj.transformExtent(
    [925249.853900, 7321531.794924, 2945416.413700, 10905797.788400],
    'EPSG:3857',
    'EPSG:3006'
),
  source: new ol.source.XYZ({
      attributions: '',
      minZoom: 3,
      maxZoom: 9,
      url: 'data/forest-data/tiles/{z}/{x}/{-y}.png',
      tileSize: [256, 256]
  })
});

map.addLayer(histLayer);

// Add our forest shape layer

  const forestShapeLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'data/forest-data/forest_HQ.geojson', // Can be generated from shapefile if needed
      format: new ol.format.GeoJSON(),
    }),
    visible: true,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(44, 142, 62, 0.49)', // Green with 50% transparency
      })
    }),
  });
  
  map.addLayer(forestShapeLayer);

// Add our House Data (GeoJSON format example)
  const houseLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'data/house-data/houses_all_data.geojson', // Can be generated from shapefile if needed
      format: new ol.format.GeoJSON(),
    }),
    visible: true,
    style: new ol.style.Style({
      image: new ol.style.Circle({
          radius: 5,
          fill: new ol.style.Fill({
              color: 'rgba(255, 230, 0, 0.69)'
          }),
      }),
  })
  });
  map.addLayer(houseLayer);
  const features = houseLayer.getSource().getFeatures();


  // Heatmap layer for house data
var heatmapLayer = new ol.layer.Heatmap({
  source: houseLayer.getSource(),
  blur: 10,
  radius: 10,
  gradient:	['rgba(255, 230, 0, 0.69)','rgba(255, 239, 96, 0.69)','rgba(255, 206, 59, 0.69)'],
  visible: false, // Initially hidden

});
map.addLayer(heatmapLayer);


// Backup of all features
let allFeatures = [];

// Wait for features to load
houseLayer.getSource().on("featuresloadend", () => {
  // Backup all features after they are loaded
  allFeatures = houseLayer.getSource().getFeatures();

  applyFilters(); // Apply initial filters
});


var slider = document.getElementById('slider');

noUiSlider.create(slider, {
    start: [1700, 2020],
    connect: true,
    step: 20,
    range: {
        'min': 1700,
        'max': 2020
    },
    // Show a scale with the slider
    pips: {
      mode: 'steps',
      stepped: true,
      density: 3
  },
    format: {
      from: function(value) {
              return parseInt(value);
          },
      to: function(value) {
              return parseInt(value);
          }
      }
});



// Global variables to store current filter values

let currentMaxDate = new Date(`${slider.noUiSlider.get()[1]}-12-31`);
let currentMinDate = new Date(`${slider.noUiSlider.get()[0]}-12-31`);

slider.noUiSlider.on('update', function (values, handle) {

  currentMaxDate = new Date(`${values[1]}-12-31`);
  currentMinDate = new Date(`${values[0]}-12-31`);
  applyFilters(); // Apply both filters

});



// Select all the existing buttons

// Initialize the currentSelectedFrames array with all frames active by default
// Select all the existing buttons
const frameButtons = document.querySelectorAll('.frame-toggle');

// Initialize an empty array for currentSelectedFrames
let currentSelectedFrames = [];

// On page load, loop through all buttons, set them to active, and populate currentSelectedFrames
frameButtons.forEach((button) => {
  // Add the 'active' class
  button.classList.add('active');

  // Get the frame name from the button's data attribute and add it to the array

  const frameValues = button.dataset.value.split(',');
  frameValues.forEach((frameValue) => {
    currentSelectedFrames.push(frameValue);
  });
});

applyFilters();

// Add event listeners to each button
frameButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // Toggle the 'active' class
    button.classList.toggle('active');

    // Get the frame values from the button's data attribute (split into an array)
    const frameValues = button.dataset.value.split(',');

    frameValues.forEach((frameValue) => {
      // Add or remove each frame from currentSelectedFrames
      if (currentSelectedFrames.includes(frameValue)) {
        // Remove the frame if it's currently active
        currentSelectedFrames = currentSelectedFrames.filter((frame) => frame !== frameValue);
      } else {
        // Add the frame if it's not currently active
        currentSelectedFrames.push(frameValue);
      }
    });

    // Reapply filters
    applyFilters();
  });
});

// Unified filter function
function applyFilters() {
  // Filter from the original feature set (allFeatures)
  const filteredFeatures = allFeatures.filter((feature) => {
    // Apply date filter
    const houseDate = new Date(feature.get("Date"));
    const isWithinDateRange = houseDate >= currentMinDate && houseDate <= currentMaxDate;
    // Apply frame filter
    const matchesFrame = currentSelectedFrames.some((frame) => feature.get(frame) === true);

    // Return true if both conditions are met
    return isWithinDateRange && matchesFrame;
  });

  // If no features are filtered, provide default values for pie chart and distance chart
  let meanPercentage = 0;
  let meanDistance = 0;

  if (filteredFeatures.length > 0) {
    meanPercentage = calculateMeanPercentage(filteredFeatures);
    meanDistance = calculateMeanDistance(filteredFeatures);
  }

  // Display the mean as a percentage in the pie chart
  displayPieChart(meanPercentage, meanDistance);

  // Clear and re-add filtered features
  houseLayer.getSource().clear();
  houseLayer.getSource().addFeatures(filteredFeatures);

  // Debugging (Optional)
  console.log(`Filtered features count: ${filteredFeatures.length}`);
}



// Get the HTML elements
const layerToggle = document.getElementById("layer-toggle");
const displayToggle = document.getElementById("display-toggle");

// Layer toggle event listener
layerToggle.addEventListener("change", () => {
  const selectedLayer = layerToggle.value;

  if (selectedLayer === "historic") {
    histLayer.setVisible(true);
    forestShapeLayer.setVisible(false);
  } else if (selectedLayer === "forest") {
    histLayer.setVisible(false);
    forestShapeLayer.setVisible(true);
  }
});

// Display toggle event listener
displayToggle.addEventListener("change", () => {
  const selectedDisplay = displayToggle.value;

  if (selectedDisplay === "points") {
    houseLayer.setVisible(true);
    heatmapLayer.setVisible(false);
  } else if (selectedDisplay === "heatmap") {
    houseLayer.setVisible(false);
    heatmapLayer.setVisible(true);
  }
});

// Set initial visibility
histLayer.setVisible(true);
forestShapeLayer.setVisible(false);
houseLayer.setVisible(true);
heatmapLayer.setVisible(false);

function calculateMeanPercentage(features) {
  const forestPercentages = features.map((feature) => feature.get('forest_percent')).filter(value => value !== null);
  const sum = forestPercentages.reduce((acc, value) => acc + value, 0);
  return sum / forestPercentages.length;
}
// Function to calculate the mean of 'forest_distance'
function calculateMeanDistance(features) {
  const forestDistances = features.map((feature) => feature.get('forest_distance')).filter(value => value !== null);
  const sum = forestDistances.reduce((acc, value) => acc + value, 0);
  return sum / forestDistances.length;
}

function displayPieChart_debug(meanPercentage, meanDistance){

console.log(Math.round(meanPercentage*100)+"%");
console.log(Math.round(meanDistance/1000)+"km");

}

function displayPieChart(meanPercentage, meanDistance) {
  // Get the canvas context for both charts
  const ctxPercentage = document.getElementById('pie-chart-percentage').getContext('2d');
  const ctxDistance = document.getElementById('line-chart-distance').getContext('2d');

  // Pie Chart for Mean Forest Percentage
  const meanPercentageValue = meanPercentage * 100; // Convert to percentage (e.g., 0.55 becomes 55)
  const remainingPercentage = 100 - meanPercentageValue;

  // If pie chart already exists, update it
  if (window.pieChartInstance) {
      window.pieChartInstance.data.datasets[0].data = [meanPercentageValue, remainingPercentage];
      window.pieChartInstance.update({
          duration: 1000, // Animation duration
          easing: 'easeOutBounce' // Easing function for animation
      });
  } else {
      // If no pie chart exists, create one
      window.pieChartInstance = new Chart(ctxPercentage, {
          type: 'doughnut',
          data: {
              labels: ['Forest Percentage', 'Remaining'],
              datasets: [{
                  label: 'Forest Percentage',
                  data: [meanPercentageValue, remainingPercentage],
                  backgroundColor: ['rgb(44, 142, 62)', 'rgb(245, 245, 245)'],
                  hoverOffset: 4,
                  borderWidth: 0
              }]
          },
          options: {
              responsive: true,
              animation: {
                  duration: 200,  // Animation duration
                  easing: 'easeOut'  // Easing function for animation
              },
              plugins: {
                  legend: {
                    display: false
                  },
                  tooltips: { enabled: false },

              }
          }
      });
  }

// Linear Chart for Mean Forest Distance (converted to kilometers)
const meanDistanceValue = meanDistance / 1000; // Convert distance to kilometers
const remainingDistance = 35 - meanDistanceValue; // Subtract from 35 km for the remaining part

// If distance chart already exists, update it
if (window.distanceChartInstance) {
    window.distanceChartInstance.data.datasets[0].data = [meanDistanceValue];
    window.distanceChartInstance.update({
        duration: 1000,  // Animation duration
        easing: 'easeOutBounce'  // Easing function for animation
    });
} else {
    // If no distance chart exists, create one
    window.distanceChartInstance = new Chart(ctxDistance, {
        type: 'bar',  // Bar chart type (horizontal)
        data: {
            labels: ['Distance to forest'],
            datasets: [{
                data: [meanDistanceValue], // The actual value to display
                backgroundColor: 'rgb(44, 142, 62)', // Color of the bar
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 200,  // Animation duration
                easing: 'easeOut'  // Easing function for animation
            },
            indexAxis: 'y',
            tooltips: { enabled: false },
            plugins: {
              legend: {
                display: false
              },
              tooltips: { enabled: false },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 30, // Set the max value to 35 km
                    ticks: {
                        callback: function(value) {
                            return value + ' km';  // Label format for X axis
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        display: false  // Hide the y-axis since it's a horizontal bar chart
                    }
                }
            },
        }
    });
}
}



map.on('moveend', function(){

  heatmapLayer.heatmap.set('radius',view.getZoom); //this dynamically updates the radius!!


  const view = map.getView();
  const extent = view.calculateExtent(map.getSize());

  console.log(extent);

});

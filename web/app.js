/**
import ImageTile from './js/openlayers/ImageTile.js';
import Map from './js/openlayers/Map.js';
import TileLayer from './js/openlayers/Tile.js';
import Overlay from './js/openlayers/Overlay.js';
*/
//------- CREATE MAP --------

// Import SWEREF99TM (3006)
proj4.defs("EPSG:3006", "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=500000 +y_0=0 +datum=WGS84 +units=m +no_defs");

// Register the projection
ol.proj.proj4.register(proj4);
var projection = ol.proj.get('EPSG:3006'); // SWEREF 99 TM

// Set up map borders

var swedenExtent =  [     -1551505.8142122081,
  5355710.132426114,
  2760932.62646641,
  8119355.595077298
]

const popup = document.getElementById('popup');


const overlay = new ol.Overlay({
  element: popup,
  offset: [0,0],
  positioning: 'top-center',
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});


//Create map 
const map = new ol.Map({
    target: 'map',
    layers: [
      // Add positron map
      new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: 'https://{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
      }),        
      projection: projection,  

      })
    ],
    overlays: [overlay],
    controls: [],
    view: new ol.View({

      // Set up map view and restrictions
      projection: projection,  
      center: [458447.3354474632, 6768014.380647408],  // Approximate center of Sweden (longitude, latitude)
      zoom: 6,  // Adjust zoom level
      maxZoom: 10,
     extent: swedenExtent,
       
     })
  });


// Add historic map tiles

const histLayer =  new ol.layer.Tile({
  title: 'Historic map',
 /*
  // Transform our extent to SWEREF99TM (3006)
  extent: ol.proj.transformExtent(
    [925249.853900, 7321531.794924, 2945416.413700, 10905797.788400],
//    [925249.853900, 7321531.794924, 2945416.413700, 10905797.788400],

    'EPSG:3857',
    'EPSG:3006'
),
*/
  source: new ol.source.XYZ({
      attributions: '',
      minZoom: 3,
      maxZoom: 9,
      url: '../data/forest-data/skogskartan_xyz_tiles/{z}/{x}/{-y}.png',
      tileSize: [256, 256]
  })
});

map.addLayer(histLayer);

// Add forest layer for calculations

const forestShapeLayerCalculations = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: '../data/forest-data/forest_cover_sweden_1840.geojson', 
    format: new ol.format.GeoJSON(),
  }),
  visible: true,
  // Set style of forest layer
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0)', // 
    })
  }),
});

map.addLayer(forestShapeLayerCalculations);

// Add  forest shape layer

  const forestShapeLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: '../data/forest-data/forest_cover_sweden_1840.geojson', 
      format: new ol.format.GeoJSON(),
    }),
    visible: false,
    // Set style of forest layer
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(44, 142, 62, 0.49)', // 
      })
    }),
  });
  
  map.addLayer(forestShapeLayer);



// Add our House Data 

  const houseLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: '../data/house-data/house_data.geojson', // Can be generated from shapefile if needed
      format: new ol.format.GeoJSON(),
    }),
    visible: true,
    style: new ol.style.Style({
      image: new ol.style.Circle({
          radius: 8,
          fill: new ol.style.Fill({
              color: 'rgba(255, 230, 0, 0.8)',
              
          }),
          stroke: new ol.style.Stroke({
            color: 'rgba(227, 186, 64, 0.84)', // Border color (black in this case)
            width: 1, // Width of the border
        }),
          
      }),
  })
  });
  map.addLayer(houseLayer);

  // Add a layer for the dynamic circle overlays
const circleLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(0, 128, 255, 0)', // Semi-transparent blue
    }),
    stroke: new ol.style.Stroke({
      color: 'rgba(0, 0, 0, 0.8)', // Blue border
      width: 10,
    }),
  }),
});
map.addLayer(circleLayer);

// Create overlay




/** UNUSED HEATMAP LAYER 
  // Heatmap layer for house data
var heatmapLayer = new ol.layer.Heatmap({
  source: houseLayer.getSource(),
  blur: 10,
  radius: 10,
  gradient:	['rgba(255, 230, 0, 0.69)','rgba(255, 239, 96, 0.69)','rgba(255, 206, 59, 0.69)'],
  visible: false, // Initially hidden

});
map.addLayer(heatmapLayer);
*/

// ---- APPLICATION -----

// Get features

const features = houseLayer.getSource().getFeatures();


// Backup of all features
let allFeatures = [];

// Wait for features to load
houseLayer.getSource().on("featuresloadend", () => {
  // Backup all features after they are loaded
  allFeatures = houseLayer.getSource().getFeatures();

  applyFilters(); // Apply initial filters
});


var slider = document.getElementById('slider');
var pieLabel = document.getElementById('pie-label');
var numberHouses = document.getElementById('number-houses');
var kmLabel = document.getElementById('distance-km');

noUiSlider.create(slider, {
    start: [1800, 2020],
    connect: true,
    step: 20,
    range: {
        'min': 1800,
        'max': 2020
    },
    // Show a scale with the slider a
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
const frameButtons = document.querySelectorAll('.frame-toggle');
const layerButtons = document.querySelectorAll('.layer-button');

// Initialize an empty array for currentSelectedFrames
let currentSelectedFrames = [];

// On page load, loop through all buttons, set them to active, and populate currentSelectedFrames
frameButtons.forEach((button) => {
  // Add the 'active' class
  button.classList.add('active');
  updateFrameIcon(button);

  // Get the frame name from the button's data attribute and add it to the array

  const frameValues = button.dataset.value.split(',');
  frameValues.forEach((frameValue) => {
    currentSelectedFrames.push(frameValue);
  });
});

function updateFrameIcon(button) {
  const icon = button.querySelector('.icon');
  
  // Ensure the icon element exists before trying to update
  if (icon) {
    if (button.classList.contains('active')) {
      icon.innerHTML = 'visibility'; // Active state
    } else {
      icon.innerHTML = 'visibility_off'; // Inactive state
      console.log(icon);
    }
  } else {
    console.warn('Icon element not found in button:', button);
  }
}
function updateLayerIcon(button) {
  const icon = button.querySelector('.icon');
  
  // Ensure the icon element exists before trying to update
  if (icon) {
    if (button.classList.contains('active')) {
      icon.innerHTML = 'check'; // Active state
    } else {
      icon.innerHTML = 'horizontal_rule'; // Inactive state
      console.log(icon);
    }
  } else {
    console.warn('Icon element not found in button:', button);
  }
}



// Add event listeners to each button
frameButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // Toggle the 'active' class
    button.classList.toggle('active');
    updateFrameIcon(button);
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

// Store the map layers by name, referencing them dynamically
const layers = {
  histLayer: histLayer,
  forestShapeLayer: forestShapeLayer,
  // Add other layers if necessary
};

// Loop through the buttons to add event listeners
layerButtons.forEach(button => {
  updateLayerIcon(button);
  button.addEventListener('click', () => {
    // Toggle 'active' class for the clicked button
    layerButtons.forEach(btn => btn.classList.remove('active'));  // Remove active from all
    button.classList.add('active');  // Add active to the clicked button
    layerButtons.forEach(btn =>  updateLayerIcon(btn));  // Remove active from all
   

    // Get the layer name from the data-value of the clicked button
    const selectedLayerName = button.getAttribute('data-value');
    
    // Show the corresponding layer and hide the others
    for (const layerName in layers) {
      if (layerName === selectedLayerName) {
        layers[layerName].setVisible(true);  // Show the selected layer
      } else {
        layers[layerName].setVisible(false);  // Hide all other layers
      }
    }
  });
});


// Unified filter function
function applyFilters(selectedFeature = null) {
  let filteredFeatures;

  // If selectedFeature is set, only include it in filteredFeatures
  if (selectedFeature) {
    filteredFeatures = [selectedFeature];
  } else {
    if(circleLayer.getSource()){
      circleLayer.getSource().clear();
    }
    overlay.setPosition(undefined);


    // If set to minimum date (1800), include all below aswell
    if(currentMinDate <=  new Date(`1800-12-31`)){

      currentMinDate =  new Date(`1600-12-31`);

    }

    // Otherwise, apply the regular filters on allFeatures
    filteredFeatures = allFeatures.filter((feature) => {
      // Apply date filter
      const houseDate = new Date(feature.get("Date"));
      const isWithinDateRange = houseDate >= currentMinDate && houseDate <= currentMaxDate;

      // Apply frame filter
      const matchesFrame = currentSelectedFrames.some((frame) => feature.get(frame) === true);

      // Return true if both conditions are met
      return isWithinDateRange && matchesFrame;
    });
  }

  // Handle default values if no features are filtered
  let meanPercentage = 0;
  let meanDistance = 0;

  if (filteredFeatures.length > 0) {
    meanPercentage = calculateMeanPercentage(filteredFeatures);
    meanDistance = calculateMeanDistance(filteredFeatures);
  }

  // Update the number of houses displayed
  numberHouses.innerHTML = filteredFeatures.length;

  // Update the charts with the filtered data
  displayPieChart(meanPercentage, meanDistance);

  // Clear and re-add filtered features to the layer
  houseLayer.getSource().clear();
  houseLayer.getSource().addFeatures(filteredFeatures);

  // Debugging (Optional)
  console.log(`Filtered features count: ${filteredFeatures.length}`);
}



function calculateMeanPercentage(features) {
  const forestPercentages = features.map((feature) => feature.get('Forest_percent')).filter(value => value !== null);
  const sum = forestPercentages.reduce((acc, value) => acc + value, 0);
  return sum / forestPercentages.length;
}
// Function to calculate the mean of 'forest_distance'
function calculateMeanDistance(features) {
  const forestDistances = features.map((feature) => feature.get('Forest_distance')).filter(value => value !== null);
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
                    max: 60, // Set the max value to 35 km
                    ticks: {
                        callback: function(value) {
                            return value + ' km';  // Label format for X axis
                        }
                    },
                    grid: {
                      display: false // Hide the horizontal grid lines
                  }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        display: false  // Hide the y-axis since it's a horizontal bar chart
                    },
                    grid: {
                      display: false // Hide the horizontal grid lines
                  }
                }
            },
        }
    });
}

pieLabel.innerHTML = Math.round(meanPercentageValue)+"%";
kmLabel.innerHTML = Math.round(meanDistanceValue);

}


/*
map.on('moveend', function(){

  const view = map.getView();
  const extent = view.calculateExtent(map.getSize());

 // console.log(extent);


});
*/





// Add a click event listener to the map
map.on('click', function (event) {
  // Clear the previous circle
  circleLayer.getSource().clear();

  let featureFound = false; // Flag to track if a house feature was clicked

  // Check if the clicked feature is part of the houseLayer
  map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
    if (layer === houseLayer) {
      featureFound = true; // A feature was found
      // Get the coordinates of the clicked house
      const coordinates = feature.getGeometry().getCoordinates();

      find_forest_edge(coordinates);
      draw_circle(coordinates);

      // Smoothly fly to the selected house
      map.getView().animate({
        center: coordinates, // Target coordinates
        zoom: 9, // Target zoom level
        duration: 200, // Duration of the animation in milliseconds
        easing: ol.easing.easeOut // Easing function for a smooth effect
      });


      // Set the popup
      create_popup(feature);

      // Apply filters to only show the selected house
      applyFilters(feature);

      return true; // Stop iterating over features
    }
  });

  // If no feature was found, reset the filters and clear the circle
  if (!featureFound) {
    circleLayer.getSource().clear();
    applyFilters(); // Reset to show all houses
  }
});




function draw_circle(coordinates){

    // Helper function to create a circular geometry
  function createCircle(center, radius, projection) {
    // Convert center to map projection
    const transformedCenter = ol.proj.transform(center, 'EPSG:4326', projection);
    
    // Generate circular geometry
    const circle = new ol.geom.Circle(transformedCenter, radius);
    
    // Convert the Circle to a Polygon (OpenLayers doesn't render Circle directly)
    return ol.geom.Polygon.fromCircle(circle, 64); // 64 points for smoothness
  }
  
  // Create a circle geometry (5km radius, in meters)
  const circleGeometry = createCircle(
    ol.proj.toLonLat(coordinates, 'EPSG:3006'), // Transform from map projection to lon/lat
    50000, // Radius in meters
    'EPSG:3006' // Map projection
  );
  
  // Add the circle as a new feature
  const circleFeature = new ol.Feature(circleGeometry);
  circleLayer.getSource().addFeature(circleFeature);
  
}

// Experimental to draw a line between pont and forest 

function find_forest_edge(coordinates){

      // Get the clicked house coordinates
      const houseCoords = coordinates;

      let nearestDistance = Infinity;
      let nearestPoint = null;

      let insideForest = false;
      console.log("find edge");

      console.log(forestShapeLayerCalculations.getSource());

      forestShapeLayerCalculations.getSource().getFeatures().forEach((forestFeature) => {
        const forestGeom = forestFeature.getGeometry();
    
        // Check if the point is within the polygon
        if (forestGeom.intersectsCoordinate(houseCoords)) {
          insideForest = true;
        }
      });
    
      // If the house is inside a forest, no need to draw a line
      if (insideForest) {
        console.log('The house is already inside a forest.');
        return;
      }
    

      // Loop through all forest polygons to find the nearest edge
      forestShapeLayerCalculations.getSource().getFeatures().forEach((forestFeature) => {

        
        const forestGeom = forestFeature.getGeometry();


        // Get the closest point on the forest polygon's edge
        const closestPoint = forestGeom.getClosestPoint(houseCoords);

        // Calculate distance to the house
        const distance = ol.sphere.getDistance(
          ol.proj.toLonLat(houseCoords, 'EPSG:3006'),
          ol.proj.toLonLat(closestPoint, 'EPSG:3006')
        );

        // Update nearest point if this is closer
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestPoint = closestPoint;
        }

      });

      if (nearestPoint) {

        console.log(nearestDistance);


        // Create a line from the house to the nearest point
        const lineGeometry = new ol.geom.LineString([houseCoords, nearestPoint]);

        // Create a feature for the line
        const lineFeature = new ol.Feature({
          geometry: lineGeometry,
        });

        // Style the line
        lineFeature.setStyle(
          new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: 'rgba(0, 0, 0, 0.8)', // Red line
              width: 4,
            }),
          })
        );

        // Add the line to the circleLayer (or create a new layer for lines)
        circleLayer.getSource().addFeature(lineFeature);
      }

}

function create_popup(feature){

  const coordinates = feature.getGeometry().getCoordinates();
  const newCoordinates = [coordinates[0], coordinates[1] + 49000];
  const frameFeatures = feature.getProperties(); // Get all properties of the feature
  const content = document.getElementById('popup-content');
  
  overlay.setPosition(newCoordinates);
  content.innerHTML = "";


  const yearContainer = document.createElement('strong');
  const list = document.createElement('ul');

  for (let frame in frameFeatures) {
    if (frame.startsWith('Frame')) {
      if(frameFeatures[frame]){
      const listItem = document.createElement('li');
      listItem.textContent = `${frame.replace(/^Frame_/, '').replace(/_/g, ' - ')}`;
      listItem.setAttribute('data-frame', frame);
      list.appendChild(listItem);
      }
    }
  }

  if(frameFeatures['Date']){

          // Extract the year from the 'Date' property (assuming it exists and is a valid date string)
  const featureDate = frameFeatures["Date"]; // Access the Date property
  let year = ''; // Default to an empty string if no Date exists
  
    if (featureDate) {
      const dateObject = new Date(featureDate); // Convert to Date object
      if (!isNaN(dateObject)) { // Check if it's a valid date
        year = dateObject.getFullYear(); // Extract the year
        yearContainer.innerHTML = year;
      }
    }
    

  }      
  content.appendChild(yearContainer);
  content.appendChild(list);


}

applyFilters();

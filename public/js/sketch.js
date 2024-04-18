let sateliteFullData = []; // all timestamps
let satliteCurrentData = []; // only currente timestamp
let sateliteTimestampReference;

const serverUrl = "http://localhost:3000";

let mapImage;
zoom = 1;

function preload() {
  mapImage = loadImage(
    "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/0,0,1/1280x1280?access_token=pk.eyJ1IjoiZmF6b2xpbiIsImEiOiJjbHYxOGRsc3kwMjVqMmpwbGs5enVvaDV6In0.AEREHqyz7XyuOgECG1PJKw"
  );
  getSatelitesData();
}
function setup() {
  createCanvas(1280, 1280);
}

function draw() {
  getSatelitePosition();
  image(mapImage, 0, 0);
  fill(0, 200);
  rect(0, 0, displayWidth, displayWidth);
  translate(width / 2, height / 2);
  drawUserLocation();
  drawSatelites();
}

function getSatelitesData() {
  const userData = fetch(serverUrl + "/buscarSatelites")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((sateliteData) => {
        sateliteFullData.push(sateliteData); // Adiciona a instância ao array global
      });

      console.log("Dados recebidos");
    })
    .catch((error) => {
      console.log(error);
    });
}

function getSatelitePosition() {
  for (var i = 0; i < sateliteFullData.length; i++) {
    for (var j = 0; j < sateliteFullData[i].positions.length; j++) {
      if (
        Math.floor(Date.now() / 1000) ==
        JSON.stringify(sateliteFullData[i].positions[j].timestamp)
      ) {
        let name = JSON.stringify(sateliteFullData[i].info.satname);
        let timestamp = JSON.stringify(
          sateliteFullData[i].positions[j].timestamp
        );
        let latitude = JSON.stringify(
          sateliteFullData[i].positions[j].satlatitude
        );
        let longitude = JSON.stringify(
          sateliteFullData[i].positions[j].satlongitude
        );
        let altitude = JSON.stringify(
          sateliteFullData[i].positions[j].sataltitude
        );
        satliteCurrentData[i] = {
          name: name,
          timestamp: timestamp,
          latitude: latitude,
          longitude: longitude,
          altitude: altitude,
        };
        sateliteTimestampReference = sateliteFullData[i].positions[j].timestamp;
      }
    }
  }
}

function mercX(lon) {
  lon = radians(lon);
  let a = (320 / PI) * pow(2, zoom);
  let b = lon + PI;
  return a * b;
}
function mercY(lat) {
  lat = radians(lat);
  let a = (320 / PI) * pow(2, zoom);
  let b = tan(PI / 4 + lat / 2);
  let c = PI - log(b);
  return a * c;
}

function drawSatelites() {
  for (var i = 0; i < satliteCurrentData.length; i++) {
    // console.log(satliteCurrentData[i]);
    noStroke();
    fill(255);
    ellipse(
      mercX(satliteCurrentData[i].longitude) - mercX(0),
      mercY(satliteCurrentData[i].latitude) - mercY(0),
      5,
      5
    );
    textAlign(LEFT, CENTER);
    text(
      satliteCurrentData[i].name,
      mercX(satliteCurrentData[i].longitude) - mercX(0) + 10,
      mercY(satliteCurrentData[i].latitude) - mercY(0)
    );
  }
}
function drawUserLocation() {
  fill(255);
  ellipse(mercX(-46.6) - mercX(0), mercY(-23.54) - mercY(0), 20, 20);
}

// give coordinates and get back data
async function getCurrentWeather(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6f020d1e5504c152772885e0fa19b151&units=metric`,
      { mode: "cors" }
    );
    const weatherData = await response.json();
    return weatherData;
  } catch {}
}

// transform city name input into coordinates
async function getCoordinates(name) {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=1&appid=6f020d1e5504c152772885e0fa19b151`,
      { mode: "cors" }
    );
    const data = await response.json();
    const latLon = {
      lat: await data[0].lat,
      lon: await data[0].lon,
    };
    return latLon;
  } catch {}
}

// combine previous functions and filter data to return only needed info
async function weather(name) {
  try {
    const coordinates = getCoordinates(name);
    const data = await getCurrentWeather(
      (
        await coordinates
      ).lat,
      (
        await coordinates
      ).lon
    );
    const namelocation = data.name;
    const countryCode = data.sys.country;
    const description = data.weather[0].description;
    const temperature = data.main.temp;
    const feelsLike = data.main.feels_like;
    const windSpeed = data.wind.speed;
    const humidity = data.main.humidity;
    return {
      namelocation,
      countryCode,
      description,
      temperature,
      feelsLike,
      windSpeed,
      humidity,
    };
  } catch (err) {
    return "error";
  }
}

// new city
const renderWeatherComponent = (weatherObject) => {
  const main = document.createElement("main");
  document.querySelector("body").appendChild(main);

  const locationName = document.createElement("h1");
  locationName.id = "location";
  locationName.textContent = `${weatherObject.namelocation}, ${weatherObject.countryCode}`;
  main.appendChild(locationName);

  const description = document.createElement("h2");
  description.id = "description";
  description.textContent = `${weatherObject.description}`;
  main.appendChild(description);

  const bottomContainer = document.createElement("div");
  bottomContainer.id = "buttomContainer";
  main.appendChild(bottomContainer);

  const leftSide = document.createElement("div");
  leftSide.id = "leftSide";
  bottomContainer.appendChild(leftSide);

  const temperature = document.createElement("h2");
  temperature.id = "temperature";
  temperature.textContent = `${weatherObject.temperature}`;
  leftSide.appendChild(temperature);

  const units = document.createElement("h4");
  units.id = "units";
  units.textContent = "C" + String.fromCharCode(176);
  leftSide.appendChild(units);

  const rightSide = document.createElement("div");
  rightSide.id = "rightSide";
  bottomContainer.appendChild(rightSide);

  const feelsLike = document.createElement("p");
  feelsLike.id = "feelsLike";
  feelsLike.textContent =
    `Feels like: ${weatherObject.feelsLike} C` + String.fromCharCode(176);
  rightSide.appendChild(feelsLike);

  const windSpeed = document.createElement("p");
  windSpeed.id = "wind";
  windSpeed.textContent = `Wind: ${weatherObject.windSpeed} km/h`;
  rightSide.appendChild(windSpeed);

  const humidity = document.createElement("p");
  humidity.id = "humidity";
  humidity.textContent = `Humidity: ${weatherObject.humidity} %`;
  rightSide.appendChild(humidity);
};

// error message
const renderErrorComponent = () => {
  const text = document.createElement("p");
  text.textContent = "No matching location found!";
  text.id = "errorMessage";
  document.querySelector("form").appendChild(text);
};

// render what is appropiate (error if there is error, city if is found)
async function renderer(weatherObject, first = false) {
  const weatherData = await weatherObject;

  try {
    document.getElementById("errorMessage").remove();
  } catch {}

  if (weatherData == "error") {
    console.log("error");
    renderErrorComponent();
  } else if (first == true) {
    renderWeatherComponent(weatherData);
  } else {
    document.querySelector("main").remove();
    document.querySelector("input").value = "";
    renderWeatherComponent(weatherData);
  }
}

// When new city is searched
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  renderer(weather(document.querySelector("input").value));
});

// Initial display
renderer(weather("lyon"), true);
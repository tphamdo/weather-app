function WeatherController() {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{0}?unitGroup={1}&key={2}&contentType=json`;
  const API_KEY = "E2Y5NVLK9MXTEK9PNQ362S754"; // this key is publicly avaiable

  async function getWeatherData(location) {
    let res = await fetch(url.format(location, "us", API_KEY));
    if (!res.ok) {
      throw Error("Response failed");
    }

    let json = await res.json();
    return extractJSON(json);
  }

  function extractJSON(json) {
    return {
      currentTemp: json.currentConditions.temp,
      currentConditions: json.currentConditions.conditions,
      description: json.description,
      resolvedAddress: json.resolvedAddress,
    };
  }

  return { getWeatherData };
}

function ScreenController() {
  const app = WeatherController();
  const form = document.querySelector("form");
  const location = document.querySelector("#location");
  const wc = document.querySelector(".weather-container");
  const errorMessage = document.querySelector(".error");

  form.onsubmit = handleSubmitForm;

  async function handleSubmitForm(event) {
    event.preventDefault();

    try {
      let data = await app.getWeatherData(location.value);
      updateDom(data);
    } catch (er) {
      errorMessage.textContent = `Failed to get weather data for "${location.value}"`;
    }
  }

  function updateDom(data) {
    // clear weather container
    wc.textContent = "";
    errorMessage.textContent = "";

    const h1 = document.createElement("h1");
    const temp = document.createElement("p");
    const currentCondition = document.createElement("p");
    const description = document.createElement("p");

    h1.textContent = `Weather in ${data.resolvedAddress}`;
    temp.textContent = `Temperature: ${data.currentTemp}°F`;
    currentCondition.textContent = `Current Conditions: ${data.currentConditions}`;
    description.textContent = `${data.description}`;
    [h1, temp, currentCondition, description].forEach((el) =>
      wc.appendChild(el),
    );
  }
}

String.prototype.format = function () {
  var args = arguments;
  return this.replace(/{([0-9]+)}/g, function (match, index) {
    return typeof args[index] == "undefined" ? match : args[index];
  });
};

ScreenController();

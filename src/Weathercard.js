/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useState, useEffect } from "react";
import Forecast from "./Forecast";
import north from "./compassSvg/north.svg";
import northeast from "./compassSvg/northeast.svg";
import northwest from "./compassSvg/northwest.svg";
import south from "./compassSvg/south.svg";
import southeast from "./compassSvg/southeast.svg";
import southwest from "./compassSvg/southwest.svg";
import east from "./compassSvg/east.svg";
import west from "./compassSvg/west.svg";
import humidityIcon from "./humidity.png";
import updateIcon from "./update-arrow.png";
import searchIcon from "./search.png";

const date = new Date().toDateString();
let rotation = 360;

const WeatherCards = (props) => {
  const [weatherData, setWeatherData] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");
  const [temperature, setTemperature] = useState("");
  const [minTemp, setMinTemp] = useState("");
  const [maxTemp, setMaxTemp] = useState("");
  const [feelsTemp, setFeelsTemp] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [speedUnit, setSpeedUnit] = useState("mph");
  const [tempUnit, setTempUnit] = useState("°F");
  const [location, setLocation] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [todayForecast, setTodayForecast] = useState("");

  const KEY = process.env.REACT_APP_KEY;

  const getweather = async (location, coords) => {
    let currentWeather;
    if (coords) {
      const userLatitude = location.latitude;
      const userLongitude = location.longitude;
      try {
        currentWeather = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${userLatitude}&lon=${userLongitude}&appid=${KEY}`,
          { mode: "cors" }
        );
      } catch (error) {
        console.log(error);
        return null;
      }
    } else {
      try {
        currentWeather = await fetch(
          "https://api.openweathermap.org/data/2.5/weather?q=" +
            location +
            "&appid=" +
            KEY,
          { mode: "cors" }
        );
      } catch (error) {
        console.log(error);
        return null;
      }
    }
    const weather = await currentWeather.json();
    if (Object.keys(weather)[0] === "cod") {
      console.log(Object.keys(weather)[0]);
      return alert("City not found");
    }
    const latitudeResult = weather.coord.lat;
    const longitudeResult = weather.coord.lon;
    window.parent.postMessage({ lat: latitudeResult, lon: longitudeResult });
    return setWeatherData(weather);
  };

  useEffect(() => {
    if (props.userPosition.latitude && props.userPosition.longitude) {
      getweather(props.userPosition, true);
    } else if (location) {
      getweather(location);
    }
  }, [location]);

  function FilterSearch() {
    const citysearch = document.getElementById("citysearch");

    const [isLocation, setIsLocation] = useState(false);
    const [locationsData, setLocationData] = useState("");

    const getLocation = async (location) => {
      const searchForLocation = await fetch(
        "https://api.openweathermap.org/geo/1.0/direct?q=" +
          location +
          "&limit=5&appid=" +
          KEY
      );
      const locationObject = await searchForLocation.json();
      return setLocationData(locationObject), setIsLocation(true);
    };

    useEffect(() => {
      if (isSearch) {
        getLocation(locationInput);
      }
    }, [isLocation]);

    if (isLocation && locationsData) {
      const mapLocations = locationsData.map((item, index) => {
        const { name, country, state } = { ...item };
        if (state) {
          return (
            <div
              key={index}
              onClick={() => {
                setLocation(name, country, state);
                setIsSearch(false);
                citysearch.value = "";
              }}
            >
              <p
                className="locations-name"
                onClick={() => {
                  setLocation(name, country);
                  setIsSearch(false);
                  citysearch.value = "";
                }}
              >
                {name}, {country}, {state}
              </p>
            </div>
          );
        } else {
          return (
            <div
              key={index}
              onClick={() => {
                setLocation(name, country);
                setIsSearch(false);
                citysearch.value = "";
              }}
            >
              <p
                className="locations-name"
                onClick={() => {
                  setLocation(name, country);
                  setIsSearch(false);
                  citysearch.value = "";
                }}
              >
                {name}, {country}
              </p>
            </div>
          );
        }
      });
      return <div>{mapLocations}</div>;
    }
  }

  function getDate(dt, timezone) {
    /// gets time and turns it into local timezone hours;
    const utc_seconds = parseInt(dt, 10) + parseInt(timezone, 10);
    const utc_milliseconds = utc_seconds * 1000;
    const localDate = new Date(utc_milliseconds).toUTCString();
    const localHours =
      new Date(localDate).getUTCHours() +
      ":" +
      new Date(localDate).getUTCMinutes();
    return localHours;
  }

  function getSunPosition(dt, timezone) {
    const utc_seconds = parseInt(dt, 10) + parseInt(timezone, 10);
    const utc_milliseconds = utc_seconds * 1000;
    const localDate = new Date(utc_milliseconds).toUTCString();
    const localHours = new Date(localDate).getUTCHours();
    return localHours;
  }
  const { temp, feels_like, temp_min, temp_max, humidity } = {
    ...weatherData.main,
  };
  const { name } = { ...weatherData };
  const { lon, lat } = { ...weatherData.coord };
  const { country, sunrise, sunset } = { ...weatherData.sys };
  const { speed } = { ...weatherData.wind };
  let { deg } = { ...weatherData.wind };
  const { dt, timezone } = { ...weatherData };
  const localTime = getDate(dt, timezone);
  const localHours = getSunPosition(dt, timezone);
  const sunriseTime = getSunPosition(dt, sunrise);
  const sunsetTime = getSunPosition(dt, sunset);

  useEffect(() => {
    if (
      (localHours > sunriseTime && localHours > sunsetTime) ||
      (localHours < sunriseTime && localHours < sunsetTime)
    ) {
      props.appclass("App-dark-mode");
    } else {
      props.appclass("");
    }
    //// if WeatherData.weather is not passed into state after checking dependency,
    // weatherData-weather contains no information and return undefined;
    setWeatherIcon(weatherData.weather);
    if (tempUnit === "°F") {
      setTemperature((((temp - 273.15) * 9) / 5 + 32).toFixed());
      setMaxTemp((((temp_max - 273.15) * 9) / 5 + 32).toFixed());
      setMinTemp((((temp_min - 273.15) * 9) / 5 + 32).toFixed());
      setFeelsTemp((((feels_like - 273.15) * 9) / 5 + 32).toFixed());
      setWindSpeed(speed);
    } /// if user click on update keep Imperial or metric system, by default is imperial
    if (tempUnit === "°C") {
      setTemperature((temp - 273.15).toFixed());
      setMaxTemp((temp_max - 273.15).toFixed());
      setMinTemp((temp_min - 273.15).toFixed());
      setFeelsTemp((feels_like - 273.15).toFixed());
      setWindSpeed((speed * 1.609).toFixed());
    }
    setLongitude(lon);
    setLatitude(lat);
  }, [weatherData.weather, weatherData]);

  ///wait for weatherIcon
  /// if available do
  const {
    main = false,
    description = false,
    icon,
  } = weatherData.weather ? { ...weatherData.weather[0] } : {};
  const iconURL = icon
    ? "https://openweathermap.org/img/w/" + icon + ".png"
    : "";

  function handleUnitChange(unit) {
    if (tempUnit === "°F" && unit === "C" && speedUnit === "mph") {
      setTempUnit("°C");
      setSpeedUnit("kph");
      setWindSpeed((windSpeed * 1.609).toFixed(2));
      setTemperature((((temperature - 32) * 5) / 9).toFixed());
      setFeelsTemp((((feelsTemp - 32) * 5) / 9).toFixed());
      setMaxTemp((((maxTemp - 32) * 5) / 9).toFixed());
      setMinTemp((((minTemp - 32) * 5) / 9).toFixed());
    }
    if (tempUnit === "°C" && unit === "F" && speedUnit === "kph") {
      setTempUnit("°F");
      setSpeedUnit("mph");
      setWindSpeed((windSpeed / 1.609).toFixed(2));
      setTemperature(((temperature * 9) / 5 + 32).toFixed());
      setFeelsTemp(((feelsTemp * 9) / 5 + 32).toFixed());
      setMaxTemp(((maxTemp * 9) / 5 + 32).toFixed());
      setMinTemp(((minTemp * 9) / 5 + 32).toFixed());
    }
    return;
  }

  function animate() {
    const updateIcon = document.getElementById("update-icon");
    updateIcon.style.transition = "all 1s";
    updateIcon.style.transform = "rotate(" + rotation + "deg)";
    return (rotation += 360);
  }

  if (deg > 22 && deg <= 67) {
    deg = northeast;
  }
  if (deg > 67 && deg <= 112) {
    deg = east;
  }
  if (deg > 112 && deg <= 157) {
    deg = southeast;
  }
  if (deg > 157 && deg <= 202) {
    deg = south;
  }
  if (deg > 202 && deg <= 247) {
    deg = southwest;
  }
  if (deg > 247 && deg <= 292) {
    deg = west;
  }
  if (deg > 292 && deg <= 337) {
    deg = northwest;
  }
  if ((deg >= 337 && deg <= 360) || (deg >= 0 && deg < 22)) {
    deg = north;
  }

  function TodayForecast() {
    if (todayForecast) {
      const today = todayForecast.map((item, index) => {
        const iconURL = item[1];
        const temperature = item[3];
        const forecastTime = item[4];
        return (
          <div key={index}>
            <img src={iconURL} alt={item[2]}></img>
            <p>{temperature}°</p>
            <p>{forecastTime}</p>
          </div>
        );
      });
      return <div id="today-forecast">{today}</div>;
    }
  }

  return (
    <div id="weather-cards">
      <div id="forecast-container">
        <div className="change-units">
          <div onClick={() => handleUnitChange("C")} id="celsius">
            C°
          </div>
          <div onClick={() => handleUnitChange("F")} id="fahr">
            F°
          </div>
        </div>
        <div id="secondary-info">
          <p>
            {country}, {name}
          </p>
          <img src={iconURL} alt={main}></img>
          <p>
            {feelsTemp}
            {tempUnit}
          </p>
        </div>
        <div id="searchfield">
          <img
            src={searchIcon}
            id="search-icon"
            alt="search"
            onClick={() => setIsSearch(true)}
          ></img>
          <input
            id="citysearch"
            type="text"
            placeholder="London, CA / Barcelona"
            onChange={(e) => {
              setLocationInput(e.target.value);
              setIsSearch(false);
            }}
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                setIsSearch(true);
              }
            }}
          ></input>
          <div id="found-locations">
            <FilterSearch></FilterSearch>
          </div>
        </div>
        {latitude && longitude && (
          <Forecast
            locationLon={longitude}
            locationLat={latitude}
            setToday={setTodayForecast}
            units={tempUnit}
          ></Forecast>
        )}
      </div>

      <div id="card" style={{ display: main ? "flex" : "none" }}>
        <div id="update-container">
          <p>{date}</p>
          <img
            id="update-icon"
            onClick={() => {
              getweather(location);
              animate();
            }}
            src={updateIcon}
            alt="update"
          ></img>
        </div>
        <div className="location">
          <div id="location-temperature">
            <p>
              {country}, {name}
            </p>
            <p id="feels-like">
              {feelsTemp} {tempUnit}
            </p>
          </div>
          <div id="icon-description">
            <img src={iconURL} alt={main}></img>
            <p id="description">{description}</p>
          </div>
        </div>
        <div id="temperature">
          <p className="temp-info">
            {maxTemp} / {minTemp}
            {tempUnit}
          </p>
        </div>
        <div className="wind">
          <p>
            Wind speed: {windSpeed} {speedUnit}
          </p>
          <div id="compass-container">
            <img id="compass" src={deg} alt={deg}></img>
          </div>
          <div id="humidity-container">
            <img id="humidity-icon" src={humidityIcon} alt={humidity}></img>
            <p>{humidity} %</p>
          </div>
        </div>
        <div id="today-forecast-container">
          <TodayForecast></TodayForecast>
        </div>
      </div>
    </div>
  );
};

export default WeatherCards;

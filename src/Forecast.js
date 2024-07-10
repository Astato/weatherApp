import React from "react";
import { useState, useEffect } from "react";

const currentDay = new Date().getUTCDate();
let upcomingForecast = [];
let today = [];

export function mapForecast(tempUnit, forecast) {
  if (upcomingForecast.length > 1 && today.length > 1) {
    return;
  }
  const forecastList = forecast.map((item) => {
    const { dt_txt } = { ...item };
    const forecastTime = dt_txt.split(" ")[1].slice(0, 5);
    const forecastDay = dt_txt.split(" ")[0].split("-")[2];
    let { feels_like } = { ...item.main };
    if (tempUnit === "°F") {
      feels_like = (((feels_like - 273.15) * 9) / 5 + 32).toFixed();
    }
    if (tempUnit === "°C") {
      feels_like = (feels_like - 273.15).toFixed();
    }
    const { main, icon } = { ...item.weather[0] };
    const iconURL = "https://openweathermap.org/img/w/" + icon + ".png";
    if (Number(forecastDay) > currentDay) {
      upcomingForecast.push([
        forecastDay,
        iconURL,
        main,
        feels_like,
        forecastTime,
        dt_txt,
      ]);
    }
    if (Number(forecastDay) <= currentDay + 1) {
      today.push([
        forecastDay,
        iconURL,
        main,
        feels_like,
        forecastTime,
        dt_txt,
      ]);
    }
    return upcomingForecast, today;
  });
  return forecastList;
}

const Forecast = (props) => {
  const [forecast, setForecast] = useState("");
  const latitude = props.locationLat.toString();
  const longitude = props.locationLon.toString();
  const tempUnit = props.units;

  useEffect(() => {
    async function getForecast() {
      const rawForecast = await fetch(
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
          latitude +
          "&lon=" +
          longitude +
          "&appid=58ab3e4fa033b9933bab777dff79301b",
        { mode: "cors" }
      );
      const forecastData = await rawForecast.json();
      return setForecast(forecastData);
    }
    today = [];
    upcomingForecast = [];
    getForecast();
  }, [latitude, longitude, tempUnit]);

  useEffect(() => {
    if (today.length > 1) {
      props.setToday(today);
    }
  });

  if (forecast) {
    const { list } = { ...forecast };

    mapForecast(tempUnit, list);

    function handleClick(day) {
      const expandElements = document.getElementsByClassName(day);
      const show = "display:flex; flex-direction:column;";
      Array.from(expandElements).forEach((element) => {
        switch (element.style.display) {
          case "":
          case "none":
            element.setAttribute("style", show);
            return;
          case "flex":
            element.style.display = "none";
            return;
          default:
            element.style.display = "none;";
        }
      });
    }

    function getMinMaxTemp(day) {
      let maxtemp = -10000;
      let minTemp = 10000;
      for (const item of upcomingForecast) {
        if (Number(item[3]) > Number(maxtemp) && item[0] === day) {
          maxtemp = Number(item[3]);
        }
        if (Number(item[3]) < minTemp && item[0] === day) {
          minTemp = Number(item[3]);
        }
      }
      return [maxtemp, " / ", minTemp];
    }

    let dayAdded = false;
    let dayDate;
    let day;
    const extendedForecast = upcomingForecast.map((item, index) => {
      const iconURL = item[1];
      const temperature = item[3];
      const forecastTime = item[4];

      if (!dayDate !== item[0]) {
        dayDate = item[0];
      }
      /// after the tomorrow day has been added, check if the current element is same as previous, if not, set dayAdded to false, to add the next day
      // example: previous date = 17 (tomorrow) current date 18.  .
      if (
        index > 0 &&
        upcomingForecast[index][0] !== upcomingForecast[index - 1][0]
      ) {
        dayAdded = false;
      }

      let extended;
      ///// Tomorrow day if no day has not been added yet
      if (!dayAdded && !day) {
        day = (
          <div key={index} id="day" onClick={() => handleClick(item[0])}>
            <p>Tomorrow</p>
            <div style={{ display: "flex" }}>
              <img src={iconURL} alt={item[2]}></img>
              <p>{getMinMaxTemp(item[0])}°</p>
            </div>
          </div>
        );
        /// add the first item before the return otherwise the first item is missing
        extended = (
          <div key={index + 1} id="extended" className={item[0]}>
            <p>{temperature}°</p>
            <img src={iconURL} alt={item[2]}></img>
            <p>{forecastTime}</p>
          </div>
        );
        dayAdded = true;
        return [day, extended];
      }
      if (item[0] === dayDate && !dayAdded) {
        const forecastDay = new Date(item[5]).toDateString().split(" ")[0];
        // averageTemperature = (averageTemperature / addedTemperatures).toFixed();
        day = (
          <div key={index} id="day" onClick={() => handleClick(item[0])}>
            <p>{forecastDay}</p>
            <div style={{ display: "flex" }}>
              <img src={iconURL} alt={item[2]}></img>
              <p>{getMinMaxTemp(item[0])}°</p>
            </div>
          </div>
        );
        /// same principle as the first day,extended return
        extended = (
          <div key={index + 1} id="extended" className={item[0]}>
            <p>{temperature}°</p>
            <img src={iconURL} alt={item[2]}></img>
            <p>{forecastTime}</p>
          </div>
        );
        dayAdded = true;
        return [day, extended];
      }
      /// continure the iteration to add the remaining items of the current day once the day was added to the component.
      if (dayDate === item[0]) {
        extended = (
          <div key={index} id="extended" className={item[0]}>
            <p>{temperature}°</p>
            <img src={iconURL} alt={item[2]}></img>
            <p>{forecastTime}</p>
          </div>
        );
        return extended;
      }

      return [day, extended];
    });

    return <div id="forecast">{extendedForecast}</div>;
  }
};

export default Forecast;

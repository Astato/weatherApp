import "./style.css";
// import ReactDOM from 'react-dom/client';
import React, { useEffect, useState } from "react";
import WeatherCards from "./Weathercard";
// import Forecast from './Forecast';

const NavBar = () => {
  return (
    <footer className="navbar">
      <h1>WeatherWise</h1>
      {/* <div id='searchfield'>
        <label htmlFor='citysearch'>Search: </label>
        <input id='citysearch' type='text' placeholder='New York'></input>
      </div> */}
      <a href="https://openweathermap.org/" target="_blank" rel="noreferrer">
        Powered by OpenWeather
      </a>
    </footer>
  );
};

function App() {
  const [appClass, setAppClass] = useState("");
  const [userPosition, setUserPosition] = useState({});

  useEffect(() => {}, [appClass]);

  useEffect(() => {
    const query = window.location.search;
    const params = new URLSearchParams(query);
    const latitude = params.get("latitude");
    const longitude = params.get("longitude");
    setUserPosition({ latitude: latitude, longitude: longitude });
  }, []);

  return (
    <div id="App" className={appClass}>
      <div id="weather-cards-container">
        <WeatherCards
          appclass={setAppClass}
          userPosition={userPosition}
        ></WeatherCards>
      </div>
      <NavBar></NavBar>
    </div>
  );
}

export default App;

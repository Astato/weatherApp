import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <>
      <App />
    </>
);

/* </React.StrictMode> */



// function getDate(dt, timezone) {
//   const utc_seconds = parseInt(dt, 10) + parseInt(timezone, 10);
//   const utc_milliseconds = utc_seconds * 1000;
//   const localDate = new Date(utc_milliseconds).toUTCString();
//   const localHours = new Date(localDate).getUTCHours()
//   return localHours;
// }

    // const localHours = getDate(dt,timezone)




  //   if (deg > 22 && deg <= 67) {
  //     deg = northeast;
  // }

  // else if (deg > 67 && deg <= 112) {
  //     deg = east;
  // }
  // else if (deg > 112 && deg <= 157) {
  //     deg =  southeast;

  // }
  // else if (deg > 157 && deg <= 202 ) {
  //     deg = south;

  // }
  // else if (deg > 202 && deg <= 247) {
  //     deg = southwest;

  // }
  // else if( deg > 247 && deg <= 292) {
  //     deg = west

  // }
  // else if (deg > 292 && deg <= 337 ) {
  //     deg = northwest

  // }
  // else if ((deg >=337 && deg <= 360 )|| (deg >= 0 && deg < 22)) {
  //     deg = north
  // }

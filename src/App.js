import React, { useState } from "react";
import "./App.css";
import GeoChart from "./components/GeoChart";
import geoData from "./data/GeoChart.world.geo.json";

function App() {
  const [property, setProperty] = useState("pop_est");
  
  return (
    <React.Fragment>
      <div className="row" id="GeoChart">
      <h2>Select property to highlight</h2>
      <select
        value={property}
        onChange={event => setProperty(event.target.value)}
      >
        <option value="pop_est">Population</option>
        <option value="name_len">Name length</option>
        <option value="gdp_md_est">GDP</option>
      </select>
        <GeoChart data={geoData} property={property} />
      </div>
     
    </React.Fragment>
  );
}

export default App;

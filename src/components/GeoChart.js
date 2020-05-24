import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, min, max, scaleLinear } from "d3";
import useResizeObserver from "../useResizeObserver";
import populationData from "../data/population.json";
import BarChart from "./BarChart";
import Piechart from "./Piechart";

/**
 * Component that renders a map of countries.
 */

function GeoChart({ data, property }) {
  const allKeys = ["men", "women"];
  const [keys, setKeys] = useState(allKeys);
  const colors = {
    "men": "green",
    "women": "orange",
  };
const [popData, setPopData] = useState(null);

  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);

    const minProp = min(data.features, feature => feature.properties[property]);
    const maxProp = max(data.features, feature => feature.properties[property]);
    const colorScale = scaleLinear()
      .domain([minProp, maxProp])
      .range(["#ccc", "orange"]);

    // use resized dimensions
    // but fall back to getBoundingClientRect, if no dimensions yet.
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // projects geo-coordinates on a 2D plane
    const projection = geoMercator()
      .fitSize([width, height], selectedCountry || data)
      .precision(100);

    // takes geojson data,
    // transforms that into the d attribute of a path element
    const pathGenerator = geoPath().projection(projection);

    // render each country
    svg
      .selectAll(".country")
      .data(data.features)
      .join("path")
      .on("click", feature => {
        setSelectedCountry(selectedCountry === feature ? null : feature);
      })
      .on("mouseover", feature=>{
        displayToolTip(feature, selectedCountry === feature ? null : feature )
      })
      .on("mouseout", hide)
      .attr("class", "country")
      .transition()
      .attr("fill", feature => colorScale(feature.properties[property]))
      .attr("d", feature => pathGenerator(feature));


     
    function displayToolTip(feature, country){
      svg
      .selectAll(".labelTxt")
      .data([country])
      .join("text")
      .attr("opacity","1")
      .attr("class", "labelTxt")
      .text(
        feature =>
          feature &&
          feature.properties.name +
            ": " +
            feature.properties[property].toLocaleString()
      )
      .attr("x", 10)
      .attr("y", 25).style("fill", "red");
      setPopData(populationData[country]);
      
    }
    
    function hide(event, x, y){
      svg.selectAll(".labelTxt").attr("opacity","0");
    }
    // render text
    svg
      .selectAll(".label")
      .data([selectedCountry])
      .join("text")
      .attr("class", "label")
      .text(
        feature =>
          feature &&
          feature.properties.name +
            ": " +
            feature.properties[property].toLocaleString()
      )
      .attr("x", 10)
      .attr("y", 25);
  }, [data, dimensions, property, selectedCountry]);

  return (
    <div>
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
    </div>

    <div id="pieChart">
  <h3>{selectedCountry!=null? selectedCountry.properties.name:"India"} population data</h3>
<Piechart 
selectedCountry={selectedCountry!=null? selectedCountry.properties.name:"India" } 
    data={populationData[selectedCountry!=null? selectedCountry.properties.name:"India"]}
    keys={keys} colors={colors} ></Piechart>
</div>
  
<div id="barChart">
<h3>{selectedCountry!=null? selectedCountry.properties.name:"India"} population data</h3>
<BarChart 
selectedCountry={selectedCountry!=null? selectedCountry.properties.name:"India" } 
      data={populationData[selectedCountry!=null? selectedCountry.properties.name:"India"]} 
      keys={keys} colors={colors}></BarChart>
    </div>
    </div>
  );
}

export default GeoChart;

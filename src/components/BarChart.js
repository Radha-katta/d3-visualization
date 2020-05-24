import React, { useEffect, useRef } from "react";
import {
  select,
  scaleBand,
  axisBottom,
  scaleLinear,
  axisLeft,max, axisRight
} from "d3";
import useResizeObserver from "../useResizeObserver";
import populationData from "../data/population.json";


function BarChart({ selectedCountry, data, keys, colors}) {

    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
    if(data == undefined){
      data = populationData["India"];
    }
  
    // will be called initially and on every data change
    useEffect(() => {
      const svg = select(svgRef.current);
      const { width, height } =
        dimensions || wrapperRef.current.getBoundingClientRect();
        let maxVal =  max(data, d => parseInt(d.population));
  
      // scales
      const xScale = scaleBand()
        .domain(data.map(d => d.year))
        .range([0, width])
        .padding(0.5);
        const extent = [
            0,
            maxVal
          ];
  
      const yScale = scaleLinear()
        .domain(extent)
        .range([height, 0]);
         // axes
      const xAxis = axisBottom(xScale);
      const yAxis = axisLeft(yScale);
     
      svg.select(".x-axis")
        .attr("transform", `translate(50, ${height-20})`)
        .call(xAxis);
      svg.select(".y-axis")
      .attr("transform", `translate(50, -20)`)
      .call(yAxis);
  
        
      // rendering
      svg
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("class", "rect")
        .attr("x", d => xScale(d.year)+70)
       // .attr("width", xScale.bandwidth())
       .attr("width", 50)
        .attr("y", d => yScale(parseInt(d.population))-20)
        .attr("height",d =>yScale(parseInt(maxVal - d.population)))
        .style("fill", "orange")
        .on("mouseover", (d,e, all)=>{
            displayToolTip(d,e, all)
          })
          .on("mouseout", (d,e, all)=>{ hide(d,e, all)})
          .on("click", d=>{
               barchickHandler(d);
          })
  //Actions
  function barchickHandler(barData){
  // this(selectedCountry, rectData, keys, colors);
  svg
    .selectAll(".labelTxt")
    .data([barData])
    .join("text")
    .attr("opacity","1")
    .attr("class", "labelTxt")
    .text(
      d =>{
        let x =  "Men :"+d.men +"\t"+"women :"+ d.women;
        return x;
      }
    )
    .attr("x", 50)
    .attr("y", 25).style("fill", "red");
  }
  function displayToolTip(barData, i, all){
   // if(event && event.currentTarget){
      let rect = all[i];
      rect.setAttribute("width", 80);
      rect.setAttribute("style", "fill: red;");
    //}
    
    svg
    .selectAll(".labelTxt")
    .data([barData])
    .join("text")
    .attr("opacity","1")
    .attr("class", "labelTxt")
    .text(
      d =>
        selectedCountry+":"+d.population
    )
    .attr("x", 50)
    .attr("y", 25).style("fill", "red");
    
  }
  
  function hide(data,i, all){
    let rect = all[i];
    rect.setAttribute("width", 50);
    rect.setAttribute("style", "fill: orange;");
    svg.selectAll(".labelTxt").attr("opacity","0");
  }
     
    }, [colors, data, dimensions, keys]);
  
    return (
      <React.Fragment>
        <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
          <svg ref={svgRef}>
            <g className="x-axis" />
            <g className="y-axis" />
          </svg>
        </div>
      </React.Fragment>
    );
  }
  

export default BarChart;
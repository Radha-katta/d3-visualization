import React, { useEffect, useRef, useState} from "react";
import useResizeObserver from "../useResizeObserver";
import { select, arc,
    pie,max, scaleLinear, scaleOrdinal
     } from "d3";
import { interpolate } from 'd3-interpolate';
import populationData from "../data/population.json";

let defaultProps = {
    width: 300,
    height: 300,
    transition: 400
  };
  
function PieChart({ selectedCountry, data, keys, colors}) {
    const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
 const width =defaultProps.width;
 const height = defaultProps.height;

  const radius = Math.min(width, height) / 2;
  if(data == undefined){
    data = populationData["India"];
  }

  useEffect(
    () => {

      let maxVal =  max(data, d => parseInt(d.population));
      const colorScale = scaleLinear()
      .domain([0, maxVal])
      .range(["grey", "orange"]);
       
        const svg = select(svgRef.current);
      //const data = createPie(data);
      //const group = d3.select(svgRef.current);
      const sortedPie = pie()
                .value(d => d.population)
                .sort(null);
      const path = arc()
      .outerRadius(radius - 10)
                    .innerRadius(0);
    var arcOver = arc().outerRadius(radius + 20).innerRadius(radius - 180);


    const label = arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);
    const g = svg
      .selectAll('.arc')
      .data(sortedPie(data))
      .enter()
      .append('g')
      .attr('class', 'arc')
      .attr('transform', 'translate(' + (width / 2 )+  ',' + height / 2 + ')')
      .on("mouseover", (d,i, all )=>{
        displayToolTip(d,i, all )
      })
      .on("mouseout", hide)
      .on("mouseenter", function (d) {
        select(this)
            .attr("stroke", "white")
            .transition()
            .duration(200)
            .attr("d", arcOver)
            .attr("stroke-width", 2);
      })
      .on("mouseleave", function (d) {
        select(this).transition()
            .duration(200)
            .attr("d", arcOver)
            .attr("stroke", "none");
    }).on("click", d=>{
      arcClickHandler(d);
    })


   g.append('path')
     // .style('fill', (d,i)=> colorScale(i) )
     .style('fill', (d,i)=> colorScale(d.data.population) )
      .transition()
      .duration(1000)
      .attrTween('d', (d) => {
        const i = interpolate(d.startAngle + 0.1, d.endAngle);

        return (t) => {
          d.endAngle = i(t);
          return path(d);
        }
      })
      

   g.append('text')
    .text((d,i)=>d.data.year)
      .attr('transform', d => `translate(${label.centroid(d)})`)
      .attr('dy', '.35em')
      .transition()
      .delay(1000);

  function arcClickHandler(barData){
    svg
      .selectAll(".labelTxt")
      .data([barData.data])
      .join("text")
      .attr("opacity","1")
      .attr("class", "labelTxt")
      .text(
        d =>{
          let x =  "population: "+d.population;
          return x;
        })
      .attr("x", 500)
      .attr("y", 25).style("fill", "red");
  }

      
  function displayToolTip(barData,i, all){
        svg
        .selectAll(".labelTxt")
        .data([barData.data])
        .join("text")
        .attr("opacity","1")
        .attr("class", "labelTxt")
        .text(
          d =>{
              let x ="Men :"+d.men +"\t"+" WoMen :"+d.women;
              return x;
          }   
        )
        .attr("x", 300)
        .attr("y", 25).style("fill", "red");
      }
      
      function hide(event, x, y){
        svg.selectAll(".labelTxt").attr("opacity","0");
      }
    },
    [colors, data, dimensions, keys]);

return (
    <React.Fragment>
      <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
        <svg ref={svgRef}>
        </svg>
      </div>
    </React.Fragment>
  );
}
export default PieChart;
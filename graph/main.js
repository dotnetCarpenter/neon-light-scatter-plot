import "./style.css"
import * as d3 from "d3"
// import * as Plot from "@observablehq/plot"
import {ConnectedScatterplot} from "./ConnectedScatterPlot.js"

const filterId = "drop-shadow"

const driving = await d3.csv ("/driving.csv", null, d => ({
  ...d,
  gas: +d.gas,
  miles: +d.miles }))

const graph = ConnectedScatterplot (driving, {
  x: d => d.miles,
  y: d => d.gas,
  title: d => d.year,
  orient: d => d.side,
  yFormat: ".2f",
  xLabel: "Miles driven (per capita per year) →",
  yLabel: "↑ Price of gas (per gallon, adjusted average $)",
  width: window.innerWidth,
  height: 720,
  duration: 5000, // for the intro animation; 0 to disable
  stroke: "hsl(144, 52%, 88%)",
  // fill: "hsl(112, 100%, 57%)",
  filterName: filterId,
  // halo: "#1b1e23"
})

const filter = (
  graph.svg.append ("filter")
    .attr ("id", filterId)
    .attr ("color-interpolation-filters", "sRGB")
)

filter.append ("feDropShadow")
      .attr ("dx", 0)
      .attr ("dy", 0)
      .attr ("stdDeviation", 0.5)
      .attr ("flood-opacity", 0.5)
      .attr ("flood-color", "hsl(112, 100%, 57%)")

filter.append ("feDropShadow")
      .attr ("dx", 0)
      .attr ("dy", 0)
      .attr ("stdDeviation", 0.5)
      .attr ("flood-opacity", 0.5)
      .attr ("flood-color", "hsl(115, 100%, 56%)")

filter.append ("feDropShadow")
      .attr ("dx", 0)
      .attr ("dy", 0)
      .attr ("stdDeviation", 2)
      .attr ("flood-opacity", 0.5)
      .attr ("flood-color", "hsl(119, 100%, 55%)")

filter.append ("feDropShadow")
      .attr ("dx", 0)
      .attr ("dy", 0)
      .attr ("stdDeviation", 4)
      .attr ("flood-opacity", 0.5)
      .attr ("flood-color", "hsl(122, 100%, 53%)")

document.querySelector ("#app").append (graph)

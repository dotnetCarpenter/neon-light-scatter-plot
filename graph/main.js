import "./style.css"
import * as d3 from "d3"
// import * as Plot from "@observablehq/plot"
import {ConnectedScatterplot} from "./ConnectedScatterPlot.js"

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
  stroke: "hsl(144, 52%, 88%)"
})

// const graph = Plot.plot ({
//   grid: true,
//   width: window.innerWidth,
//   height: window.innerHeight,
//   x: {label: "Miles driven (per capita per year) →"},
//   y: {label: "↑ Price of gas (average per gallon, adjusted)"},
//   marks: [
//     Plot.line (driving, {x: "miles", y: "gas", curve: "catmull-rom"}),
//     Plot.dot  (driving, {x: "miles", y: "gas", fill: "currentColor"}),
//     Plot.text (driving, {filter: d => d.year % 5 === 0, x: "miles", y: "gas", text: "year", dy: -8})
//   ]
// })

document.querySelector ("#app").append (graph)

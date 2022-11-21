import "./style.css"
import {csv} from "d3"
import {ConnectedScatterplot} from "./ConnectedScatterPlot.js"

//    filterId :: String
const filterId = "drop-shadow"

//  chartConfig :: ObjMap
let chartConfig = {
  x: d => d.miles,
  y: d => d.gas,
  title: d => d.year,
  orient: d => d.side,
  yFormat: ".2f",
  xLabel: "Miles driven (per capita per year) →",
  yLabel: "↑ Price of gas (per gallon, adjusted average $)",
  marginTop: 20,    // top margin, in pixels
  marginRight: 20,  // right margin, in pixels
  marginBottom: 30, // bottom margin, in pixels
  marginLeft: 30,   // left margin, in pixels
  width: (visualViewport.width - 50) * visualViewport.scale,
  height: (visualViewport.height - 50) * visualViewport.scale,
  duration: 5000, // for the intro animation; 0 to disable
  stroke: "hsl(144, 52%, 88%)",
  filterName: filterId,
}

//    getData  :: a -> Async Array
const getData = async path => (
  csv (import.meta.env.BASE_URL + path, null, d => ({
    ...d,
    gas: +d.gas,
    miles: +d.miles }))
)

//    createChart :: Object -> Chart
const createChart = data => (
  ConnectedScatterplot (data, chartConfig)
)

//    applyFilters :: Chart -> Chart
const applyFilters = chart => {
  const filter = (
    chart.svg.append ("filter")
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
        .attr ("stdDeviation", 1)
        .attr ("flood-opacity", 0.5)
        .attr ("flood-color", "hsl(115, 100%, 56%)")

  filter.append ("feDropShadow")
        .attr ("dx", 0)
        .attr ("dy", 0)
        .attr ("stdDeviation", 3)
        .attr ("flood-opacity", 0.5)
        .attr ("flood-color", "hsl(119, 100%, 55%)")

  filter.append ("feDropShadow")
        .attr ("dx", 0)
        .attr ("dy", 0)
        .attr ("stdDeviation", 5)
        .attr ("flood-opacity", 0.5)
        .attr ("flood-color", "hsl(122, 100%, 53%)")

  return chart
}

// const update =

// main
getData ("driving.csv")
  .then (createChart)
  .then (applyFilters)
  .then (chart => {
    document.querySelector ("#app").append (chart)
    return chart
  })
  .then (({data}) => {
    window.addEventListener ('resize', () => {
      chartConfig.width  = visualViewport.width * visualViewport.scale
      chartConfig.height = visualViewport.height * visualViewport.scale

      document.querySelector ("#app").replaceChildren (applyFilters (createChart (data)))
    })
  })

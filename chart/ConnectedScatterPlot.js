import {
	curveCatmullRom,
	scaleLinear,
	map,
	range,
	nice,
	extent,
	axisBottom,
	axisLeft,
	line,
	create,
	select,
	easeLinear } from "d3"

export const ConnectedScatterplot =
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/connected-scatterplot
// Lightly modified by: dotnetcarpenter
function ConnectedScatterplot (data, {
  x = ([x]) => x, // given d in data, returns the (quantitative) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  r = 3, // (fixed) radius of dots, in pixels
  title, // given d in data, returns the label
  orient = () => "top", // given d in data, returns a label orientation (top, right, bottom, left)
  defined, // for gaps in data
  curve = curveCatmullRom, // curve generator for the line
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  marginTop = 20, // top margin, in pixels
  marginRight = 20, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 30, // left margin, in pixels
  inset = r * 2, // inset the default range, in pixels
  insetTop = inset, // inset the default y-range
  insetRight = inset, // inset the default x-range
  insetBottom = inset, // inset the default y-range
  insetLeft = inset, // inset the default x-range
  xType = scaleLinear, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft + insetLeft, width - marginRight - insetRight], // [left, right]
  xFormat, // a format specifier string for the x-axis
  xLabel, // a label for the x-axis
  yType = scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom - insetBottom, marginTop + insetTop], // [bottom, top]
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  fill = "white", // fill color of dots
  stroke = "currentColor", // stroke color of line and dots
  strokeWidth = 2, // stroke width of line and dots
  strokeLinecap = "round", // stroke line cap of line
  strokeLinejoin = "round", // stroke line join of line
  halo = "#fff", // halo color for the labels
  haloWidth = 6, // halo width for the labels
  duration = 0, // intro animation in milliseconds (0 to disable)
	filterName: filterId,
} = {}) {
  // Compute values.
  const X = map(data, x);
  const Y = map(data, y);
  const T = title == null ? null : map(data, title);
  const O = map(data, orient);
  const I = range(X.length);
  if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
  const D = map(data, defined);

   // Compute default domains.
  if (xDomain === undefined) xDomain = nice(...extent(X), width / 80);
  if (yDomain === undefined) yDomain = nice(...extent(Y), height / 50);

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);
  const xAxis = axisBottom(xScale).ticks(width / 80, xFormat);
  const yAxis = axisLeft(yScale).ticks(height / 50, yFormat);

  // Construct the line generator.
  const lineGen = line()
      .curve(curve)
      .defined(i => D[i])
      .x(i => xScale(X[i]))
      .y(i => yScale(Y[i]));

  const svg = create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("y2", marginTop + marginBottom - height)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", width)
          .attr("y", marginBottom - 4)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text(xLabel));

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yLabel));

  const path = svg.append("path")
      .attr("fill", "none")
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("stroke-linecap", strokeLinecap)
      .attr("d", lineGen(I))
			.attr("filter", `url(#${filterId})`);

  svg.append("g")
      .attr("fill", fill)
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
    .selectAll("circle")
    .data(I.filter(i => D[i]))
    .join("circle")
      .attr("cx", i => xScale(X[i]))
      .attr("cy", i => yScale(Y[i]))
      .attr("r", r);

  const label = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("stroke-linejoin", "round")
    .selectAll("g")
    .data(I.filter(i => D[i]))
    .join("g")
      .attr("transform", i => `translate(${xScale(X[i])},${yScale(Y[i])})`);

  if (T) label.append("text")
      .text(i => T[i])
      .each(function(i) {
        const t = select(this);
        switch (O[i]) {
          case "bottom": t.attr("text-anchor", "middle").attr("dy", "1.4em"); break;
          case "left": t.attr("dx", "-0.5em").attr("dy", "0.32em").attr("text-anchor", "end"); break;
          case "right": t.attr("dx", "0.5em").attr("dy", "0.32em").attr("text-anchor", "start"); break;
          default: t.attr("text-anchor", "middle").attr("dy", "-0.7em"); break;
        }
      })
      .call(text => text.clone(true))
      .attr("fill", "none")
      .attr("stroke", halo)
      .attr("stroke-width", haloWidth);

  // Measure the length of the given SVG path string.
  function length(path) {
    return create("svg:path").attr("d", path).node().getTotalLength();
  }

  function animate() {
    if (duration > 0) {
      const l = length(lineGen(I));

      path
          .interrupt()
          .attr("stroke-dasharray", `0,${l}`)
        .transition()
          .duration(duration)
          .ease(easeLinear)
          .attr("stroke-dasharray", `${l},${l}`);

      label
          .interrupt()
          .attr("opacity", 0)
        .transition()
          .delay(i => length(lineGen(I.filter(j => j <= i))) / l * (duration - 125))
          .attr("opacity", 1);
    }
  }

  animate();

  return Object.assign(svg.node(), {animate, svg});
}
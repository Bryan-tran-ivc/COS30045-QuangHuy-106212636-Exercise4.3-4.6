const svg = d3.select(".responsive-svg-container")
  .append("svg")
  .attr("viewBox", "0 0 600 520")
  .attr("role", "img")
  .attr("aria-label", "Practice count of TV models by brand, shown as horizontal bars");

d3.csv("data/tvBrandCount.csv", d => {
  if (!d.brand?.trim()) return null;
  return { brand: d.brand.trim(), count: +d.count };
}).then(data => {
  console.log(data);
  console.log("Rows:", data.length);
  console.log("Maximum:", d3.max(data, d => d.count));
  console.log("Minimum:", d3.min(data, d => d.count));
  console.log("Extent:", d3.extent(data, d => d.count));

  data.sort((a, b) => b.count - a.count);
  drawBarChart(data);
  d3.select("#load-status").classed("loaded", true).text(`${data.length} rows loaded`);
}).catch(error => {
  console.error(error);
  d3.select("#load-status").text("CSV failed to load");
  d3.select("#chart-error").property("hidden", false)
    .text("Serve this folder with a local server, then reload the page.");
});

const drawBarChart = data => {
  // Scales fit the data inside the SVG.
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .range([0, 380]);

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand))
    .range([0, 500])
    .padding(0.1);
  const colourScale = d3.scaleOrdinal()
    .domain(["samsung", "kogan", "lg", "hisense"])
    .range(["#ed7d31"])
    .unknown("#286fbd");

  // Keep each bar and its labels together.
  const barAndLabel = svg
    .selectAll("g.bar-row")
    .data(data)
    .join("g")
    .attr("class", "bar-row")
    .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

  barAndLabel
    .append("rect")
    .attr("class", "bar")
    .attr("fill", d => colourScale(d.brand))
    .attr("x", 120)
    .attr("y", 0)
    .attr("width", d => xScale(d.count))
    .attr("height", yScale.bandwidth());

  barAndLabel
    .append("text")
    .attr("class", "brand-label")
    .text(d => d.brand)
    .attr("x", 110)
    .attr("y", yScale.bandwidth() / 2 + 5)
    .attr("text-anchor", "end");

  barAndLabel
    .append("text")
    .attr("class", "value-label")
    .text(d => d.count)
    .attr("x", d => 120 + xScale(d.count) + 5)
    .attr("y", yScale.bandwidth() / 2 + 5);
};

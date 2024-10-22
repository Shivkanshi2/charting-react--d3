
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = ({
  data,
  width,
  height,
  xAccessor,
  yAccessor,
  dimensions,
  measures,
  tooltipFormat,
  annotations,
  xAxisLabel,
  yAxisLabel,
  colors,
  onHover,
}) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(data.map(xAccessor))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, yAccessor)])
      .nice()
      .range([innerHeight, 0]);

    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(xAccessor(d)))
      .attr('y', d => yScale(yAccessor(d)))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(yAccessor(d)))
      .attr('fill', (d, i) => colors[i % colors.length])
      .on('mouseover', (event, d) => {
        if (onHover) onHover(d);
        const tooltip = d3.select('#tooltip')
          .style('visibility', 'visible')
          .text(tooltipFormat(d));
      })
      .on('mousemove', (event) => {
        d3.select('#tooltip')
          .style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 10) + 'px');
      })
      .on('mouseout', () => {
        d3.select('#tooltip').style('visibility', 'hidden');
      });

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('x', innerWidth)
      .attr('y', -6)
      .attr('fill', 'white')
      .attr('text-anchor', 'end')
      .text(xAxisLabel);

    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('fill', 'white')
      .attr('text-anchor', 'end')
      .text(yAxisLabel);

    if (annotations) {
      annotations.forEach(annotation => {
        g.append('text')
          .attr('x', xScale(annotation.x))
          .attr('y', yScale(annotation.y))
          .attr('dy', '-0.5em')
          .attr('fill', 'red')
          .text(annotation.label);
      });
    }
  }, [data, width, height, xAccessor, yAccessor, xAxisLabel, yAxisLabel, colors, annotations]);

  return (
    <>
      <svg ref={svgRef}></svg>
      <div id="tooltip" style={{ position: 'absolute', visibility: 'hidden', background: 'lightgray', padding: '5px', borderRadius: '5px' }}></div>
    </>
  );
};

export default BarChart;

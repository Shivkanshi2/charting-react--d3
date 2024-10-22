import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = ({
  data,
  width,
  height,
  xAccessor,
  yAccessors,
  dimensions,
  measures,
  tooltipFormat,
  annotations,
  xAxisLabel,
  yAxisLabels,
  colors,
  onHover,
}) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();
    const margin = { top: 20, right: 100, bottom: 40, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(data.map(xAccessor))
      .range([0, innerWidth])
      .padding(0.2); 

    const groupWidth = xScale.bandwidth() / yAccessors.length;

    const yScales = yAccessors.map((_, i) => 
      d3.scaleLinear()
        .domain([0, d3.max(data, d => d[yAccessors[i]])])
        .nice()
        .range([innerHeight, 0])
    );

    
    yAccessors.forEach((yAccessor, i) => {
      g.selectAll(`.bar-${i}`)
        .data(data)
        .enter().append('rect')
        .attr('class', `bar-${i}`)
        .attr('x', d => xScale(xAccessor(d)) + i * (groupWidth + 10)) 
        .attr('y', d => yScales[i](d[yAccessor]))
        .attr('width', groupWidth - 5) // Width of each bar
        .attr('height', d => innerHeight - yScales[i](d[yAccessor]))
        .attr('fill', colors[i % colors.length])
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
    });

    
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('x', innerWidth)
      .attr('y', 30)
      .attr('fill', 'black') 
      .attr('text-anchor', 'end')
      .text(xAxisLabel);

    
    yScales.forEach((yScale, i) => {
      const yAxisLeft = g.append('g')
        .attr('class', `y-axis-left-${i}`)
        .attr('transform', `translate(${(groupWidth + 10) * i + 5}, 0)`) 
        .call(d3.axisLeft(yScale));

      yAxisLeft.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -10)
        .attr('dy', '0.71em')
        .attr('fill', 'black') 
        .attr('text-anchor', 'end')
        .text(yAxisLabels[i]);
    });

    
    yScales.forEach((yScale, i) => {
      const yAxisRight = g.append('g')
        .attr('class', `y-axis-right-${i}`)
        .attr('transform', `translate(${innerWidth - (groupWidth + 10) * i - 10}, 0)`) 
        .call(d3.axisRight(yScale));

      yAxisRight.append('text')
        .attr('transform', 'rotate(90)')
        .attr('y', 10)
        .attr('dy', '0.71em')
        .attr('fill', 'black') 
        .attr('text-anchor', 'end')
        .text(yAxisLabels[i]);
    });

    
    if (annotations) {
      annotations.forEach(annotation => {
        g.append('text')
          .attr('x', xScale(annotation.x))
          .attr('y', yScales[0](annotation.y)) 
          .attr('dy', '-0.5em')
          .attr('fill', 'red')
          .text(annotation.label);
      });
    }
  }, [data, width, height, xAccessor, yAccessors, xAxisLabel, yAxisLabels, colors, annotations]);

  return (
    <>
      <svg ref={svgRef}></svg>
      <div id="tooltip" style={{ position: 'absolute', visibility: 'hidden', background: 'lightgray', padding: '5px', borderRadius: '5px' }}></div>
    </>
  );
};

export default BarChart;

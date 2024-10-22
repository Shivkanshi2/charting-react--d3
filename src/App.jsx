// src/App.js
import React, { useEffect, useState } from 'react';
import BarChart from './components/BarChart'
import { transformData } from './models/dataTransformer';

const App = () => {
  const [data, setData] = useState([]);
  
  const dimensions = ['category', 'subCategory'];
  const measures = ['value'];
  const colors = ['#1f77b4', '#ff7f0e'];
  

  const staticData = [
    { date: '2023-01-01', category: 'A', value: 100, subCategory: 'X' },
    { date: '2023-01-01', category: 'B', value: 200, subCategory: 'Y' },
    { date: '2023-01-02', category: 'A', value: 150, subCategory: 'X' },
  ];
  
  
  const transformedStaticData = transformData(staticData, dimensions, measures);

  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://api.example.com/data');
      const rawData = await response.json();
      const transformedData = transformData(rawData, dimensions, measures);
      setData(transformedData);
    };

    fetchData();
  }, []);

  
  const handleHover = (d) => {
    console.log('Hovered data:', d);
  };

  return (
    <div>
      <h1>Bar Chart with D3</h1>
      <h2>API Data</h2>
      <BarChart
        data={data.length ? data : transformedStaticData} // Use fetched data if available, otherwise use static
        width={500}
        height={300}
        xAccessor={d => d.category}
        yAccessor={d => d.value}
        dimensions={dimensions}
        measures={measures}
        colors={colors}
        tooltipFormat={d => `${d.category}: ${d.value} (Sub: ${d.subCategory})`}
        annotations={[{ x: 'A', y: 100, label: '' }]}
        xAxisLabel="Category"
        yAxisLabel="Sales"
        onHover={handleHover}
      />
    </div>
  );
};

export default App;

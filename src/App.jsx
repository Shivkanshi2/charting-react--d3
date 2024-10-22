import React, { useEffect, useState } from 'react';
import BarChart from './components/BarChart';
import { transformData } from './models/dataTransformer';

const App = () => {
  const [data, setData] = useState([]);

  const dimensions = ['category', 'subCategory'];
  const measures = ['value', 'anotherValue', 'thirdValue', 'fourthValue', 'fifthValue'];
  const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];

  const staticData = [
    { date: '2023-01-01', category: 'A', value: 100, anotherValue: 150, thirdValue: 120, fourthValue: 130, fifthValue: 110, subCategory: 'X' },
    { date: '2023-01-01', category: 'B', value: 200, anotherValue: 250, thirdValue: 230, fourthValue: 220, fifthValue: 210, subCategory: 'Y' },
    { date: '2023-01-02', category: 'A', value: 150, anotherValue: 180, thirdValue: 170, fourthValue: 160, fifthValue: 150, subCategory: 'X' },
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
        data={data.length ? data : transformedStaticData}
        width={600}
        height={400}
        xAccessor={d => d.category}
        yAccessors={measures}
        dimensions={dimensions}
        measures={measures}
        colors={colors}
        tooltipFormat={d => `${d.category}: Value: ${d.value}, Another Value: ${d.anotherValue}, Third Value: ${d.thirdValue}, Fourth Value: ${d.fourthValue}, Fifth Value: ${d.fifthValue}`}
        annotations={[{ x: 'A', y: 100, label: '' }]}
        xAxisLabel="Category"
        yAxisLabels={['Value', 'Another Value', 'Third Value', 'Fourth Value', 'Fifth Value']}
        onHover={handleHover}
      />
    </div>
  );
};

export default App;

// src/models/dataTransformer.js
export const transformData = (rawData, dimensions, measures) => {
  return rawData.map(item => {
    const transformed = {};
    dimensions.forEach(d => {
      transformed[d] = item[d]; // Map dimensions
    });
    measures.forEach(m => {
      transformed[m] = item[m]; // Map measures
    });
    return transformed;
  });
};

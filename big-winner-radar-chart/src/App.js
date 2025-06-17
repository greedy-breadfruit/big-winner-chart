import React, { useState, useRef, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';
import * as htmlToImage from 'html-to-image';

const initialCategories = ['Growth and Character', 'Relatability', 'Social Game', 'Strength & Resilience', 'Impact'];
const initialData = {
  RaWi: [9, 8, 7, 9, 9],
  CharEs: [8, 10, 10, 7, 8],
  BreKa: [9, 8, 8, 7, 7],
  AzVer: [7, 7, 6, 6, 6],
  DusBi: [6, 6, 5, 8, 7],
};

const colors = {
  RaWi: '#00C49F',
  CharEs: '#FF69B4',
  BreKa: '#8884d8',
  AzVer: '#00BFFF',
  DusBi: '#FFD700',
};

export default function BigWinnerRadarChart() {
  const [categories, setCategories] = useState(initialCategories);
  const [scores, setScores] = useState(initialData);
  const chartRef = useRef(null);
  const imageWrapperRef = useRef(null);

  const handleChange = (duo, index, value) => {
    const newScores = { ...scores };
    newScores[duo][index] = parseFloat(value) || 0;
    setScores(newScores);
  };

  const handleCategoryChange = (index, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = value;
    setCategories(updatedCategories);
  };

  const chartData = categories.map((cat, idx) => {
    const entry = { subject: cat };
    Object.keys(scores).forEach((duo) => {
      entry[duo] = scores[duo][idx];
    });
    return entry;
  });

  const handleDownload = () => {
    if (!imageWrapperRef.current) return;
    htmlToImage.toPng(imageWrapperRef.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'big-winner-chart.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error('Download failed:', err));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">
        <span style={{ color: 'red' }}>BIG WINNER</span>{' '}
        <span style={{ color: '#4169E1' }}>QUALITIES</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {categories.map((cat, idx) => (
          <input
            key={idx}
            type="text"
            value={cat}
            onChange={(e) => handleCategoryChange(idx, e.target.value)}
            className="p-2 border rounded w-full"
            placeholder={`Category ${idx + 1}`}
          />
        ))}
      </div>

      <div ref={imageWrapperRef} className="flex flex-col items-center">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" width={500} height={400} data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} />
          {Object.keys(scores).map((duo) => (
            <Radar key={duo} name={duo} dataKey={duo} stroke={colors[duo]} fill={colors[duo]} fillOpacity={0.3} />
          ))}
          <Legend />
        </RadarChart>
        <p className="text-xs text-gray-500 mt-1">Made by u/Greedy-Breadfruit-57</p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleDownload}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
        >
          Download Chart
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(scores).map((duo) => (
          <div key={duo} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold text-center" style={{ color: colors[duo] }}>{duo}</h2>
            {categories.map((cat, idx) => (
              <div key={cat} className="flex items-center justify-between mt-2">
                <label>{cat}:</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={scores[duo][idx]}
                  onChange={(e) => handleChange(duo, idx, e.target.value)}
                  className="w-20 p-1 border rounded"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <p className="text-sm text-center text-gray-500 mt-6">Made by u/Greedy-Breadfruit-57</p>
    </div>
  );
}
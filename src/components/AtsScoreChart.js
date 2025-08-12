// src/components/AtsScoreChart.js
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
// 1. IMPORT THE REQUIRED COMPONENTS
import { Chart as ChartJS, ArcElement } from 'chart.js';

// 2. REGISTER THEM (we only need ArcElement here)
ChartJS.register(ArcElement);

const AtsScoreChart = ({ score }) => {
    const data = {
        labels: ['Match', 'Remaining'],
        datasets: [
            {
                data: [score, 100 - score],
                backgroundColor: ['#4ade80', '#e5e7eb'], // Green for match, Gray for remaining
                borderColor: ['#ffffff', '#ffffff'],
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%', // Makes it a doughnut chart
        plugins: {
            legend: {
                display: false, // Hide the legend
            },
            tooltip: {
                enabled: false, // Disable tooltips
            },
        },
    };

    return (
        <div className="relative w-24 h-24">
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{score}%</span>
            </div>
        </div>
    );
};

export default AtsScoreChart;
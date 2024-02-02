import React from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';


ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);



export default function App(dataList) {

    const data = {
        datasets: [
            {
                label: 'A dataset',
                data: dataList,
                parsing: {
                    xAxisKey: 'PredictedRuptureStrength',
                    yAxisKey: 'RemainingStrength',
                },
                backgroundColor: 'rgba(255, 99, 132, 1)',
            },
        ],
    }

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    }



    return <Scatter options={options} data={data} />;
}

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



export default function App(LeakRuptureBoundryList, B31GModifiedFailurePressure, metalLoss) {

    let dataList = LeakRuptureBoundryList.map((PredictedRupturePressure, index) => {

        // Combine values as needed
        return {
            leakRuptureValue: PredictedRupturePressure,
            index : index +5
            // Add more properties as needed
        };
    });
    let b31glist = B31GModifiedFailurePressure.map((B31G, index) => {
        let featurelength = "";
        if (metalLoss && typeof metalLoss[index].length !== 'undefined') {
            featurelength = metalLoss[index].length;
        }
        // Combine values as needed
        return {
            B31GValues: B31G,
            featureLength: featurelength,
            // Add more properties as needed
        };
    });

    const data = {
        datasets: [
            {
                label: 'Rupture Pressure Line',
                data: dataList,
                parsing: {
                    xAxisKey: 'index',
                    yAxisKey: 'leakRuptureValue.PredictedRupturePressure',
                },
                backgroundColor: 'rgba(255, 99, 132, 1)',
                pointRadius: '0',
                borderColor: 'red',
                showLine: true,

            },
            {
                label: 'B31G Failure Pressures',
                data: b31glist,
                parsing: {
                    xAxisKey: 'featureLength',
                    yAxisKey: 'B31GValues.FailurePressure',
                },
                backgroundColor: 'rgba(255, 99, 132, 1)',
                borderColor: 'black',
                backgroundColor: 'black'

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

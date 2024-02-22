import React from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';


ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Title);



export default function App(LeakRuptureBoundryList, B31GModifiedFailurePressure, metalLoss, B31GCriticalDepthCalculations) {


    //This is the generic Leak Rupture Boundry List used in the combined chart
    let dataList = LeakRuptureBoundryList.map((PredictedRupturePressure, index) => {

        // Combine values as needed
        return {
            leakRuptureValue: PredictedRupturePressure,
            index : index +5
            // Add more properties as needed
        };
    });

    //This is the B31G failure Pressure List for the combined chart with Leak Rupture Boundry
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


    //This is the B31G Failure pressure VS Odometer list
    let b31GModifiedListWithOdomenter = B31GModifiedFailurePressure.map((B31G, index) => {
        let odometer = "";
        if (metalLoss && typeof metalLoss[index].length !== 'undefined') {
            odometer = metalLoss[index].odometer;
        }
        // Combine values as needed
        return {
            B31GValues: B31G,
            Odometer: odometer,
            // Add more properties as needed
        };
    });


    //This is generating the list for CorrosionDepthListWithOdometer
    let corrosionDepthListWithOdomenter = metalLoss.map((metalloss, index) => {
        let odometer = "";
        if (metalLoss  !== 'undefined') {
            odometer = metalloss.odometer;
        }
        // Combine values as needed
        return {
            CorrosionDepth: metalloss.depth,
            Odometer: odometer,
            // Add more properties as needed
        };
    });


    //This combines the data from the generic Leak Rupture Boudnry List and the B31G Failure Pressure list and combines it. 
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


    //This is generating the list for CorrosionDepthListWithOdometer
    let RemainingLifeCalculationVSOdometerData = metalLoss.map((metalloss, index) => {
        let odometer = "";
        let corrosionDepth = "";
        if (metalLoss !== 'undefined') {
            odometer = metalloss.odometer;
            corrosionDepth = (B31GCriticalDepthCalculations[index].CriticalDepth - metalloss.depth) / 0.15;
        }
        // Combine values as needed
        return {
            RemainingLife: corrosionDepth,
            Odometer: odometer,
            // Add more properties as needed
        };
    });


    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    }



    const OdometerVSB31GFailurePressure = {
        datasets: [
            {
                label: 'B31G Failure Pressure',
                data: b31GModifiedListWithOdomenter,
                parsing: {
                    xAxisKey: 'Odometer',
                    yAxisKey: 'B31GValues.FailurePressure',
                },
                backgroundColor: 'rgba(255, 99, 132, 1)',
                pointRadius: '2',
                borderColor: 'red',
            },
        ],
    }

    const OdometerVSB31GFailurePressureOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Failure Pressure Modified B31G'
            }
        },
    }



    const OdometerVSCorrosionDepth = {
        datasets: [
            {
                label: 'Odometer VS Metal Loss Depth',
                data: corrosionDepthListWithOdomenter,
                parsing: {
                    xAxisKey: 'Odometer',
                    yAxisKey: 'CorrosionDepth',
                },
                backgroundColor: 'rgba(255, 99, 132, 1)',
                pointRadius: '2',
                borderColor: 'red',
            },
        ],
    }

    const OdometerVSCorrosionDepthOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Metal Loss Depth'
            }
        },
    }



    const RemainingLifeCalculationVSOdometer = {
        datasets: [
            {
                label: 'Odometer VS Remaining Life',
                data: RemainingLifeCalculationVSOdometerData,
                parsing: {
                    xAxisKey: 'Odometer',
                    yAxisKey: 'RemainingLife',
                },
                backgroundColor: 'rgba(255, 99, 132, 1)',
                pointRadius: '2',
                borderColor: 'red',
            },
        ],
    }

    const RemainingLifeCalculationVSOdometerOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Remaining Life Modified B31G'
            }
        },
    }

    return <div>
        <Scatter options={options} data={data} />
        <Scatter options={OdometerVSB31GFailurePressureOptions} data={OdometerVSB31GFailurePressure} ></Scatter>
        <Scatter options={OdometerVSCorrosionDepthOptions} data={OdometerVSCorrosionDepth} ></Scatter>
        <Scatter options={RemainingLifeCalculationVSOdometerOptions} data={RemainingLifeCalculationVSOdometer} ></Scatter>
    </div>
   ;
}

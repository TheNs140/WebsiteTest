import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Scatter } from 'react-chartjs-2';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function PreAnalysisGraphGeneration({ metalLoss, GenericB31GCriticalDepth, InputList }) {

    const [viewState, setViewState] = React.useState([]);


    const handleToggleChange = (e, value) => {
        setViewState(value)

    }

    //This is generating the list for CorrosionDepthListWithOdometer
    let MetalLossDepthForHistogram = metalLoss.map((metalloss, index) => {
        return {
            featureRadial: metalloss.featureRadial,
            CorrosionDepth: Math.round(metalloss.depth * metalloss.wallThickness),
            // Add more properties as needed
        };
    });


    let ExternalMetalLossHistogramData = [];
    let InternalMetalLossHistogramData = [];
    let MetalLossDepthHistogram = [' < 1', '1 to 2', '2 to 3', ' > 3'];
    for (let i = 0; i < metalLoss[0].wallThickness; i++) {
        let TempExternalHistogramData = MetalLossDepthForHistogram.filter((metalloss => metalloss.CorrosionDepth == i && metalloss.featureRadial == 'External'));
        let TempInternalHistogramData = MetalLossDepthForHistogram.filter((metalloss => metalloss.CorrosionDepth == i && metalloss.featureRadial == 'Internal'));

        ExternalMetalLossHistogramData.push(TempExternalHistogramData.length);
        InternalMetalLossHistogramData.push(TempInternalHistogramData.length);

    }


    const options = {
        responsive: true,
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Metal Loss Feature Count'
                },
                beginAtZero: true,
            },
            x: {
                title: {
                    display: true,
                    text: 'Metal Loss Depth Range (mm)'
                },
                beginAtZero: true,
            },
        },
        plugins: {

            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'MetalLoss Depth',
            },
        },
    };

    //This combines the data from the generic Leak Rupture Boudnry List and the B31G Failure Pressure list and combines it. 
    const data = {
        labels: MetalLossDepthHistogram,
        datasets: [
            {
                label: 'Internal Features',
                data: InternalMetalLossHistogramData,
                backgroundColor: 'rgba(0, 0, 0, 1)',


            },
            {
                label: 'External Features',
                data: ExternalMetalLossHistogramData,
                backgroundColor: 'rgba(31.4, 78.4, 47.1, 1)',


            },
        ],
    }

    //This is generating the list for CorrosionDepthListWithOdometer
    let corrosionDepthListWithOdomenter = metalLoss.map((metalloss, index) => {
        let odometer = "";
        if (metalLoss !== 'undefined') {
            odometer = metalloss.odometer;
        }
        // Combine values as needed
        return {
            CorrosionDepth: metalloss.depth,
            Odometer: odometer,
            featureRadial: metalloss.featureRadial,
            // Add more properties as needed
        };
    });

    const OdometerVSCorrosionDepth = {
        datasets: [
            {
                label: 'Internal Metal Loss',
                data: corrosionDepthListWithOdomenter.filter((metalloss => metalloss.featureRadial == "Internal")),
                parsing: {
                    xAxisKey: 'Odometer',
                    yAxisKey: 'CorrosionDepth',
                },
                backgroundColor: 'rgba(0, 0, 0, 1)',
                pointRadius: '2',
                borderColor: 'black',
            },
            {
                label: 'External Metal Loss',
                data: corrosionDepthListWithOdomenter.filter((metalloss => metalloss.featureRadial == "External")),
                parsing: {
                    xAxisKey: 'Odometer',
                    yAxisKey: 'CorrosionDepth',
                },
                backgroundColor: 'rgba(31.4, 78.4, 47.1, 1)',
                pointRadius: '2',
                borderColor: 'green',
            },
        ],
    }

    const OdometerVSCorrosionDepthOptions = {
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Metal Loss Depth (%)'
                },
                beginAtZero: true,
            },
            x: {
                title: {
                    display: true,
                    text: 'Odometer (m)'
                },
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

    //This is the generic Leak Rupture Boundry List used in the combined chart
    let dataList = GenericB31GCriticalDepth.map((CriticalDepth, index) => {

        // Combine values as needed
        return {
            CriticalDepth: CriticalDepth,
            index: index * 5
            // Add more properties as needed
        };
    });

    //This is generating the list for CorrosionDepthListWithOdometer
    let corrosionDepthListWithFeatureLength = metalLoss.map((metalloss, index) => {
        let odometer = "";
        if (metalLoss !== 'undefined') {
            odometer = metalloss.odometer;
        }
        // Combine values as needed
        return {
            CorrosionDepth: metalloss.depth * metalloss.wallThickness,
            featureLength: metalloss.length,
            featureRadial: metalloss.featureRadial,
            // Add more properties as needed
        };
    });

    const CorrosionDepthVSFeatureLength = {
        datasets: [
            {
                label: 'Critical Depth Line',
                data: dataList,
                parsing: {
                    xAxisKey: 'index',
                    yAxisKey: 'CriticalDepth.CriticalDepth',
                },
                backgroundColor: 'rgba(255, 99, 132, 1)',
                pointRadius: '0',
                borderColor: 'red',
                showLine: true,

            },
            {
                label: 'Internal Metal Loss',
                data: corrosionDepthListWithFeatureLength.filter((metalloss => metalloss.featureRadial == "Internal")),
                parsing: {
                    xAxisKey: 'featureLength',
                    yAxisKey: 'CorrosionDepth',
                },
                backgroundColor: 'rgba(0, 0, 0, 1)',
                pointRadius: '2',
                borderColor: 'black',
            },
            {
                label: 'External Metal Loss',
                data: corrosionDepthListWithFeatureLength.filter((metalloss => metalloss.featureRadial == "External")),
                parsing: {
                    xAxisKey: 'featureLength',
                    yAxisKey: 'CorrosionDepth',
                },
                backgroundColor: 'rgba(31.4, 78.4, 47.1, 1)',
                pointRadius: '2',
                borderColor: 'green',
            },
        ],
    }

    const CorrosionDepthVSFeatureLengthOptions = {
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Metal Loss Depth (mm)'
                },
                beginAtZero: true,
            },
            x: {
                title: {
                    display: true,
                    text: 'Metal Loss Length (mm)'
                },
                max: 100,
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


    return(
        <div>
            <ToggleButtonGroup value={viewState} onChange={handleToggleChange}>
                <ToggleButton value="ViewOdometerVSCorrosionDepth">
                    Odometer VS Corrosion Depth
                </ToggleButton>
                <ToggleButton value="MetalLossHistogram">
                    Metal Loss Histogram
                </ToggleButton>
                <ToggleButton value="ViewGenericB31GCriticalDepth">
                    Critical Depth VS Feature Length
                </ToggleButton>
            </ToggleButtonGroup>

            <div className={"chart-container"} style={{ display: "inline-flex", flexDirection: "column", gap: '12vh', width: "80%" }}>
                {viewState.includes('MetalLossHistogram') && (
                    <Bar options={options} data={data} />)}
                {viewState.includes('ViewOdometerVSCorrosionDepth') && (
                    <Scatter options={OdometerVSCorrosionDepthOptions} data={OdometerVSCorrosionDepth} />)}
                {viewState.includes('ViewGenericB31GCriticalDepth') && (
                    <Scatter options={CorrosionDepthVSFeatureLengthOptions} data={CorrosionDepthVSFeatureLength} />)}

            </div>
        </div>
    );
}

export default PreAnalysisGraphGeneration;
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
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import { saveAs } from 'file-saver'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import './Styling/PreAnalysisStyling.css';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


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
    const [CheckBoxState, setCheckBoxState] = React.useState([]);




    const handleToggleChange = (e, value) => {
        setViewState(value)

    }

    const saveCanvas = () => {
        //save to png

        if (CheckBoxState.includes('MetalLossHistogram')) {
            const canvasSave = document.getElementById('MetalLossHistogram');
            canvasSave.toBlob(function (blob) {
                saveAs(blob, "MetalLossHistogram.png")
            })
        }

        if (CheckBoxState.includes('ViewOdometerVSCorrosionDepth')) {
            const canvasSave = document.getElementById('ViewOdometerVSCorrosionDepth');
            canvasSave.toBlob(function (blob) {
                saveAs(blob, "ViewOdometerVSCorrosionDepth.png")
            })
        }

        if (CheckBoxState.includes('ViewGenericB31GCriticalDepth')) {
            const canvasSave = document.getElementById('ViewGenericB31GCriticalDepth');
            canvasSave.toBlob(function (blob) {
                saveAs(blob, "ViewGenericB31GCriticalDepth.png")
            })
        }
    }

    const handlecheckboxchange = (event) => {
        // Update the CheckBoxState in state directly
        const {
            target: { value },
        } = event;
        setCheckBoxState(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
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

            <div className={"chart-and-selector-container"}>
                <div className="selector-container">
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="demo-multiple-checkbox-label">Select Charts to Download</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={CheckBoxState}
                            onChange={handlecheckboxchange}
                            input={<OutlinedInput label="Select Charts to Download" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {viewState.map((name) => (
                                <MenuItem key={name} value={name}>
                                    <Checkbox checked={CheckBoxState.indexOf(name) > -1} />
                                    <ListItemText primary={name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button variant="outlined" onClick={saveCanvas}>Download</Button>
                </div>

            <div className={"chart-container"} style={{ display: "inline-flex", flexDirection: "column", gap: '12vh', width: "80%" }}>
                {viewState.includes('MetalLossHistogram') && (
                    <Bar id='MetalLossHistogram' options={options} data={data} />)}
                {viewState.includes('ViewOdometerVSCorrosionDepth') && (
                    <Scatter id='ViewOdometerVSCorrosionDepth' options={OdometerVSCorrosionDepthOptions} data={OdometerVSCorrosionDepth} />)}
                {viewState.includes('ViewGenericB31GCriticalDepth') && (
                    <Scatter id='ViewGenericB31GCriticalDepth' options={CorrosionDepthVSFeatureLengthOptions} data={CorrosionDepthVSFeatureLength} />)}

                </div>
            </div>
        </div>
    );
}

export default PreAnalysisGraphGeneration;
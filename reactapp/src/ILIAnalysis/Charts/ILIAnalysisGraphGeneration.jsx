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
import '../Styling/ILIAnalysisStyling.css';

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

const DownloadSelection = [
    'LRB and Pf B31G',
    'Pf B31G',
    'Remaining Life',
    'Sf Histogram',
    'Remaining Life Histogram'

]


ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

function ILIAnalysisGraphGeneration({ LeakRuptureBoundryList, B31GModifiedFailurePressure, metalLoss, B31GCriticalDepthCalculations, InputList }) {

    const [viewState, setViewState] = React.useState([]);
    const [CheckBoxState, setCheckBoxState] = React.useState([]);



    const handleToggleChange = (e, value) => {
        setViewState(value)

    }
    const saveCanvas = () => {
        //save to png

        if (CheckBoxState.includes('LRB and Pf B31G')) {
            const canvasSave = document.getElementById('LRB and Pf B31G');
            canvasSave.toBlob(function (blob) {
                saveAs(blob, "LRB and Pf B31G.png")
            })
        }

        if (CheckBoxState.includes('Pf B31G')) {
            const canvasSave = document.getElementById('Pf B31G');
            canvasSave.toBlob(function (blob) {
                saveAs(blob, "PfB31G.png")
            })
        }

        if (CheckBoxState.includes('Remaining Life')) {
            const canvasSave = document.getElementById('Remaining Life');
            canvasSave.toBlob(function (blob) {
                saveAs(blob, "RemainingLife.png")
            })
        }

        if (CheckBoxState.includes('Sf Histogram')) {
            const canvasSave = document.getElementById('Sf Histogram');
            canvasSave.toBlob(function (blob) {
                saveAs(blob, "SfHistogram.png")
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

    const plugin = {
        id: 'customCanvasBackgroundColor',
        beforeDraw: (chart, args, options) => {
            const { ctx } = chart;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = '#99ffff';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };


    //This is the generic Leak Rupture Boundry List used in the combined chart
    let dataList = LeakRuptureBoundryList.map((PredictedRupturePressure, index) => {

        // Combine values as needed
        return {
            leakRuptureValue: PredictedRupturePressure,
            index: index * 5
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
            featureRadial: metalLoss[index].featureRadial,
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
            featureRadial: metalLoss[index].featureRadial,
            // Add more properties as needed
        };
    });

    //This combines the data from the generic Leak Rupture Boudnry List and the B31G Failure Pressure list and combines it. 
    const LeakRuptureBoundaryListWithB31GFailurePressuresData = {
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
                label: 'Internal B31G Failure Pressures',
                data: b31glist.filter((element => element.featureRadial == "Internal")),
                parsing: {
                    xAxisKey: 'featureLength',
                    yAxisKey: 'B31GValues.FailurePressure',
                },
                backgroundColor: 'rgba(0, 0, 0, 1)',
                borderColor: 'black',
                backgroundColor: 'black'

            },
            {
                label: 'External B31G Failure Pressures',
                data: b31glist.filter((element => element.featureRadial == "External")),
                parsing: {
                    xAxisKey: 'featureLength',
                    yAxisKey: 'B31GValues.FailurePressure',
                },
                backgroundColor: 'rgba(31.4, 78.4, 47.1, 1)',
                borderColor: 'green',

            },
        ],
    }

    //This is the options for the Leak Rupture Boundary List Combined with B31G Failure Pressures
    const LeakRuptureBoundaryListWithB31GFailurePressuresOptions = {
        scales: {

            y: {
                title: {
                    display: true,
                    text: 'Failure Pressure (kPA)'
                },
                beginAtZero: true,
            },
            x: {
                title: {
                    display: true,
                    text: 'Feature Length (mm)'
                },
                beginAtZero: true,
            },
        },
        plugins: {
            plugin
        },
    }


    const OdometerVSB31GFailurePressure = {
        datasets: [
            {
                label: 'Internal B31G Failure Pressure',
                data: b31GModifiedListWithOdomenter.filter((element => element.featureRadial == "Internal")),
                parsing: {
                    xAxisKey: 'Odometer',
                    yAxisKey: 'B31GValues.FailurePressure',
                },
                backgroundColor: 'rgba(0, 0, 0, 1)',
                pointRadius: '2',
                borderColor: 'black',
            },
            {
                label: 'External B31G Failure Pressure',
                data: b31GModifiedListWithOdomenter.filter((element => element.featureRadial == "External")),
                parsing: {
                    xAxisKey: 'Odometer',
                    yAxisKey: 'B31GValues.FailurePressure',
                },
                backgroundColor: 'rgba(31.4, 78.4, 47.1, 1)',
                pointRadius: '2',
                borderColor: 'green',
            },
        ],
    }

    const OdometerVSB31GFailurePressureOptions = {
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Failure Pressure (kPA)'
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
                text: 'Failure Pressure Modified B31G'
            }
        },
    }



    //This is generating the list for CorrosionDepthListWithOdometer
    let RemainingLifeCalculationVSOdometerData = metalLoss.map((metalloss, index) => {
        let odometer = "";
        let corrosionDepth = "";
        if (metalLoss !== 'undefined') {
            odometer = metalloss.odometer;
            corrosionDepth = (B31GCriticalDepthCalculations[index].CriticalDepth - (metalloss.depth * metalloss.wallThickness)) / 0.15;
        }
        // Combine values as needed
        return {
            RemainingLife: corrosionDepth,
            Odometer: odometer,
            featureRadial: metalloss.featureRadial,
            // Add more properties as needed
        };
    });

    //This is the labels for the Remaining Life Histogram
    let remainingLifeHistogramLabel = ['<2', '2 to 4', '4 to 6', '6 to 8', '8 to 10', '10 to 15', '15 to 20', '>20']


    //This actually segregates the data into internal and external features
    const RemainingLifeCalculationVSOdometer = {
        datasets: [
            {
                label: 'Internal Remaining Life',
                data: RemainingLifeCalculationVSOdometerData.filter((element => element.featureRadial == "Internal")),
                parsing: {
                    xAxisKey: 'Odometer',
                    yAxisKey: 'RemainingLife',
                },
                backgroundColor: 'rgba(0, 0, 0, 1)',
                pointRadius: '2',
                borderColor: 'back',
            },
            {
                label: 'External Remaining Life',
                data: RemainingLifeCalculationVSOdometerData.filter((element => element.featureRadial == "External")),
                parsing: {
                    xAxisKey: 'Odometer',
                    yAxisKey: 'RemainingLife',
                },
                backgroundColor: 'rgba(31.4, 78.4, 47.1, 1)',
                pointRadius: '2',
                borderColor: 'green',
            },
        ],
    }

    //This is the options for the Remaining Life Calculation VS Odometer
    const RemainingLifeCalculationVSOdometerOptions = {
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Remaining Life (Year)'
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
                text: 'Remaining Life Modified B31G'
            }
        },
    }




    let RemainingLifeHistogramData = metalLoss.map((metalloss, index) => {
        return {
            featureRadial: metalloss.featureRadial,
            remainingLife: (B31GCriticalDepthCalculations[index].CriticalDepth - (metalloss.depth * metalloss.wallThickness)) / 0.15,
        }
    });

    let InternalRemainingLifeData = RemainingLifeHistogramData.filter((element => element.featureRadial == 'Internal'))
    let ExternalRemainingLifeData = RemainingLifeHistogramData.filter((element => element.featureRadial == 'External'))

    //This Variable Categorizes the Internal Remaining Life Data into 8 categories
    let InternalRemainingLifeDataCount = [0, 0, 0, 0, 0, 0, 0, 0]
    for (let i = 0; i < InternalRemainingLifeData.length; i++) {
        if (InternalRemainingLifeData[i].remainingLife < 2) {
            InternalRemainingLifeDataCount[0] += 1
        }
        if (2 < InternalRemainingLifeData[i].remainingLife && InternalRemainingLifeData[i].remainingLife < 4) {
            InternalRemainingLifeDataCount[1] += 1
        }
        if (4 < InternalRemainingLifeData[i].remainingLife && InternalRemainingLifeData[i].remainingLife < 6) {
            InternalRemainingLifeDataCount[2] += 1
        }
        if (6 < InternalRemainingLifeData[i].remainingLife && InternalRemainingLifeData[i].remainingLife < 8) {
            InternalRemainingLifeDataCount[3] += 1
        }
        if (8 < InternalRemainingLifeData[i].remainingLife < 10) {
            InternalRemainingLifeDataCount[4] += 1
        }
        if (10 < InternalRemainingLifeData[i].remainingLife && InternalRemainingLifeData[i].remainingLife < 15) {
            InternalRemainingLifeDataCount[2] += 1
        }
        if (15 < InternalRemainingLifeData[i].remainingLife && InternalRemainingLifeData[i].remainingLife < 20) {
            InternalRemainingLifeDataCount[3] += 1
        }
        if (20 < InternalRemainingLifeData[i].remainingLife) {
            InternalRemainingLifeDataCount[4] += 1
        }

    }


    //This Variable Categorizes the External Remaining Life Data into 8 categories
    let ExternalRemainingLifeDataCount = [0, 0, 0, 0, 0]
    for (let i = 0; i < ExternalRemainingLifeData.length; i++) {
        if (ExternalRemainingLifeData[i].remainingLife < 2) {
            ExternalRemainingLifeDataCount[0] += 1
        }
        if (2 < ExternalRemainingLifeData[i].remainingLife && ExternalRemainingLifeData[i].remainingLife < 4) {
            ExternalRemainingLifeDataCount[1] += 1
        }
        if (4 < ExternalRemainingLifeData[i].remainingLife && ExternalRemainingLifeData[i].remainingLife < 6) {
            ExternalRemainingLifeDataCount[2] += 1
        }
        if (6 < ExternalRemainingLifeData[i].remainingLife && ExternalRemainingLifeData[i].remainingLife < 8) {
            ExternalRemainingLifeDataCount[3] += 1
        }
        if (8 < ExternalRemainingLifeData[i].remainingLife < 10) {
            ExternalRemainingLifeDataCount[4] += 1
        }
        if (10 < ExternalRemainingLifeData[i].remainingLife && ExternalRemainingLifeData[i].remainingLife < 15) {
            ExternalRemainingLifeDataCount[2] += 1
        }
        if (15 < ExternalRemainingLifeData[i].remainingLife && ExternalRemainingLifeData[i].remainingLife < 20) {
            ExternalRemainingLifeDataCount[3] += 1
        }
        if (20 < ExternalRemainingLifeData[i].remainingLife) {
            ExternalRemainingLifeDataCount[4] += 1
        }

    }


    //This combines the internal and external remaining life data into a histogram
    const RemainingLifeHistogram = {
        labels: remainingLifeHistogramLabel,
        datasets: [
            {
                label: 'Internal Features',
                data: InternalRemainingLifeDataCount,
                backgroundColor: 'rgba(0, 0, 0, 1)',


            },
            {
                label: 'External Features',
                data: ExternalRemainingLifeDataCount,
                backgroundColor: 'rgba(31.4, 78.4, 47.1, 1)',


            },
        ],
    }

    //This is the options for the Remaining Life Histogram
    const RemainingLifeHistogramOptions = {
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Remaining Life Feature Count'
                },
                beginAtZero: true,
            },
            x: {
                title: {
                    display: true,
                    text: 'Remaining Life Range (Years)'
                },
                beginAtZero: true,
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Remaining Life Histogram'
            }
        },
    }



    //This is the labels for the Safety Factor Histogram
    let SafetyFactorHistogramLabel = ['<1', '1 to 1.1', '1.1 to 1.25', '1.25 to 1.39', '>1.39']

    //This is the data for the Safety Factor Histogram
    let SafetyFactorHistogramData = metalLoss.map((metalloss, index) => {
        return {
            featureRadial: metalloss.featureRadial,
            safetyfactor: B31GModifiedFailurePressure[index].FailurePressure /InputList.PressureOfInterest,
        }
    });

    //This segregates the data into internal and external features
    let InternalSafetyFactorHistogramData = SafetyFactorHistogramData.filter((element => element.featureRadial == 'Internal'))
    let ExternalSafetyFactorHistogramData = SafetyFactorHistogramData.filter((element => element.featureRadial == 'External'))

    //This categorizes the internal safety factor data into 5 categories
    let internalSafetyFactorHistogramDataCount = [0, 0, 0, 0, 0]
    for (let i = 0; i < InternalSafetyFactorHistogramData.length; i++) {
        if (InternalSafetyFactorHistogramData[i].safetyfactor < 1) {
            internalSafetyFactorHistogramDataCount[0] += 1
        }
        if (1 < InternalSafetyFactorHistogramData[i].safetyfactor && InternalSafetyFactorHistogramData[i].safetyfactor < 1.1) {
            internalSafetyFactorHistogramDataCount[1] += 1
        }
        if (1.1 < InternalSafetyFactorHistogramData[i].safetyfactor && InternalSafetyFactorHistogramData[i].safetyfactor < 1.25) {
            internalSafetyFactorHistogramDataCount[2] += 1
        }
        if (1.25 < InternalSafetyFactorHistogramData[i].safetyfactor && InternalSafetyFactorHistogramData[i].safetyfactor < 1.39) {
            internalSafetyFactorHistogramDataCount[3] += 1
        }
        if (1.39 < InternalSafetyFactorHistogramData[i].safetyfactor) {
            internalSafetyFactorHistogramDataCount[4] += 1
        }

    }

    //This categorizes the external safety factor data into 5 categories
    let externalSafetyFactorHistogramDataCount = [0, 0, 0, 0, 0]
    for (let i = 0; i < ExternalSafetyFactorHistogramData.length; i++) {
        if (ExternalSafetyFactorHistogramData[i].safetyfactor < 1) {
            externalSafetyFactorHistogramDataCount[0] += 1
        }
        if (1 < ExternalSafetyFactorHistogramData[i].safetyfactor && ExternalSafetyFactorHistogramData[i].safetyfactor < 1.1) {
            externalSafetyFactorHistogramDataCount[1] += 1
        }
        if (1.1 < ExternalSafetyFactorHistogramData[i].safetyfactor && ExternalSafetyFactorHistogramData[i].safetyfactor < 1.25) {
            externalSafetyFactorHistogramDataCount[2] += 1
        }
        if (1.25 < ExternalSafetyFactorHistogramData[i].safetyfactor && ExternalSafetyFactorHistogramData[i].safetyfactor < 1.39) {
            externalSafetyFactorHistogramDataCount[3] += 1
        }
        if (1.39 < ExternalSafetyFactorHistogramData[i].safetyfactor) {
            externalSafetyFactorHistogramDataCount[4] += 1
        }

    }

    //This combines the internal and external safety factor data into a histogram
    const safetyFactorHistogram = {
        labels: SafetyFactorHistogramLabel,
        datasets: [
            {
                label: 'Internal Features',
                data: internalSafetyFactorHistogramDataCount,
                backgroundColor: 'rgba(0, 0, 0, 1)',


            },
            {
                label: 'External Features',
                data: externalSafetyFactorHistogramDataCount,
                backgroundColor: 'rgba(31.4, 78.4, 47.1, 1)',


            },
        ],
    }

    //This is the options for the Safety Factor Histogram
    const safetyFactorHistogramOptions = {
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Safety Factor Feature Count'
                },
                beginAtZero: true,
            },
            x: {
                title: {
                    display: true,
                    text: 'Safety Factor Range'
                },
                beginAtZero: true,
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Safety Factor Histogram'
            }
        },
    }


    return(
        <div>
        <div className={"ButtonandSelect"}>
            <ToggleButtonGroup value={viewState} onChange={handleToggleChange}>
                    <ToggleButton value="LRB and Pf B31G">
                    <Typography variant="subtitle1">LRB and Pf B31G</Typography>
                </ToggleButton>

                    <ToggleButton value="Pf B31G">
                    <Typography variant="subtitle1">Pf B31G</Typography>
                </ToggleButton>

                    <ToggleButton value="Remaining Life">
                    <Typography variant="subtitle1">Remaining Life</Typography>
                </ToggleButton>

                    <ToggleButton value="Sf Histogram">
                    <Typography variant="subtitle1">Sf Histogram</Typography>
                </ToggleButton>

                <ToggleButton value="ViewRemainingLifeHistogram">
                    <Typography variant="subtitle1">Remaining Life Histogram</Typography>
                </ToggleButton>

            </ToggleButtonGroup>

        </div>
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

                    {viewState.includes('LRB and Pf B31G') && (
                <Scatter id="LRB and Pf B31G" options={LeakRuptureBoundaryListWithB31GFailurePressuresOptions} data={LeakRuptureBoundaryListWithB31GFailurePressuresData} />
                )}
                    {viewState.includes('Pf B31G') && (
                <Scatter id= 'Pf B31G' options={OdometerVSB31GFailurePressureOptions} data={OdometerVSB31GFailurePressure} />
                )}
                {viewState.includes('Remaining Life') && (
                <Scatter id= 'Remaining Life' options={RemainingLifeCalculationVSOdometerOptions} data={RemainingLifeCalculationVSOdometer} />
                )}
                {viewState.includes('Sf Histogram') && (
                        <Bar id= 'Sf Histogram' options={safetyFactorHistogramOptions} data={safetyFactorHistogram} />)}
                {viewState.includes('ViewRemainingLifeHistogram') && (
                <Bar id= 'ViewRemainingLifeHistogram' options={RemainingLifeHistogramOptions} data={RemainingLifeHistogram} />)}
            </div>
        </div>

    </div>
    );
}


export default ILIAnalysisGraphGeneration;
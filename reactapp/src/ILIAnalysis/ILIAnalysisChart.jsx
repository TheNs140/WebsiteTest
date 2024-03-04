import * as React from 'react';
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
import { extend, map } from 'jquery';
import { DatabaseContext } from '../App';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Title);


class MainChartApplication extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            viewState: [],
            ViewRupturePressureLineWithB31GFailurePressure: false,
            OuterDiameter: '',
            YieldStrength: '',
            FullSizedCVN: '',
            PressureOfInterest: '',
            WallThickness: '',
            SafetyFactor: '',
            LeakRuptureBoundryList: [],
            B31GModifiedFailurePressure: [],
            GenericLeakRuptureBoundaryCalculation: [],
            MetalLoss: JSON.parse(sessionStorage.metalLoss),
            PressureOfInterest: [],
            B31GCriticalDepth: [],
            FullyMappedVariables: []
        };
    }


    async componentDidMount() {
        await this.calculateFromMetalLossList();


    }

    handleToggleChange = (e, value) => {
        this.setState({
            viewState: value
        })

        this.state.viewState.map((totogglechange) => {
            this.setState({ [totogglechange]: !totogglechange })
        }
        )

    }

    async calculateFromMetalLossList() {
        let b31GInputs = {
            OuterDiameter: this.state.OuterDiameter,
            YieldStrength: this.state.YieldStrength,
            PressureOfInterest: this.state.PressureOfInterest,
            SafetyFactor: this.state.SafetyFactor
        };

        let requestOptionsB31GFailurePressure = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: this.state.MetalLoss,
                inputs: b31GInputs
            })
        };



        let leakRuptureBoundaryInputs = {
            OuterDiameter: this.state.OuterDiameter,
            FullSizedCVN: this.state.FullSizedCVN,
            PressureOfInterest: this.state.PressureOfInterest,
            YieldStrength: this.state.YieldStrength

        };

        let requestOptionsLeakRupture = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: this.state.MetalLoss,
                inputs: leakRuptureBoundaryInputs
            })
        };



        let genericleakRuptureBoundaryInputs = {
            OuterDiameter: this.state.OuterDiameter,
            FullSizedCVN: this.state.FullSizedCVN,
            PressureOfInterest: this.state.PressureOfInterest,
            YieldStrength: this.state.YieldStrength,
            WallThickness: this.state.WallThickness

        };

        let requestOptionsGenericLeakRupture = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(genericleakRuptureBoundaryInputs)
        };


        let B31GCriticalDepthInputs = {
            OuterDiameter: this.state.OuterDiameter,
            FullSizedCVN: this.state.FullSizedCVN,
            PressureOfInterest: this.state.PressureOfInterest,
            YieldStrength: this.state.YieldStrength,
            WallThickness: this.state.WallThickness

        };

        let requestOptionsB31GCriticalDepth = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: this.state.MetalLoss,
                inputs: B31GCriticalDepthInputs
            })
        };



        const [response1, response2, response3, response4] = await Promise.all([
            fetch('/ilib31gmodifiedcalculation', requestOptionsB31GFailurePressure),
            fetch('/ilifullleakrupturecalculation', requestOptionsLeakRupture),
            fetch('/leakruptureboundrycalculation', requestOptionsGenericLeakRupture),
            fetch('/ilib31gmodifiedcriticaldepth', requestOptionsB31GCriticalDepth)
        ]);

        const [responseList, responseList2, responseList3, responseList4] = await Promise.all([
            response1.json(),
            response2.json(),
            response3.json(),
            response4.json()
        ]);


        this.setState({
            B31GCriticalDepth: responseList4,
            LeakRuptureBoundryList: responseList2,
            B31GModifiedFailurePressure: responseList,
            GenericLeakRuptureBoundaryCalculation: responseList3
        })
    }

    App(LeakRuptureBoundryList, B31GModifiedFailurePressure, metalLoss, B31GCriticalDepthCalculations) {



        //This is the generic Leak Rupture Boundry List used in the combined chart
        let dataList = LeakRuptureBoundryList.map((PredictedRupturePressure, index) => {

            // Combine values as needed
            return {
                leakRuptureValue: PredictedRupturePressure,
                index: index + 5
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
                featureRadial: metalloss.featureRadial,
                // Add more properties as needed
            };
        });


        const options = {
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


        return <div>
            <ToggleButtonGroup value={this.state.viewState} onChange={this.handleToggleChange}>
                <ToggleButton value="ViewRupturePressureLineWithB31GFailurePressure">
                    Rupture Pressure Line with B31G Failure Pressure
                </ToggleButton>
                <ToggleButton value="ViewB31GFailurePressure">
                    B31G Failure Pressure
                </ToggleButton>
                <ToggleButton value="ViewRemainingLife">
                    Remaining Life
                </ToggleButton>
            </ToggleButtonGroup>
            <div className={"chart-container"} style={{ display: "inline-flex", flexDirection: "column", gap: '12vh', width: "80%" }}>
                {this.state.viewState.includes('ViewRupturePressureLineWithB31GFailurePressure') && (
                    <Scatter options={options} data={data} />
                )}
                {this.state.viewState.includes('ViewB31GFailurePressure') && (
                    <Scatter options={OdometerVSB31GFailurePressureOptions} data={OdometerVSB31GFailurePressure} />
                )}
                {this.state.viewState.includes('ViewRemainingLife') && (
                    <Scatter options={RemainingLifeCalculationVSOdometerOptions} data={RemainingLifeCalculationVSOdometer} />
                )}
            </div>
        </div>
    }


    render() {
        return (

            <div>
                <DatabaseContext.Consumer>
                    {({ inputList, isCalculated }) => {
                        this.state.OuterDiameter = inputList.OuterDiameter,
                            this.state.YieldStrength = inputList.YieldStrength,
                            this.state.FullSizedCVN = inputList.FullSizedCVN,
                            this.state.PressureOfInterest = inputList.PressureOfInterest,
                            this.state.WallThickness = inputList.WallThickness,
                            this.state.SafetyFactor = inputList.SafetyFactor,
                            this.state.isCalculated = isCalculated

                    }}
                </DatabaseContext.Consumer>
                {this.state.isCalculated ? this.App(this.state.GenericLeakRuptureBoundaryCalculation, this.state.B31GModifiedFailurePressure, this.state.MetalLoss, this.state.B31GCriticalDepth) : ''}
            </div>
        )
    }
}
export default MainChartApplication

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
import { Bar, Scatter } from 'react-chartjs-2';
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


        let remainingLifeHistogramLabel = ['<2', '2 to 4', '4 to 6', '6 to 8', '8 to 10', '10 to 15', '15 to 20', '>20']


        let remainingLifeData = metalLoss.map((metalloss, index) => {
            return {
                featureRadial: metalloss.featureRadial,
                remainingLife: (B31GCriticalDepthCalculations[index].CriticalDepth - (metalloss.depth * metalloss.wallThickness)) / 0.15,
            }
        });

        let internalRemainingLifeData = remainingLifeData.filter((element => element.featureRadial == 'Internal'))
        let externalRemainingLifeData = remainingLifeData.filter((element => element.featureRadial == 'External'))


        let internalRemainingLifeDataCount = [0, 0, 0, 0, 0, 0, 0, 0]
        for (let i = 0; i < internalRemainingLifeData.length; i++) {
            if (internalRemainingLifeData[i].remainingLife < 2) {
                internalRemainingLifeDataCount[0] += 1
            }
            if (2 < internalRemainingLifeData[i].remainingLife && internalRemainingLifeData[i].remainingLife < 4){
                internalRemainingLifeDataCount[1] += 1
            }
            if (4 < internalRemainingLifeData[i].remainingLife && internalRemainingLifeData[i].remainingLife < 6){
                internalRemainingLifeDataCount[2] += 1
            }
            if (6 < internalRemainingLifeData[i].remainingLife && internalRemainingLifeData[i].remainingLife < 8){
                internalRemainingLifeDataCount[3] += 1
            }
            if (8 < internalRemainingLifeData[i].remainingLife < 10){
                internalRemainingLifeDataCount[4] += 1
            }
            if (10 < internalRemainingLifeData[i].remainingLife && internalRemainingLifeData[i].remainingLife < 15) {
                internalRemainingLifeDataCount[2] += 1
            }
            if (15 < internalRemainingLifeData[i].remainingLife && internalRemainingLifeData[i].remainingLife < 20) {
                internalRemainingLifeDataCount[3] += 1
            }
            if (20 < internalRemainingLifeData[i].remainingLife) {
                internalRemainingLifeDataCount[4] += 1
            }
            
        }

        let externalRemainingLifeDataCount = [0, 0, 0, 0, 0]
        for (let i = 0; i < externalRemainingLifeData.length; i++) {
            if (externalRemainingLifeData[i].remainingLife < 2) {
                externalRemainingLifeDataCount[0] += 1
            }
            if (2 < externalRemainingLifeData[i].remainingLife && externalRemainingLifeData[i].remainingLife < 4) {
                externalRemainingLifeDataCount[1] += 1
            }
            if (4 < externalRemainingLifeData[i].remainingLife && externalRemainingLifeData[i].remainingLife < 6) {
                externalRemainingLifeDataCount[2] += 1
            }
            if (6 < externalRemainingLifeData[i].remainingLife && externalRemainingLifeData[i].remainingLife < 8) {
                externalRemainingLifeDataCount[3] += 1
            }
            if (8 < externalRemainingLifeData[i].remainingLife < 10) {
                externalRemainingLifeDataCount[4] += 1
            }
            if (10 < externalRemainingLifeData[i].remainingLife && externalRemainingLifeData[i].remainingLife < 15) {
                externalRemainingLifeDataCount[2] += 1
            }
            if (15 < externalRemainingLifeData[i].remainingLife && externalRemainingLifeData[i].remainingLife < 20) {
                externalRemainingLifeDataCount[3] += 1
            }
            if (20 < externalRemainingLifeData[i].remainingLife) {
                externalRemainingLifeDataCount[4] += 1
            }

        }



        const remainingLifeHistogram = {
            labels: remainingLifeHistogramLabel,
            datasets: [
                {
                    label: 'Internal Features',
                    data: internalRemainingLifeDataCount,
                    backgroundColor: 'rgba(0, 0, 0, 1)',


                },
                {
                    label: 'External Features',
                    data: externalRemainingLifeDataCount,
                    backgroundColor: 'rgba(31.4, 78.4, 47.1, 1)',


                },
            ],
        }
        const remainingLifeHistogramOptions = {
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


        let safetyFactorHistogramLabel = ['<1', '1 to 1.1', '1.1 to 1.25', '1.25 to 1.39', '>1.39']


        let safetyFactorHistogramData = metalLoss.map((metalloss, index) => {
            return {
                featureRadial: metalloss.featureRadial,
                safetyfactor: this.state.B31GModifiedFailurePressure[index].FailurePressure / this.state.PressureOfInterest,
            }
        });

        let internalSafetyFactorHistogramData = safetyFactorHistogramData.filter((element => element.featureRadial == 'Internal'))
        let externalSafetyFactorHistogramData = safetyFactorHistogramData.filter((element => element.featureRadial == 'External'))


        let internalSafetyFactorHistogramDataCount = [0, 0, 0, 0, 0]
        for (let i = 0; i < internalSafetyFactorHistogramData.length; i++) {
            if (internalSafetyFactorHistogramData[i].safetyfactor < 1) {
                internalSafetyFactorHistogramDataCount[0] += 1
            }
            if (1 < internalSafetyFactorHistogramData[i].safetyfactor && internalSafetyFactorHistogramData[i].safetyfactor < 1.1) {
                internalSafetyFactorHistogramDataCount[1] += 1
            }
            if (1.1 < internalSafetyFactorHistogramData[i].safetyfactor && internalSafetyFactorHistogramData[i].safetyfactor < 1.25) {
                internalSafetyFactorHistogramDataCount[2] += 1
            }
            if (1.25 < internalSafetyFactorHistogramData[i].safetyfactor && internalSafetyFactorHistogramData[i].safetyfactor < 1.39) {
                internalSafetyFactorHistogramDataCount[3] += 1
            }
            if (1.39 < internalSafetyFactorHistogramData[i].safetyfactor) {
                internalSafetyFactorHistogramDataCount[4] += 1
            }

        }

        let externalSafetyFactorHistogramDataCount = [0, 0, 0, 0, 0]
        for (let i = 0; i < externalSafetyFactorHistogramData.length; i++) {
            if (externalSafetyFactorHistogramData[i].safetyfactor < 1) {
                externalSafetyFactorHistogramDataCount[0] += 1
            }
            if (1 < externalSafetyFactorHistogramData[i].safetyfactor && externalSafetyFactorHistogramData[i].safetyfactor < 1.1) {
                externalSafetyFactorHistogramDataCount[1] += 1
            }
            if (1.1 < externalSafetyFactorHistogramData[i].safetyfactor && externalSafetyFactorHistogramData[i].safetyfactor < 1.25) {
                externalSafetyFactorHistogramDataCount[2] += 1
            }
            if (1.25 < externalSafetyFactorHistogramData[i].safetyfactor && externalSafetyFactorHistogramData[i].safetyfactor < 1.39) {
                externalSafetyFactorHistogramDataCount[3] += 1
            }
            if (1.39 < externalSafetyFactorHistogramData[i].safetyfactor) {
                externalSafetyFactorHistogramDataCount[4] += 1
            }

        }



        const safetyFactorHistogram = {
            labels: safetyFactorHistogramLabel,
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
                <ToggleButton value="ViewSafetyFactorHistogram">
                    Safety Factor Histogram
                </ToggleButton>
                <ToggleButton value="ViewRemainingLifeHistogram">
                    Remaining Life Histogram
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
                {this.state.viewState.includes('ViewSafetyFactorHistogram') && (
                    <Bar options={safetyFactorHistogramOptions} data={safetyFactorHistogram} />)}
                {this.state.viewState.includes('ViewRemainingLifeHistogram') && (
                    <Bar options={remainingLifeHistogramOptions} data={remainingLifeHistogram} />)}
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

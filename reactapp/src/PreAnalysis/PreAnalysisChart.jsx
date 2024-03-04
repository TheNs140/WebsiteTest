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
import { extend, map } from 'jquery';
import { DatabaseContext } from '../App';
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

class PreAnalysisChart extends React.Component {

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
        let MetalLossDepthHistogram = [];
        for (let i = 0; i < metalLoss[0].wallThickness; i++)
        {
            let TempExternalHistogramData = MetalLossDepthForHistogram.filter((metalloss => metalloss.CorrosionDepth == i && metalloss.featureRadial == 'External'));
            let TempInternalHistogramData = MetalLossDepthForHistogram.filter((metalloss => metalloss.CorrosionDepth == i && metalloss.featureRadial == 'Internal'));

            ExternalMetalLossHistogramData.push(TempExternalHistogramData.length);
            InternalMetalLossHistogramData.push(TempInternalHistogramData.length);



            MetalLossDepthHistogram.push(i.toString());
        }


       const options = {
            responsive: true,
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


        return <div>
            <ToggleButtonGroup value={this.state.viewState} onChange={this.handleToggleChange}>
                <ToggleButton value="ViewOdometerVSCorrosionDepth">
                    Odometer VS Corrosion Depth
                </ToggleButton>
                <ToggleButton value="MetalLossHistogram">
                    Metal Loss Histogram
                </ToggleButton>
            </ToggleButtonGroup>

            <div className={"chart-container"} style={{ display: "inline-flex", flexDirection: "column", gap: '12vh', width: "80%" }}>
                {this.state.viewState.includes('MetalLossHistogram') && (
                    <Bar options={options} data={data} />)}
                {this.state.viewState.includes('ViewOdometerVSCorrosionDepth') && (
                    <Scatter options={OdometerVSCorrosionDepthOptions} data={OdometerVSCorrosionDepth} />)}

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
                {this.App(this.state.GenericLeakRuptureBoundaryCalculation, this.state.B31GModifiedFailurePressure, this.state.MetalLoss, this.state.B31GCriticalDepth)}
            </div>
        )
    }
}
export default PreAnalysisChart

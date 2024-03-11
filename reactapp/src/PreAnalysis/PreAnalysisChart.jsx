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
            GenericLeakRuptureBoundaryCalculation: [],
            GenericB31GCriticalDepth: [],
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


        let genericB31GCriticalDepthInputs = {
            OuterDiameter: this.state.OuterDiameter,
            FullSizedCVN: this.state.FullSizedCVN,
            PressureOfInterest: this.state.PressureOfInterest,
            YieldStrength: this.state.YieldStrength,
            WallThickness: this.state.WallThickness

        };

        let requestOptionsGenericB31GCriticalDepth = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(genericB31GCriticalDepthInputs)
        };


        const [response1] = await Promise.all([
            fetch('/b31gcriticaldepthcalculation', requestOptionsGenericB31GCriticalDepth)
        ]);

        const [responseList] = await Promise.all([
            response1.json(),
        ]);


        this.setState({
            GenericB31GCriticalDepth: responseList
        })
    }

    App(metalLoss, GenericB31GCriticalDepth) {


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
        for (let i = 0; i < metalLoss[0].wallThickness; i++)
        {
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


        return <div>
            <ToggleButtonGroup value={this.state.viewState} onChange={this.handleToggleChange}>
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
                {this.state.viewState.includes('MetalLossHistogram') && (
                    <Bar options={options} data={data} />)}
                {this.state.viewState.includes('ViewOdometerVSCorrosionDepth') && (
                    <Scatter options={OdometerVSCorrosionDepthOptions} data={OdometerVSCorrosionDepth} />)}
                {this.state.viewState.includes('ViewGenericB31GCriticalDepth') && (
                    <Scatter options={CorrosionDepthVSFeatureLengthOptions} data={CorrosionDepthVSFeatureLength} />)}

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
                {this.App(this.state.MetalLoss, this.state.GenericB31GCriticalDepth)}
            </div>
        )
    }
}
export default PreAnalysisChart

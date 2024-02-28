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
import { extend } from 'jquery';
import { DatabaseContext } from '../App';


ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Title);


function App(LeakRuptureBoundryList, B31GModifiedFailurePressure, metalLoss, B31GCriticalDepthCalculations) {


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
        if (metalLoss !== 'undefined') {
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

class MainChartApplication extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isCalculated : false,
            OuterDiameter: '',
            YieldStrength: '',
            FullSizedCVN: '',
            PressureOfInterest: '',
            WallThickness: '',
            SafetyFactor: '',
            LeakRuptureBoundryList: [],
            B31GModifiedFailurePressure: [],
            MetalLoss: JSON.parse(sessionStorage.metalLoss),
            PressureOfInterest: [],
            B31GCriticalDepth: [],
            FullyMappedVariables: []
        };
    }


    async componentDidMount() {
        await this.calculateFromMetalLossList();


    }

    async calculateFromMetalLossList() {
        let b31GInputs = {
            OuterDiameter: this.state.OuterDiameter,
            YieldStrength: this.state.YieldStrength,
            PressureOfInterest: this.state.PressureOfInterest,
            SafetyFactor: this.state.SafetyFactor
        };

        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: this.state.MetalLoss,
                inputs: b31GInputs
            })
        };

        const response1 = await fetch('/ilib31gmodifiedcalculation', requestOptions)
        const responseList = await response1.json();


        let leakRuptureBoundaryInputs = {
            OuterDiameter: this.state.OuterDiameter,
            FullSizedCVN: this.state.FullSizedCVN,
            PressureOfInterest: this.state.PressureOfInterest,
            YieldStrength: this.state.YieldStrength

        };

        requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: this.state.MetalLoss,
                inputs: leakRuptureBoundaryInputs
            })
        };

        const response2 = await fetch('/ilifullleakrupturecalculation', requestOptions)
        const responseList2 = await response2.json();

        let B31GCriticalDepthInputs = {
            OuterDiameter: this.state.OuterDiameter,
            FullSizedCVN: this.state.FullSizedCVN,
            PressureOfInterest: this.state.PressureOfInterest,
            YieldStrength: this.state.YieldStrength,
            WallThickness: this.state.WallThickness

        };

        requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: this.state.MetalLoss,
                inputs: B31GCriticalDepthInputs
            })
        };

        const response4 = await fetch('/ilib31gmodifiedcriticaldepth', requestOptions)
        const responseList4 = await response4.json();


        this.setState({
            B31GCriticalDepth: responseList4,
            LeakRuptureBoundryList: responseList2,
            B31GModifiedFailurePressure: responseList
        })
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
                {this.state.isCalculated ? App(this.state.LeakRuptureBoundryList, this.state.B31GModifiedFailurePressure, this.state.MetalLoss, this.state.B31GCriticalDepth) : ''}
            </div>
        )
    }
}
export default MainChartApplication


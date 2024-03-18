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
import PreAnalysisGraphGeneration from './PreAnalysisGraphGeneration';


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
            InputList: {
                OuterDiameter: '',
                YieldStrength: '',
                FullSizedCVN: '',
                PressureOfInterest: '',
                WallThickness: '',
                SafetyFactor: '',
            },
            viewState: [],
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
            OuterDiameter: this.state.InputList.OuterDiameter,
            FullSizedCVN: this.state.InputList.FullSizedCVN,
            PressureOfInterest: this.state.InputList.PressureOfInterest,
            YieldStrength: this.state.InputList.YieldStrength,
            WallThickness: this.state.InputList.WallThickness

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


    render() {
        return (
            <div>
                <DatabaseContext.Consumer>
                    {({ inputList, isCalculated }) => {
                        this.state.InputList.OuterDiameter = inputList.OuterDiameter,
                            this.state.InputList.YieldStrength = inputList.YieldStrength,
                            this.state.InputList.FullSizedCVN = inputList.FullSizedCVN,
                            this.state.InputList.PressureOfInterest = inputList.PressureOfInterest,
                            this.state.InputList.WallThickness = inputList.WallThickness,
                            this.state.InputList.SafetyFactor = inputList.SafetyFactor,
                            this.state.isCalculated = isCalculated

                    }}
                </DatabaseContext.Consumer>
                {this.state.isCalculated ? <PreAnalysisGraphGeneration metalLoss={this.state.MetalLoss} GenericB31GCriticalDepth={this.state.GenericB31GCriticalDepth} InputList={this.state.InputList} /> : ''}
            </div>
        )
    }
}
export default PreAnalysisChart

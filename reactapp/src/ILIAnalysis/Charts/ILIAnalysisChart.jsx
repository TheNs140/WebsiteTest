import * as React from 'react';
import { DatabaseContext } from '../../App';

import ILIAnalysisGraphGeneration from './ILIAnalysisGraphGeneration';






class MainChartApplication extends React.Component {

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


        //This is the inputs for B31G Calculation
        let b31GInputs = {
            OuterDiameter: this.state.InputList.OuterDiameter,
            YieldStrength: this.state.InputList.YieldStrength,
            PressureOfInterest: this.state.InputList.PressureOfInterest,
            SafetyFactor: this.state.InputList.SafetyFactor
        };

        //This create an option variable that contains the inputs and the metal loss list to eventually pass to the controller
        let requestOptionsB31GFailurePressure = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: this.state.MetalLoss,
                inputs: b31GInputs
            })
        };


        //This is the inputs for the Leak Rupture Boundary Equation
        let leakRuptureBoundaryInputs = {
            OuterDiameter: this.state.InputList.OuterDiameter,
            FullSizedCVN: this.state.InputList.FullSizedCVN,
            PressureOfInterest: this.state.InputList.PressureOfInterest,
            YieldStrength: this.state.InputList.YieldStrength

        };

        //This creates an option variable that contains the inputs and the metal loss list to pass to the controller to calculate the Leak Rupture Boundary list
        let requestOptionsLeakRupture = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: this.state.MetalLoss,
                inputs: leakRuptureBoundaryInputs
            })
        };


        //This is the inputs for the generic Leak Rupture Boundary Equation
        //This does not actually use values from the ILI List. It uses the generic pipeline inputs from the user
        let genericleakRuptureBoundaryInputs = {
            OuterDiameter: this.state.InputList.OuterDiameter,
            FullSizedCVN: this.state.InputList.FullSizedCVN,
            PressureOfInterest: this.state.InputList.PressureOfInterest,
            YieldStrength: this.state.InputList.YieldStrength,
            WallThickness: this.state.InputList.WallThickness

        };

        //This creates an option variable that contains the inputs and the metal loss list to pass to the controller to calculate the generic Leak Rupture Boundary list
        let requestOptionsGenericLeakRupture = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(genericleakRuptureBoundaryInputs)
        };

        //This is the inputs for the B31G Critical Depth Calculation
        let B31GCriticalDepthInputs = {
            OuterDiameter: this.state.InputList.OuterDiameter,
            FullSizedCVN: this.state.InputList.FullSizedCVN,
            PressureOfInterest: this.state.InputList.PressureOfInterest,
            YieldStrength: this.state.InputList.YieldStrength,
            WallThickness: this.state.InputList.WallThickness

        };

        //This creates an option variable that contains the inputs and the metal loss list to pass to the controller to calculate the B31G Critical Depth list
        let requestOptionsB31GCriticalDepth = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: this.state.MetalLoss,
                inputs: B31GCriticalDepthInputs
            })
        };


        //This is the fetch request to the controller to calculate all the values and store them in responses
        //This is asynchronous so that it will be faster
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
                {this.state.isCalculated ? <ILIAnalysisGraphGeneration LeakRuptureBoundryList={this.state.GenericLeakRuptureBoundaryCalculation} B31GModifiedFailurePressure={this.state.B31GModifiedFailurePressure} metalLoss={this.state.MetalLoss} B31GCriticalDepthCalculations={this.state.B31GCriticalDepth} InputList={this.state.InputList} /> : ''}
            </div>
        )
    }
}
export default MainChartApplication

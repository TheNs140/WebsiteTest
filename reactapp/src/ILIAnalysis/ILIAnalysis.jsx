import React, { Component, useRef } from 'react';
import ReactComponent from './Table';
import App from './Charts';
import { DatabaseContext } from '../App';
import "./ILIMainPageStyling.css";
import "./ILIAnalysisStyling.css";

export default class ILIAnalysis extends Component {

    static displayName = ILIAnalysis.name;
    

    constructor(props) {
        super(props);
        this.state = {
            OuterDiameter: '',
            YieldStrength: '',
            FullSizedCVN: '',
            PressureOfInterest: '',
            WallThickness: '',
            SafetyFactor: '',
            DataBaseName: '',

            leakRuptureBoundaryCalculation: [],
            b31GCalculation: [],
            genericLeakRuptureBoundaryCalculation: [],
            B31GCriticalDepthCalculations: [],
            metalLoss: [],
            iscalculated: true,
            ischart: false,
        };
    }

    async componentDidMount() {
        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.DataBaseName)
        };

        const response = await fetch('metalloss', requestOptions);
        const data = await response.json();
        this.setState({ metalLoss: data });
        this.calculateB31G();

    }


    async calculateB31G() {

        // Simple POST request with a JSON body using fetch
        let b31GInputs = {
            OuterDiameter: this.state.OuterDiameter,
            YieldStrength: this.state.YieldStrength,
            PressureOfInterest: this.state.PressureOfInterest,
            SafetyFactor: this.state.SafetyFactor
        };

        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(b31GInputs)
        };

        const response1 = await fetch('/ilib31gmodifiedcalculation', requestOptions)
        const responseList = await response1.json();
        this.state.b31GCalculation = responseList;


        let leakRuptureBoundaryInputs = {
            OuterDiameter: this.state.OuterDiameter,
            FullSizedCVN: this.state.FullSizedCVN,
            PressureOfInterest: this.state.PressureOfInterest,
            YieldStrength: this.state.YieldStrength

        };

        requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leakRuptureBoundaryInputs)
        };

        const response2 = await fetch('/ilifullleakrupturecalculation', requestOptions)
        const responseList2 = await response2.json();
        this.state.leakRuptureBoundaryCalculation = responseList2;


        let genericleakRuptureBoundaryInputs = {
            OuterDiameter: this.state.OuterDiameter,
            FullSizedCVN: this.state.FullSizedCVN,
            PressureOfInterest: this.state.PressureOfInterest,
            YieldStrength: this.state.YieldStrength,
            WallThickness: this.state.WallThickness

        };

        requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(genericleakRuptureBoundaryInputs)
        };

        const response3 = await fetch('/leakruptureboundrycalculation', requestOptions)
        const responseList3 = await response3.json();
        this.state.genericLeakRuptureBoundaryCalculation = responseList3;


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
            body: JSON.stringify(B31GCriticalDepthInputs)
        };

        const response4 = await fetch('/ilib31gmodifiedcriticaldepth', requestOptions)
        const responseList4 = await response4.json();
        this.state.B31GCriticalDepthCalculations = responseList4;


        this.setState({ iscalculated: true });

    }

    InputHandler = () => {
        this.setState({ iscalculated: false });
    }

    TableHandler = () => {
        this.setState({ iscalculated: true });
        this.setState({ ischart: false });
    }

    ChartHandler = () => {
        this.setState({ iscalculated: true });
        this.setState({ ischart: true });
    }    
    handleSubmission = (e) => {

        e.preventDefault();
        this.calculateB31G();
    }

    handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    };




    render() {
        let formcontents = this.state.ischart ? App(this.state.genericLeakRuptureBoundaryCalculation, this.state.b31GCalculation, this.state.metalLoss, this.state.B31GCriticalDepthCalculations) : ReactComponent(this.state.leakRuptureBoundaryCalculation, this.state.b31GCalculation);
        let showformcontents = this.state.iscalculated ? formcontents : null;
        
        return (
            <div>

                <div>

                    <DatabaseContext.Consumer>
                        {({ dataBaseName, inputList }) => (
                            <>
                                {this.state.DataBaseName = dataBaseName}
                                {
                                    this.state.OuterDiameter = inputList.OuterDiameter,
                                    this.state.YieldStrength = inputList.YieldStrength,
                                    this.state.FullSizedCVN = inputList.FullSizedCVN,
                                    this.state.PressureOfInterest = inputList.PressureOfInterest,
                                    this.state.WallThickness = inputList.WallThickness,
                                    this.state.SafetyFactor = inputList.SafetyFactor
                                }
                            </>
                        )}

                    </DatabaseContext.Consumer>
                    <ul className="nav nav-tabs">
                        <li className="nav-item" >
                            <a className="nav-link" id="submitbutton" role="button" onClick={this.TableHandler} >Table</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={this.ChartHandler}>Chart</a>
                        </li>
                    </ul>
                </div>
                {showformcontents}
                </div>
        );
    }
}


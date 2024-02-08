import React, { Component, useRef } from 'react';
import ReactComponent from './Table';
import App from './Charts';
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
        
            leakRuptureBoundaryCalculation: [],
            b31GCalculation: [],
            genericLeakRuptureBoundaryCalculation: [],
            metalLoss: [],
            iscalculated: false,
            ischart: false,
        };
    }

    async componentDidMount() {

        const response = await fetch('metalloss');
        const data = await response.json();
        this.setState({ metalLoss: data });
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

    SumbitValues() {

        return (
            <form onSubmit={this.handleSubmission}>
                <label htmlFor="OuterDiameter">Outer Diameter</label>
                <input type="text" id="OuterDiameter" name="OuterDiameter" value={this.state.OuterDiameter} onChange={this.handleInputChange} />

                <label htmlFor="YieldStrength">Yield Strength</label>
                <input type="text" id="YieldStrength" name="YieldStrength" value={this.state.YieldStrength} onChange={this.handleInputChange} />

                <label htmlFor="FullSizedCVN">Full Sized CVN</label>
                <input type="text" id="FullSizedCVN" name="FullSizedCVN" value={this.state.FullSizedCVN} onChange={this.handleInputChange} />

                <label htmlFor="PressureOfInterest">Pressure of Interest</label>
                <input type="text" id="PressureOfInterest" name="PressureOfInterest" value={this.PressureOfInterest} onChange={this.handleInputChange} />

                <label htmlFor="WallThickness">Wall Thickness</label>
                <input type="text" id="WallThickness" name="WallThickness" value={this.WallThickness} onChange={this.handleInputChange} />

                <label htmlFor="SafetyFactor">Safety Factor</label>
                <input type="text" id="SafetyFactor" name="SafetyFactor" value={this.SafetyFactor} onChange={this.handleInputChange} />

                <button type="submit">Calculate</button>
            </form>
        );
    }


    render() {
        let formcontents = this.state.ischart ? App(this.state.genericLeakRuptureBoundaryCalculation, this.state.b31GCalculation, this.state.metalLoss) : ReactComponent(this.state.leakRuptureBoundaryCalculation, this.state.b31GCalculation);
        let formsubmission = this.state.iscalculated? '' : this.SumbitValues();
        let showformcontents = this.state.iscalculated ? formcontents : null;
        return (
            <div>
                <div>
                    <ul className="nav nav-tabs">
                        <li className="nav-item" >
                            <a className="nav-link" id="submitbutton" role="button" onClick={this.TableHandler} >Table</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={this.ChartHandler}>Chart</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={this.InputHandler}>Input</a>
                        </li>
                    </ul>
                </div>
                {formsubmission}
                {showformcontents}

            </div>
        );
    }
}


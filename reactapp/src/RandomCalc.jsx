import React, { Component } from 'react';

export default class App extends Component {
    static displayName = App.name;

    constructor(props) {
        super(props);
        this.state = {
            calculation: [],
            dataList: [],
            loading: true,
            viewForm: false
        };
    }


    static renderCalculations(calculation) {


        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>outerDiameter</th>
                        <th>wallThickness</th>
                        <th>yieldStrength</th>
                        <th>Depth</th>
                        <th>Length</th>
                        <th>RadialWidth</th>
                        <th>FullSizedCVN</th>
                        <th>PressureOfInterest</th>
                    </tr>
                </thead>
                <tbody>
                    {calculation.map((calculation, index) => (
                        <tr key={index}>
                            <td>{calculation.PipeParameters.OuterDiameter}</td>
                            <td>{calculation.PipeParameters.WallThickness}</td>
                            <td>{calculation.PipeParameters.YieldStrength}</td>
                            <td>{calculation.MetalLossParameters.Depth}</td>
                            <td>{calculation.MetalLossParameters.Length}</td>
                            <td>{calculation.MetalLossParameters.RadialWidth}</td>
                            <td>{calculation.FullSizedCVN}</td>
                            <td>{calculation.PressureOfInterest}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    async fetchTheFormula() {
        // Simple POST request with a JSON body using fetch
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.calculation)
        };

        const response = await fetch('/leakruptureboundrycalculation', requestOptions)
        const responseList = await response.json();
        this.state.dataList = responseList;

        this.setState({ viewForm: true });

    }

    static RenderLeakRuptureCalculation(dataList) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Remaining Strength</th>
                        <th>Predicted Rupture Strength</th>
                        <th>Predicted Rupture Pressure</th>
                        <th>Predicted Failure Mode</th>

                    </tr>
                </thead>
                <tbody>
                    {dataList.map((dataList, index) => (
                        <tr key={index}>
                            <td>{dataList.RemainingStrength}</td>
                            <td>{dataList.PredictedRuptureStrength}</td>
                            <td>{dataList.PredictedRupturePressure}</td>
                            <td>{dataList.PredictedFailureMode}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );

    }

    handleButtonClick = () => {
        this.fetchTheFormula();
    };

    render() {
        let contents = this.state.loading
            ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
            : App.renderCalculations(this.state.calculation);

        let formcontents = this.state.viewForm
            ? App.RenderLeakRuptureCalculation(this.state.dataList)
            : '';

        return (
            <div>
                <h1 id="tabelLabel" >Leak Rupture Boundry Values</h1>
                <p>This component demonstrates fetching data from the server.</p>
                {contents}
                <a className="btn btn-primary" id="submitbutton" role="button" onClick={this.handleButtonClick} >Calculate</a>
                {formcontents}
            </div>
        );
    }
    componentDidMount() {
        this.populateRandomCalc();
    }
    async populateRandomCalc() {
        const response = await fetch('randomCalculation');
        const data = await response.json();
        this.setState({ calculation: data, loading: false });
    }


}



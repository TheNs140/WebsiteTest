import React, { Component } from 'react';

export default class App extends Component {
    static displayName = App.name;

    constructor(props) {
        super(props);
        this.state = { calculation: [], loading: true };
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
                    {calculation.map(calculation =>
                        <tr key={calculation.pipeParameters.outerDiameter}>
                            <td>{calculation.pipeParameters.outerDiameter}</td>
                            <td>{calculation.pipeParameters.wallThickness}</td>
                            <td>{calculation.pipeParameters.yieldStrength}</td>
                            <td>{calculation.metalLossParameters.depth}</td>
                            <td>{calculation.metalLossParameters.length}</td>
                            <td>{calculation.metalLossParameters.radialWidth}</td>
                            <td>{calculation.fullSizedCVN}</td>
                            <td>{calculation.pressureOfInterest}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
    render() {
        let contents = this.state.loading
            ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
            : App.renderCalculations(this.state.calculation);

        return (
            <div>
                <h1 id="tabelLabel" >Weather forecast</h1>
                <p>This component demonstrates fetching data from the server.</p>
                {contents}
            </div>
        );
    }
    componentDidMount() {
        this.populateRandomCalc();
    }
    async populateRandomCalc() {
        const response = await fetch('randomCalculation');
        const data = await response.json();
        this.setState({ calcaulation: data, loading: false });
    }
}
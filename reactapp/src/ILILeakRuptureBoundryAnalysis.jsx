import React, { Component } from 'react';

export default class ILILeakRuptureBoundryAnalysis extends Component {

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
}



export default ILILeakRuptureBoundryAnalysis;
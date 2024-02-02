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
            leakRuptureBoundaryCalculation: [],
            b31GCalculation: [],
            ischart: true,
        };
    }

    async componentDidMount() {

        const response1 = await fetch('ilifullleakrupturecalculation');
        let data = await response1.json();
        this.setState({ leakRuptureBoundaryCalculation: data, loading: false });

        const response2 = await fetch('ilib31gmodifiedcalculation');
        data = await response2.json();
        this.setState({ b31GCalculation: data, loading: false });

    }

    OnClickHandler = () => {
        this.setState({ ischart: !this.state.ischart });
        this.render();
    }


    render() {

        let formcontents = this.state.ischart ? ReactComponent(this.state.leakRuptureBoundaryCalculation, this.state.b31GCalculation) : App(this.state.leakRuptureBoundaryCalculation);

        return (
            <div>
                <div>
                    <ul className="nav nav-tabs">
                        <li className="nav-item" >
                            <a className="nav-link" id="submitbutton" role="button" onClick={this.OnClickHandler} >Table</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Chart</a>
                        </li>
                    </ul>

                </div>
                {formcontents}

            </div>
        );
    }
}


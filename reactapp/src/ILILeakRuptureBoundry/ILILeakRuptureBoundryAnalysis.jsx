import React, { Component, useRef } from 'react';
import ReactComponent from './Table';
import App from './Charts';
export default class ILILeakRuptureBoundryAnalysis extends Component {

    static displayName = ILILeakRuptureBoundryAnalysis.name;

    constructor(props) {
        super(props);
        this.state = {
            calculation: [],
            ischart: true,
        };
    }

    async componentDidMount() {

        const response = await fetch('ilifullleakrupturecalculation');
        const data = await response.json();
        this.setState({ calculation: data, loading: false });

    }

    OnClickHandler = () => {
        this.setState({ ischart: !this.state.ischart });
        this.render();
    }


    render() {

        let formcontents = this.state.ischart ? ReactComponent(this.state.calculation) : App(this.state.calculation);


        return (
            <div>
                <h1 id="tabelLabel" >Leak Rupture Boundry Values</h1>
                <p>This component demonstrates fetching data from the server.</p>
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


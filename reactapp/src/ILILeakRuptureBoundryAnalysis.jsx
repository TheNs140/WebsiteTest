import React, { Component, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import "./ILILeakRuptureStyle.css";
export default class ILILeakRuptureBoundryAnalysis extends Component {

    static displayName = ILILeakRuptureBoundryAnalysis.name;

    constructor(props) {
        super(props);
        this.state = {
            calculation: [],
            loading: true,
        };
    }

    async componentDidMount() {

        const response = await fetch('ilifullleakrupturecalculation');
        const data = await response.json();
        this.setState({ calculation: data, loading: false });

    }

    static RenderLeakRuptureCalculation(dataList) {

        const autoSizeStrategy = {
            type: 'fitGridWidth',
            defaultMinWidth: 100,
            columnLimits: [
                {
                    colId: 'country',
                    minWidth: 900
                }
            ]
        };

        // Column Definitions: Defines & controls grid columns.
        let coldef = [
            {
                field: "RemainingStrength",
                filter: true
            },
            {
                field: "PredictedRuptureStrength",
                filter: true
            },
            {
                field: "PredictedRupturePressure",
                filter: true
            },
            {
                field: "PredictedFailureMode",
                filter: true
            }
        ]

        return (
            // Container
            <div className="ag-theme-quartz" style={{ height: 500 }}>
                {/* The AG Grid component */}
                <AgGridReact pagination={true}
                    autoSizeStrategy={autoSizeStrategy}
                    rowData={dataList}
                    columnDefs={coldef} />
            </div>
        );
    }

    render() {

        let formcontents = this.state.loading
            ? ''
            : ILILeakRuptureBoundryAnalysis.RenderLeakRuptureCalculation(this.state.calculation);

        return (
            <div>
                <h1 id="tabelLabel" >Leak Rupture Boundry Values</h1>
                <p>This component demonstrates fetching data from the server.</p>
                {formcontents}
            </div>
        );
    }
}


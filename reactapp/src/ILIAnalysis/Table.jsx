import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import "./ILIAnalysisStyling.css";
import 'ag-grid-community/styles/ag-theme-quartz.css';

function ReactComponent(LeakRuptureBoundryList, B31GModifiedFailurePressure) {
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

    let combinedArray = LeakRuptureBoundryList.map((PredictedRupturePressure, index) => {
        let b31GValue = B31GModifiedFailurePressure[index];
        let mode = "";
        if (b31GValue && typeof b31GValue.FailurePressure !== 'undefined') {
             mode = b31GValue.FailurePressure > PredictedRupturePressure.PredictedRupturePressure ? "Rupture" : "Leak";
        }

        // Combine values as needed
        return {
            leakRuptureValue: PredictedRupturePressure,
            b31GValue: b31GValue,
            mode: mode
            // Add more properties as needed
        };
    });


    // Column Definitions: Defines & controls grid columns.
    let LeakRuptureColDef = [
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

    // Column Definitions: Defines & controls grid columns.
    let B31GFailurePressureColDef = [
        {
            field: "RupturePressureRatio",

            filter: true
        },
        {
            field: "YieldPressure",
            filter: true
        },
        {
            field: "FailurePressure",
            filter: true
        },
        {
            field: "SafeOperatingPressure",
            filter: true
        },
        {
            field: "Acceptable",
            filter: true
        }
    ]
    let combinedDataColDef = [
        {
            field: "b31GValue.FailurePressure",

            filter: true
        },
        {
            field: "leakRuptureValue.PredictedRupturePressure",
            filter: true
        },        
        {
            field: "mode",
            filter: true
        }

    ]

    return (
        // Container
        <div className="ag-theme-quartz" style={{ height: 500 }}>
            {/* The AG Grid component */}
            <h1 id="tabelLabel" >Leak Rupture Boundry Values</h1>
            <AgGridReact pagination={true}
                autoSizeStrategy={autoSizeStrategy}
                rowData={LeakRuptureBoundryList}
                columnDefs={LeakRuptureColDef} />
            <h1 id="tabelLabel" >B31G Failure Pressure Values</h1>
            <AgGridReact pagination={true}
                autoSizeStrategy={autoSizeStrategy}
                rowData={B31GModifiedFailurePressure}
                columnDefs={B31GFailurePressureColDef} />
            <h1 id="tabelLabel" >Combined B31G Failure Pressure and Leak Rupture Boundary Rupture Pressure</h1>
            <AgGridReact pagination={true}
                autoSizeStrategy={autoSizeStrategy}
                rowData={combinedArray}
                columnDefs={combinedDataColDef} />
        </div>
    );
}

export default ReactComponent;
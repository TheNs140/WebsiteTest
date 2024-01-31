import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import "./ILILeakRuptureStyle.css";


function ReactComponent(dataList) {
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

export default ReactComponent;
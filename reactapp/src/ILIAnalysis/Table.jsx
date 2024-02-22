import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import "./ILIAnalysisStyling.css";
import 'ag-grid-community/styles/ag-theme-quartz.css';

function ReactComponent(LeakRuptureBoundryList, B31GModifiedFailurePressure, MetalLoss, PressureOfInterest) {
    const autoSizeStrategy = {
        type: 'fitCellContents',
        defaultMinWidth: 100
    };


    let FullChartValues = MetalLoss.map((metalLoss, index) => {
        let featureid = metalLoss.featureID;
        let odometer = metalLoss.odometer;
        let featuretype = metalLoss.featureType;
        let depth = metalLoss.depth;
        let length = metalLoss.length;
        let featureradial = metalLoss.featureRadial;
        let wallthickness = metalLoss.wallThickness;
        let safetyfactor = B31GModifiedFailurePressure[index].FailurePressure / PressureOfInterest;
        let failurepressure = B31GModifiedFailurePressure[index].FailurePressure;
        let safeoperatingpressure = B31GModifiedFailurePressure[index].SafeOperatingPressure;
        let mode = B31GModifiedFailurePressure[index].FailurePressure > LeakRuptureBoundryList.PredictedRupturePressure ? "Rupture" : "Leak";


        // Combine values as needed
        return {
            featureID: featureid,
            odometer: odometer,
            featureType: featuretype,
            depth: depth,
            length: length,
            featureRadial: featureradial,
            wallThickness: wallthickness,
            failurePressure: failurepressure,
            SafetyFactor: safetyfactor,
            safeOperatingPressure: safeoperatingpressure,
            mode : mode
            // Add more properties as needed
        };
    });



    // Column Definitions: Defines & controls grid columns.
    let collectiveColDef = [
        {
            field: "featureID",
            filter: true
        },
        {
            field: "odometer",
            filter: true
        },
        {
            field: "featureType",
            filter: true
        },

        {
            field: "depth",
            headerName: "Depth (%)",
            filter: true
        },
        {
            field: "length",
            filter: true
        },
        {
            field: "featureRadial",
            filter: true
        },
        {
            field: "wallThickness",
            filter: true
        },
        {
            field: "failurePressure",
            filter: true
        },
        {
            field: "SafetyFactor",
            headerName: "Predicted Failure Mode @ Pressure of Interest",
            filter: true
        },
        {
            field: "safeOperatingPressure",
            filter: true
        },
        {
            field: "mode",
            filter: true
        },
    ]

    return (
        // Container
        <div className="ag-theme-quartz" style={{ height: 750 }}>
            {/* The AG Grid component */}
            <h1 id="tabelLabel" >Combined Value Tables</h1>
            <AgGridReact pagination={true}
                autoSizeStrategy={autoSizeStrategy}
                rowData={FullChartValues}
                columnDefs={collectiveColDef} />
        </div>
    );
}

export default ReactComponent;
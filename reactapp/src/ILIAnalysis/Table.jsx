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
        let remainingLife = 
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
            field: "featureType",
            filter: true
        },
        {
            field: "odometer",
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
            headerName: "Predicted Failure Mode @ Pressure of Interest",
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
            field: "FailurePressure",
            filter: true
        },
        {
            field: "SafeOperatingPressure",
            filter: true
        },
        {
            field: "Acceptable",
            headerName: "Acceptable @ MAOP",
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
            headerName: "Predicted Failure Mode @ B31G Failure Pressure",
            filter: true
        }

    ]

    return (
        // Container
        <div className="ag-theme-quartz" style={{ height: 500 }}>
            {/* The AG Grid component */}
            <h1 id="tabelLabel" >Combined Value Tables</h1>
            <AgGridReact pagination={true}
                autoSizeStrategy={autoSizeStrategy}
                rowData={FullChartValues}
                columnDefs={collectiveColDef} />
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
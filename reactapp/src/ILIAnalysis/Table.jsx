import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import "./ILIAnalysisStyling.css";
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { DatabaseContext } from '../App';

class TableComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            LeakRuptureBoundryList: JSON.parse(sessionStorage.leakRuptureBoundaryCalculation),
            B31GModifiedFailurePressure: JSON.parse(sessionStorage.b31GCalculation),
            MetalLoss: JSON.parse(sessionStorage.metalLoss),
            PressureOfInterest: JSON.parse(sessionStorage.PressureOfInterest),
            B31GCriticalDepth: JSON.parse(sessionStorage.B31GCriticalDepthCalculations),
            FullyMappedVariables: []
        };

    }

        

    autoSizeStrategy = {
        type: 'fitCellContents',
        defaultMinWidth: 100
    };

    
    mapFunctions() {
        let FullChartValues = this.state.MetalLoss.map((metalLoss, index) => {
            let featureid = metalLoss.featureID;
            let odometer = metalLoss.odometer;
            let featuretype = metalLoss.featureType;
            let depth = metalLoss.depth;
            let length = metalLoss.length;
            let featureradial = metalLoss.featureRadial;
            let wallthickness = metalLoss.wallThickness;
            let safetyfactor = this.state.B31GModifiedFailurePressure[index].FailurePressure / this.state.PressureOfInterest;
            let failurepressure = this.state.B31GModifiedFailurePressure[index].FailurePressure;
            let remainingLife = (this.state.B31GCriticalDepth[index].CriticalDepth - metalLoss.depth) / 1.5;
            let safeoperatingpressure = this.state.B31GModifiedFailurePressure[index].SafeOperatingPressure;
            let mode = this.state.B31GModifiedFailurePressure[index].FailurePressure > this.state.LeakRuptureBoundryList.PredictedRupturePressure ? "Rupture" : "Leak";


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
                remainingLife: remainingLife,
                mode: mode

                // Add more properties as needed
            };
        });
        this.state.FullyMappedVariables = FullChartValues;

    }

    // Column Definitions: Defines & controls grid columns.
    collectiveColDef = [
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
            filter: true
        },
        {
            field: "safeOperatingPressure",
            filter: true
        },
        {
            field: "remainingLife",
            filter: true
        },
        {
            field: "mode",
            filter: true
        },
    ]

    render() {
        let tempMetalLoss = '';
        this.mapFunctions();
        return(
            <div className="ag-theme-quartz" style={{ height: 750 }}>

            {/* The AG Grid component */}
            <h1 id="tabelLabel" >Combined Value Tables</h1>
            <AgGridReact pagination={true}
                autoSizeStrategy={this.autoSizeStrategy}
                rowData={this.state.FullyMappedVariables}
                columnDefs={this.collectiveColDef} />
            </div>
        )
    };
}

export default TableComponent;
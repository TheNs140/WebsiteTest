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
            OuterDiameter: '',
            YieldStrength: '',
            FullSizedCVN: '',
            PressureOfInterest: '',
            WallThickness: '',
            SafetyFactor: '',
            LeakRuptureBoundryList: [],
            B31GModifiedFailurePressure: [],
            MetalLoss: JSON.parse(sessionStorage.metalLoss),
            PressureOfInterest: [],
            B31GCriticalDepth: [],
            FullyMappedVariables: []
        };

    }


    async componentDidMount() {
        await this.calculateFromMetalLossList();
        this.mapFunctions();


    }

    async calculateFromMetalLossList() {
        let b31GInputs = {
            OuterDiameter: this.state.OuterDiameter,
            YieldStrength: this.state.YieldStrength,
            PressureOfInterest: this.state.PressureOfInterest,
            SafetyFactor: this.state.SafetyFactor
        };

        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: this.state.MetalLoss,
                inputs: b31GInputs
            })
        };

        const response1 = await fetch('/ilib31gmodifiedcalculation', requestOptions)
        const responseList = await response1.json();
        this.state.B31GModifiedFailurePressure = responseList;


        let leakRuptureBoundaryInputs = {
            OuterDiameter: this.state.OuterDiameter,
            FullSizedCVN: this.state.FullSizedCVN,
            PressureOfInterest: this.state.PressureOfInterest,
            YieldStrength: this.state.YieldStrength

        };

        requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: this.state.MetalLoss,
                inputs: leakRuptureBoundaryInputs
            })
        };

        const response2 = await fetch('/ilifullleakrupturecalculation', requestOptions)
        const responseList2 = await response2.json();
        this.state.LeakRuptureBoundryList = responseList2;

        let B31GCriticalDepthInputs = {
            OuterDiameter: this.state.OuterDiameter,
            FullSizedCVN: this.state.FullSizedCVN,
            PressureOfInterest: this.state.PressureOfInterest,
            YieldStrength: this.state.YieldStrength,
            WallThickness: this.state.WallThickness

        };

        requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: this.state.MetalLoss,
                inputs: B31GCriticalDepthInputs
            })
        };

        const response4 = await fetch('/ilib31gmodifiedcriticaldepth', requestOptions)
        const responseList4 = await response4.json();
        this.state.B31GCriticalDepth = responseList4;

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
        this.setState({ FullyMappedVariables: FullChartValues })

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
        return(
            <div className="ag-theme-quartz" style={{ height: 750 }}>
               <DatabaseContext.Consumer>
                    {({ inputList }) => {
                            this.state.OuterDiameter = inputList.OuterDiameter,
                            this.state.YieldStrength = inputList.YieldStrength,
                            this.state.FullSizedCVN = inputList.FullSizedCVN,
                            this.state.PressureOfInterest = inputList.PressureOfInterest,
                            this.state.WallThickness = inputList.WallThickness,
                            this.state.SafetyFactor = inputList.SafetyFactor
                                                
                    }}
                    
                </DatabaseContext.Consumer>
            {/* The AG Grid component */}
            <AgGridReact pagination={true}
                autoSizeStrategy={this.autoSizeStrategy}
                rowData={this.state.FullyMappedVariables}
                columnDefs={this.collectiveColDef} />
            </div>
        )
    };
}

export default TableComponent;
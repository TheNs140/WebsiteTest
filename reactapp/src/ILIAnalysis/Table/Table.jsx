import React, { useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import "../Styling/ILIAnalysisStyling.css";
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { DatabaseContext } from '../../App';
import Button from '@mui/material/Button';
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
            InputAnalysisList: {
                InternalCorrosionRate: '',
                ExternalCorrosionRate: '',
            },
            isCalculated: false,
            LeakRuptureBoundryList: [],
            B31GModifiedFailurePressure: [],
            MetalLoss: [],
            PressureOfInterest: [],
            B31GCriticalDepth: [],
            FullyMappedVariables: []
        };
        this.Ref = React.createRef();
        this.saveTable = this.saveTable.bind(this);

    }


    saveTable() {
        this.Ref.current.api.exportDataAsCsv();
    }


    async componentDidMount() {

        if (this.state.isCalculated === true) {
            await this.setState({ MetalLoss: JSON.parse(sessionStorage.metalLoss) });
            await this.calculateFromMetalLossList();
            this.mapFunctions();
        }




    }

    async calculateFromMetalLossList() {
        let b31GInputs = {
            OuterDiameter: this.state.OuterDiameter,
            YieldStrength: this.state.YieldStrength,
            PressureOfInterest: this.state.PressureOfInterest,
            SafetyFactor: this.state.SafetyFactor
        };

        let requestOptionsB31GFailurePressure = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: this.state.MetalLoss,
                inputs: b31GInputs
            })
        };


        let leakRuptureBoundaryInputs = {
            OuterDiameter: this.state.OuterDiameter,
            FullSizedCVN: this.state.FullSizedCVN,
            PressureOfInterest: this.state.PressureOfInterest,
            YieldStrength: this.state.YieldStrength

        };

        let requestOptionsLeakRupture = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: this.state.MetalLoss,
                inputs: leakRuptureBoundaryInputs
            })
        };


        let B31GCriticalDepthInputs = {
            OuterDiameter: this.state.OuterDiameter,
            FullSizedCVN: this.state.FullSizedCVN,
            PressureOfInterest: this.state.PressureOfInterest,
            YieldStrength: this.state.YieldStrength,
            WallThickness: this.state.WallThickness

        };

        let requestOptionsB31GCriticalDepth = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: this.state.MetalLoss,
                inputs: B31GCriticalDepthInputs
            })
        };


        const [response1, response2, response4] = await Promise.all([
            fetch('/ilib31gmodifiedcalculation', requestOptionsB31GFailurePressure),
            fetch('/ilifullleakrupturecalculation', requestOptionsLeakRupture),
            fetch('/ilib31gmodifiedcriticaldepth', requestOptionsB31GCriticalDepth)
        ]);

        const [responseList, responseList2, responseList4] = await Promise.all([
            response1.json(),
            response2.json(),
            response4.json(),
        ]);
        this.state.B31GModifiedFailurePressure = responseList;
        this.state.LeakRuptureBoundryList = responseList2;
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
            let remainingLife = "";
            if (metalLoss.featureRadial == "Internal")
                remainingLife = (this.state.B31GCriticalDepth[index].CriticalDepth - (metalLoss.depth * metalLoss.wallThickness)) / this.state.InputAnalysisList.InternalCorrosionRate;
            if (metalLoss.featureRadial == "External")
                remainingLife = (this.state.B31GCriticalDepth[index].CriticalDepth - (metalLoss.depth * metalLoss.wallThickness)) / this.state.InputAnalysisList.ExternalCorrosionRate;
            let safeoperatingpressure = this.state.B31GModifiedFailurePressure[index].SafeOperatingPressure;
            let mode = this.state.B31GModifiedFailurePressure[index].FailurePressure > this.state.LeakRuptureBoundryList.PredictedRupturePressure ? "Rupture" : "Leak";
            let criticalDepth = this.state.B31GCriticalDepth[index].CriticalDepth;

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
                criticalDepth: criticalDepth,
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
        {
            field: "criticalDepth",
            filter: true
        }
    ]

    render() {
        return (
            <div>
            <h1>ILI Analysis Table</h1>

            <div className="grid-sizing">
                <DatabaseContext.Consumer>
                {({ inputList, analysisInputList, isCalculated }) => {
                            this.state.OuterDiameter = inputList.OuterDiameter,
                            this.state.YieldStrength = inputList.YieldStrength,
                            this.state.FullSizedCVN = inputList.FullSizedCVN,
                            this.state.PressureOfInterest = inputList.PressureOfInterest,
                            this.state.WallThickness = inputList.WallThickness,
                            this.state.SafetyFactor = inputList.SafetyFactor
                            this.state.isCalculated = isCalculated;     
                            this.state.InputAnalysisList.InternalCorrosionRate = analysisInputList.InternalCorrosionRate,
                            this.state.InputAnalysisList.ExternalCorrosionRate = analysisInputList.ExternalCorrosionRate
                    }}
                    
                </DatabaseContext.Consumer>
                {/* The AG Grid component */}
                <Button variant="outlined" onClick={this.saveTable}>Download</Button>
                <div className="ag-theme-quartz" style={{ justifyContent: 'center', height: 850 }}>

                    <AgGridReact pagination={true}
                        autoSizeStrategy={this.autoSizeStrategy}
                        rowData={this.state.FullyMappedVariables}
                        columnDefs={this.collectiveColDef}
                        ref={this.Ref}
                    />
                </div>
                </div>
            </div>
        )
    };
}

export default TableComponent;
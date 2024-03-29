import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import "../Styling/ILIAnalysisStyling.css";
import "../Styling/TableStyling.css";
import 'ag-grid-community/styles/ag-theme-quartz.css';
import "../Styling/ILIAnalysisStyling.css";
import { DatabaseContext } from '../../App';
import Button from '@mui/material/Button';

class DigListTableComponent extends React.Component {

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
            LeakRuptureBoundryList: [],
            B31GModifiedFailurePressure: [],
            MetalLoss: JSON.parse(sessionStorage.metalLoss),
            PressureOfInterest: [],
            B31GCriticalDepth: [],
            FullyMappedVariables: []
        };
        this.Ref = React.createRef();
        this.saveTable = this.saveTable.bind(this);
    }


    autoSizeStrategy = {
        type: 'fitCellContents',
        defaultMinWidth: 100
    };



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

        //This is for the B31G Calculation List
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



        //This is for the Leak Rupture Boundary List
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



        //This is for the B31G Critical Depth List
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



        //This awaits for the fetch to be completed and then stores the response in the state
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


    mapFunctions() {


        //This maps all the values from all the lists and combines them into one list
        let FullChartValues = this.state.MetalLoss.map((metalLoss, index) => {
            let featureid = '';
            let odometer = '';
            let featuretype = '';
            let depth = '';
            let featureradial = '';
            let wallthickness = '';
            let safetyfactor = '';
            let failurepressure = '';
            let remainingLife = '';
            let safeoperatingpressure = '';
            let mode = '';
            let length = '';


            //This is the logic for which values will be included in the dig list
            if ((this.state.B31GModifiedFailurePressure[index].FailurePressure / this.state.PressureOfInterest) < this.state.SafetyFactor || (this.state.B31GCriticalDepth[index].CriticalDepth - (metalLoss.depth * metalLoss.wallThickness)) / 0.15 < 10 || metalLoss.depth > 0.7) {
                featureid = metalLoss.featureID;
                odometer = metalLoss.odometer;
                featuretype = metalLoss.featureType;
                depth = metalLoss.depth;
                length = metalLoss.length;
                featureradial = metalLoss.featureRadial;
                wallthickness = metalLoss.wallThickness;
                safetyfactor = this.state.B31GModifiedFailurePressure[index].FailurePressure / this.state.PressureOfInterest;
                failurepressure = this.state.B31GModifiedFailurePressure[index].FailurePressure;
                if (metalLoss.featureRadial == "Internal")
                    remainingLife = (this.state.B31GCriticalDepth[index].CriticalDepth - (metalLoss.depth * metalLoss.wallThickness)) / this.state.InputAnalysisList.InternalCorrosionRate;
                if (metalLoss.featureRadial == "External")
                    remainingLife = (this.state.B31GCriticalDepth[index].CriticalDepth - (metalLoss.depth * metalLoss.wallThickness)) / this.state.InputAnalysisList.ExternalCorrosionRate;
                safeoperatingpressure = this.state.B31GModifiedFailurePressure[index].SafeOperatingPressure;
                mode = this.state.B31GModifiedFailurePressure[index].FailurePressure > this.state.LeakRuptureBoundryList.PredictedRupturePressure ? "Rupture" : "Leak";
            }
            else {
                return null;
            }

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
        //We remove all the null values from the list because when an element is not qualified for the dig list it is turned into null
        const newData = FullChartValues.filter(element => element !== null)
        this.setState({ FullyMappedVariables: newData })

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
        return (
            <div className="ag-theme-quartz" style={{ justifyContent: 'center', height: 850 }}>
                <h1>
                Dig List
                </h1>
                <DatabaseContext.Consumer>
                    {({ inputList, analysisInputList, isCalculated }) => {
                        this.state.OuterDiameter = inputList.OuterDiameter,
                            this.state.YieldStrength = inputList.YieldStrength,
                            this.state.FullSizedCVN = inputList.FullSizedCVN,
                            this.state.PressureOfInterest = inputList.PressureOfInterest,
                            this.state.WallThickness = inputList.WallThickness,
                            this.state.SafetyFactor = inputList.SafetyFactor,
                            this.state.isCalculated = isCalculated
                            this.state.InputAnalysisList.InternalCorrosionRate = analysisInputList.InternalCorrosionRate,
                            this.state.InputAnalysisList.ExternalCorrosionRate = analysisInputList.ExternalCorrosionRate

                    }}

                </DatabaseContext.Consumer>
                <Button variant="outlined" onClick={this.saveTable}>Download</Button>

                {/* The AG Grid component */}
                <AgGridReact pagination={true}
                    autoSizeStrategy={this.autoSizeStrategy}
                    rowData={this.state.FullyMappedVariables}
                    columnDefs={this.collectiveColDef}
                    ref={this.Ref}/>
            </div>
        )
    };
}

export default DigListTableComponent;
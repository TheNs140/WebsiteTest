import * as Plot from "@observablehq/plot";
import PlotFigure from "./PlotFigure.jsx";
export default function App(dataList) {
    return (
        <div>
            <h1>Line Plot</h1>
            <PlotFigure
                options={{
                    marks: [
                        Plot.dot(dataList, { x: "PredictedRuptureStrength", y: "RemainingStrength" })
                    ]
                }}
            />
        </div>
    );
}
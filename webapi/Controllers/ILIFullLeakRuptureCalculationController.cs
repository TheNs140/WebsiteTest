using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;
using NCIntegrity.Common.Entities;
using webapi.Models;
using NCIntegrity.Domain.Entities;


namespace webapi.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class ILIFullLeakRuptureCalculationController:ControllerBase
    {

        public class LeakRuptureBoundaryParameters
        {
            public LeakRuptureBoundaryWebsiteInput inputs { get; set; }
            public MetalLossParameterPassing[] data { get; set; }
        }

        [HttpPost]
        public IEnumerable<LeakRuptureBoundryAnalysisOutput> Post([FromBody] LeakRuptureBoundaryParameters parameters)
        {

            LeakRuptureBoundaryWebsiteInput input = parameters.inputs;
            MetalLossParameterPassing[] allMetalLoss = parameters.data;

            List<LeakRuptureBoundryAnalysisInput> dataList = new List<LeakRuptureBoundryAnalysisInput>();
            List<LeakRuptureBoundryAnalysisOutput> results = new List<LeakRuptureBoundryAnalysisOutput>();

            for(int i =0; i < allMetalLoss.Count(); i++)
            {
                dataList.Add(new LeakRuptureBoundryAnalysisInput(new Pipe(input.OuterDiameter, allMetalLoss[i].wallThickness, input.YieldStrength), new MetalLoss(allMetalLoss[i].depth, allMetalLoss[i].length, allMetalLoss[i].width), null, input.FullSizedCVN, input.PressureOfInterest));
            }

            for(int i = 0; i < allMetalLoss.Count(); i++ )
            {
                results.Add(LeakRuptureBoundryAnalysis.Calculate(dataList[i]));
            }

            return results.ToArray();
        }


            
    }
}

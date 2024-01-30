using Microsoft.AspNetCore.Mvc;
using NCIntegrity.Common.Entities;
using System.IO.Pipelines;
using System.Security.Cryptography;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RandomCalculationController: ControllerBase
    {
        private readonly ILogger<RandomCalculationController> _logger;

        public RandomCalculationController(ILogger<RandomCalculationController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetRandomCalculation")]
        public IEnumerable<LeakRuptureBoundryAnalysisInput> Get()
        {
            var PipeParameters = new NCIntegrity.Common.Entities.Pipe(610, 7.8, 359);
            var MetalLossParameters = new MetalLoss(0, .1, 1);
            MetalLossParameters.FeatureID = "";
            MetalLossParameters.Location = new Location(0, 0, 0);
            var FullSizedCVN = 45;
            var PressureOfInterest = 8260;
            // Manually set the values for the function
            var randomCalc1 = new LeakRuptureBoundryAnalysisInput(PipeParameters,MetalLossParameters, "", FullSizedCVN, PressureOfInterest);

            PipeParameters = new NCIntegrity.Common.Entities.Pipe(610, 7.8, 359);
            MetalLossParameters = new MetalLoss(0, 500, 0);
            MetalLossParameters.Location = new Location(0, 0, 0);
            MetalLossParameters.FeatureID = "";
            FullSizedCVN = 45;
            PressureOfInterest = 8260;
            var randomCalc2 = new LeakRuptureBoundryAnalysisInput(PipeParameters, MetalLossParameters, "", FullSizedCVN, PressureOfInterest);
            return new List<LeakRuptureBoundryAnalysisInput> { randomCalc1, randomCalc2 };
        }
    }
}

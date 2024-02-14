using Microsoft.AspNetCore.Mvc;
using NCIntegrity.Common.Entities;
using System.IO.Pipelines;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RandomCalcController: ControllerBase
    {
        private readonly ILogger<RandomCalcController> _logger;

        public RandomCalcController(ILogger<RandomCalcController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetRandomCalc")]
        public IEnumerable<RandomCalc> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new RandomCalc
            {
                pipeParameters = new NCIntegrity.Common.Entities.Pipe(index, index, index),
                metalLossParameters = new MetalLoss(index, index, index),
                fullSizedCVN = index,
                pressureOfInterest = index

            })
            .ToArray();
        }   
    }
}

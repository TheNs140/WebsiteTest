using NCIntegrity.Common;
using NCIntegrity.Common.Interfaces;

namespace webapi
{
    public class RandomCalc
    {
        public IPipe pipeParameters { get; set; }
        public IMetalLoss metalLossParameters { get; set; }
        public double fullSizedCVN { get; set; }
        public double pressureOfInterest { get; set; }


    }
}

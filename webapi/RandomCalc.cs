using NCIntegrity.Common;
using NCIntegrity.Common.Entities;
using NCIntegrity.Common.Interfaces;

namespace webapi
{
    public class RandomCalc
    {
        public Pipe pipeParameters { get; set; }
        public MetalLoss metalLossParameters { get; set; }
        public double fullSizedCVN { get; set; }
        public double pressureOfInterest { get; set; }


    }
}

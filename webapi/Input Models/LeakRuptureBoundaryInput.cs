namespace webapi.Input_Models
{
    public class LeakRuptureBoundaryInput
    {
        public int FullSizedCVN { get; set; }

        public int OuterDiameter { get; set; }

        public int PressureOfInterest { get; set; }

        public int WallThickness { get; set; }

        public int YieldStrength { get; set; }
    }
}

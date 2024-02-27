using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;


namespace webapi.Models
{
    public class MetalLossParameterPassing
    {
        public ObjectId Id { get; set; }

        public double odometer { get; set; }

        public double jointNumber { get; set; }

        public string featureType { get; set; }

        public double featureID { get; set; }

        public double distance { get; set; }

        public double jointLength { get; set; }

        public double wallThickness { get; set; }

        public double latitude { get; set; }

        public double longitude { get; set; }

        public double elevation { get; set; }

        public double distanceToUSGirthWeld { get; set; }

        public double distanceToDSGirthWeld { get; set; }

        public double length { get; set; }

        public double width { get; set; }

        public double depth { get; set; }

        public string featureRadial { get; set; }

        public string? featureOrientation { get; set; }


    }
}

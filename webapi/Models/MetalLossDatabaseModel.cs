using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace webapi.Models
{
    public class MetalLossDatabaseModel
    {

            public ObjectId Id { get; set; }

            [BsonElement("Odometer")]
            public double odometer { get; set; }

            [BsonElement("Joint Number")]
            public double jointNumber { get; set; }

            [BsonElement("Feature Type")]
            public string featureType { get; set; }

            [BsonElement("Feature ID")]
            public double featureID { get; set; }

            [BsonElement("Distance (m)")]
            public double distance { get; set; }

            [BsonElement("Joint Length")]
            public double jointLength { get; set; }

            [BsonElement("Wall Thickness")]
            public double wallThickness { get; set; }

            [BsonElement("Latitude")]
            public double latitude { get; set; }

            [BsonElement("Longitude")]
            public double longitude { get; set; }

            [BsonElement("Elevation")]
            public double elevation { get; set; }

            [BsonElement("Distance to Upstream Girth Weld")]
            public double distanceToUSGirthWeld { get; set; }

            [BsonElement("Distance to Downstream Girth Weld")]
            public double distanceToDSGirthWeld { get; set; }

            [BsonElement("Feature Length")]
            public double length { get; set; }

            [BsonElement("Feature Width")]
            public double width { get; set; }

            [BsonElement("Feature Depth")]
            public double depth { get; set; }

            [BsonElement("Feature Radial")]
            public string featureRadial { get; set; }

            [BsonElement("Feature Orientation")]
            public string featureOrientation { get; set; }

       
    }
}


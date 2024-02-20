using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;
using NCIntegrity.Common.Entities;
using webapi.Models;
using NCIntegrity.Domain.Entities;
using NCIntegrity.Common.Entities.Inputs;

namespace webapi.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class ILIB31GModifiedCalculationController : ControllerBase
    {

        [HttpPost]
        public IEnumerable<B31GModifiedFailurePressureOutput> Post([FromBody]B31GWebsiteInput input)
        {
            const string connectionUri = "mongodb+srv://NCIS_website_18941:F47DzEW64qjc43PpihvHvuVFCu3qUuiJyqKkcJsDSCb@production.byyabze.mongodb.net/";
            var settings = MongoClientSettings.FromConnectionString(connectionUri);
            // Set the ServerApi field of the settings object to set the version of the Stable API on the client
            settings.ServerApi = new ServerApi(ServerApiVersion.V1);
            var client = new MongoClient(settings);
            // Send a ping to confirm a successful connection
            try
            {
                var result = client.GetDatabase("admin").RunCommand<BsonDocument>(new BsonDocument("ping", 1));
                Console.WriteLine("Pinged your deployment. You successfully connected to MongoDB!");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            var dbList = client.GetDatabase("Northern_Crescent___Virtual_Pipeline");

            var collectionList = dbList.GetCollection<MetalLossDatabaseModel>("model_onstream_xlsx___20240216");

            var filter = Builders<MetalLossDatabaseModel>.Filter.Eq(r => r.featureType, "Metal Loss");
            var allMetalLoss = collectionList.Find(filter).ToList();

            List<B31GInput> dataList = new List<B31GInput>();
            List<B31GModifiedFailurePressureOutput> results = new List<B31GModifiedFailurePressureOutput>();

            for (int i = 0; i < allMetalLoss.Count; i++)
            {
                dataList.Add(new B31GInput(new Feature(), new MetalLoss(allMetalLoss[i].depth, allMetalLoss[i].length, allMetalLoss[i].width), new Pipe(input.OuterDiameter, allMetalLoss[i].wallThickness, input.YieldStrength), input.PressureOfInterest, input.SafetyFactor));
            }

            for (int i = 0; i < allMetalLoss.Count; i++)
            {
                results.Add(B31GModified.CalculateFailurePressure(dataList[i]));
            }

            return results.ToArray();
        }



    }
}

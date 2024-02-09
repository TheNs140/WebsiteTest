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

        [HttpPost]
        public IEnumerable<LeakRuptureBoundryAnalysisOutput> Post([FromBody] LeakRuptureBoundaryWebsiteInput input)
        {
            const string connectionUri = "mongodb+srv://josmarbcristello:mz8hisZPbiISvqIx@nccluster.rtxgull.mongodb.net/?retryWrites=true&w=majority";
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

            var dbList = client.GetDatabase("ILI_Sample_Data");

            var collectionList = dbList.GetCollection<MetalLossDatabaseModel>("sample_onstream_20170719_2");

            var filter = Builders<MetalLossDatabaseModel>.Filter.Eq(r => r.featureType, "Metal Loss");
            var allMetalLoss = collectionList.Find(filter).ToList();

            List<LeakRuptureBoundryAnalysisInput> dataList = new List<LeakRuptureBoundryAnalysisInput>();
            List<LeakRuptureBoundryAnalysisOutput> results = new List<LeakRuptureBoundryAnalysisOutput>();

            for(int i =0; i < allMetalLoss.Count; i++)
            {
                dataList.Add(new LeakRuptureBoundryAnalysisInput(new Pipe(input.OuterDiameter, allMetalLoss[i].wallThickness, input.YieldStrength), new MetalLoss(allMetalLoss[i].depth, allMetalLoss[i].length, allMetalLoss[i].width), null, input.FullSizedCVN, input.PressureOfInterest));
            }

            for(int i = 0; i < allMetalLoss.Count; i++ )
            {
                results.Add(LeakRuptureBoundryAnalysis.Calculate(dataList[i]));
            }

            return results.ToArray();
        }


            
    }
}

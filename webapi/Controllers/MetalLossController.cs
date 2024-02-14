using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using NCIntegrity.Common.Entities.Inputs;
using NCIntegrity.Common.Entities;
using NCIntegrity.Domain.Entities;
using webapi.Models;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MetalLossController:ControllerBase
    {

        [HttpPost]
        public IEnumerable<MetalLossDatabaseModel> Post([FromBody] string dataBaseName)
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

            var dbList = client.GetDatabase(dataBaseName);

            var collectionList = dbList.GetCollection<MetalLossDatabaseModel>("sample_onstream_20170719_2");

            var filter = Builders<MetalLossDatabaseModel>.Filter.Eq(r => r.featureType, "Metal Loss");
            var allMetalLoss = collectionList.Find(filter).ToList();

            return allMetalLoss.ToArray();
        }
    }
}

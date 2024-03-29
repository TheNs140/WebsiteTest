﻿using Microsoft.AspNetCore.Mvc;
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

        [HttpGet]
        public IEnumerable<B31GModifiedFailurePressureOutput> Get()
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

            var collectionList = dbList.GetCollection<MetalLossDatabaseModel>("ILI_Big_Data_Sample");

            var filter = Builders<MetalLossDatabaseModel>.Filter.Eq(r => r.featureType, "Metal Loss");
            var allMetalLoss = collectionList.Find(filter).ToList();

            List<B31GInput> dataList = new List<B31GInput>();
            List<B31GModifiedFailurePressureOutput> results = new List<B31GModifiedFailurePressureOutput>();

            for (int i = 0; i < allMetalLoss.Count; i++)
            {
                dataList.Add(new B31GInput(new Feature(), new MetalLoss(allMetalLoss[i].depth, allMetalLoss[i].length, allMetalLoss[i].width), new Pipe(273, allMetalLoss[i].wallThickness, 479), 12000, 1.25));
            }

            for (int i = 0; i < allMetalLoss.Count; i++)
            {
                results.Add(B31GModified.CalculateFailurePressure(dataList[i]));
            }

            return results.ToArray();
        }



    }
}

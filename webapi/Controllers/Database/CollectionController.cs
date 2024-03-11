using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;
using webapi.Models;

namespace webapi.Controllers.Database
{
    [ApiController]
    [Route("[controller]")]
    public class CollectionController : ControllerBase
    {
        [HttpPost]
        public IEnumerable<string> Post([FromBody] string input)
        {
            const string connectionUri = "mongodb+srv://NCIS_website_18941:F47DzEW64qjc43PpihvHvuVFCu3qUuiJyqKkcJsDSCb@production.byyabze.mongodb.net/";
            var settings = MongoClientSettings.FromConnectionString(connectionUri);
            // Set the ServerApi field of the settings object to set the version of the Stable API on the client
            settings.ServerApi = new ServerApi(ServerApiVersion.V1);
            var client = new MongoClient(settings);
            // Send a ping to confirm a successful connection

            var dbList = client.GetDatabase(input);

            var collectionList = dbList.ListCollectionNames().ToList();


            return collectionList.ToArray();
        }
    }
}

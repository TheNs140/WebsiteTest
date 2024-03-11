using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Collections.Generic;

namespace webapi.Controllers.Database
{
    [ApiController]
    [Route("[controller]")]
    public class DatabaseController : ControllerBase
    {
        [HttpGet]
        public IEnumerable<string> Get()
        {
            const string connectionUri = "mongodb+srv://NCIS_website_18941:F47DzEW64qjc43PpihvHvuVFCu3qUuiJyqKkcJsDSCb@production.byyabze.mongodb.net/";

            var client = new MongoClient(connectionUri);
            var databases = client.ListDatabaseNames().ToList();

            return databases;
        }
    }
}

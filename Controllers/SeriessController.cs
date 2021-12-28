using Assignment1_ServerSide.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Assignment1_ServerSide.Controllers
{
    public class SeriessController : ApiController
    {


        //Get List of Series for requested user account for recommend/request mode.
        [HttpGet]
        public List<Series> Get(string mail,string mode)
        {
            Series s = new Series();
            return s.Get(mail,mode);
        }


        // POST Series in Series + Favorites.
        public int Post([FromBody] Series series)
        {
            return series.Insert();
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}
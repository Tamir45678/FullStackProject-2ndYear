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
    public class EpisodesController : ApiController
    {

        //Get List of Episodes Liked of requested user account and series.
        [HttpGet]
        public List<Episode> Get(int seriesID,string mail)
        {
            Episode e = new Episode();
            List<Episode> eList = e.Get(seriesID,mail);
            return eList;

        }
        

        //Get Dataset for all Admin data to render datatables. 
        [HttpGet]
        public DataSet GetAdminData()
		{
            Episode e = new Episode();
            return e.GetAdminData();
        }


        // POST Episode in Episodes + Favorites.
        public int Post([FromBody] Episode e,string mail)
        {
            e.Insert(mail);
            return 1;
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
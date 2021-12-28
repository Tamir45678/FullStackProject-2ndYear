using Assignment1_ServerSide.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Assignment1_ServerSide.Controllers
{
    public class MoviesController : ApiController
    {

        //Get List of Movies for requested user account for recommend/request mode.
        public List<Movie> Get(string mail,string mode)
        {
            Movie m = new Movie();
            return m.Get(mail, mode);
        }

        // POST Movie in Movies + favoriteMovies.
        [HttpPost]
        public HttpResponseMessage Post([FromBody] Movie movie,string mail)
        {
            int num = movie.Insert(mail);
            if (num > 0)
                return Request.CreateResponse(HttpStatusCode.OK, "Movie Added Successfully");
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "You have already added this!");
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
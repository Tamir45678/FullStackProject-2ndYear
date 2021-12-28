using Assignment1_ServerSide.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Assignment1_ServerSide.Controllers
{
    public class UsersController : ApiController
    {

        // User Login
        [HttpGet]
        public HttpResponseMessage Get(string mail,string password)
        {
            User u = new User();
            User found = u.Get(mail, password);
            if (found.Mail == null)
                return Request.CreateErrorResponse(HttpStatusCode.NotFound,mail + " does not exist or Password Incorrect");
            return Request.CreateResponse(HttpStatusCode.OK, found);
        }

        // POST api/<controller>
        [HttpPost]
        public int Post([FromBody] User u)
        {
            return u.Insert();
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
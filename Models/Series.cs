using Assignment1_ServerSide.Models.DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace Assignment1_ServerSide.Models
{
    public class Series
    {
        int id;
        string first_Air_Date;
        string name;
        string origin_Country;
        string original_Language;
        string overview;
        double popularity;
        string poster_Path;

        public Series(int id, string first_Air_Date, string name, string origin_Country, string original_Language, string overview, double popularity, string poster_Path)
        {
            Id = id;
            First_Air_Date = first_Air_Date;
            Name = name;
            Origin_Country = origin_Country;
            Original_Language = original_Language;
            Overview = overview;
            Popularity = popularity;
            Poster_Path = poster_Path;
        }

        public Series()
        { }


        public int Id { get => id; set => id = value; }
        public string First_Air_Date { get => first_Air_Date; set => first_Air_Date = value; }
        public string Name { get => name; set => name = value; }
        public string Origin_Country { get => origin_Country; set => origin_Country = value; }
        public string Original_Language { get => original_Language; set => original_Language = value; }
        public string Overview { get => overview; set => overview = value; }
        public double Popularity { get => popularity; set => popularity = value; }
        public string Poster_Path { get => poster_Path; set => poster_Path = value; }



        public int Insert()
        {
            DataServices ds = new DataServices();
            return ds.Insert(this);
        }

        public List<Series> Get(string mail,string mode)
        {
            DataServices ds = new DataServices();
            if(mode.Equals("Favorites"))
                return ds.Get(mail);
            return ds.GetRecommendations(mail);
        }

    }
}
using Assignment1_ServerSide.Models.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Assignment1_ServerSide.Models
{
    public class Movie
    {
		int id;
		string title;
		string release_Date;
		string original_Language;
		string overview;
		double popularity;
		string backdrop_Path;
		string status;
		string tagline;

        public Movie(int id, string title, string release_Date, string original_Language, string overview, double popularity, string backdrop_Path, string status, string tagline)
        {
            Id = id;
            Title = title;
            Release_Date = release_Date;
            Original_Language = original_Language;
            Overview = overview;
            Popularity = popularity;
            Backdrop_Path = backdrop_Path;
            Status = status;
            Tagline = tagline;
        }

        public Movie()
        {

        }
        public int Id { get => id; set => id = value; }
        public string Title { get => title; set => title = value; }
        public string Release_Date { get => release_Date; set => release_Date = value; }
        public string Original_Language { get => original_Language; set => original_Language = value; }
        public string Overview { get => overview; set => overview = value; }
        public double Popularity { get => popularity; set => popularity = value; }
        public string Backdrop_Path { get => backdrop_Path; set => backdrop_Path = value; }
        public string Status { get => status; set => status = value; }
        public string Tagline { get => tagline; set => tagline = value; }

        public int Insert(string mail)
        {
            DataServices ds = new DataServices();
            return ds.Insert(this,mail);
        }

        public List<Movie> Get(string mail,string mode)
        {
            DataServices ds = new DataServices();
            if (mode.Equals("Favorites"))
                return ds.GetMovies(mail);
            return ds.GetMovieRecommendations(mail);
        }
    }
}
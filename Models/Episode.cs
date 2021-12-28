using Assignment1_ServerSide.Models.DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
namespace Assignment1_ServerSide.Models
{
    public class Episode
    {
        int id;
        string seriesName;
        int season;
        string episodeName;
        string imageURL;
        string overview;
        string airDate;
        public Episode(int id,string seriesName, int season, string episodeName, string imageURL, string overview, string airDate)
        {
            Id = id;
            SeriesName = seriesName;
            Season = season;
            EpisodeName = episodeName;
            ImageURL = imageURL;
            Overview = overview;
            AirDate = airDate;
        }
		public Episode()
		{
		}

        public string SeriesName { get => seriesName; set => seriesName = value; }
        public int Season { get => season; set => season = value; }
        public string EpisodeName { get => episodeName; set => episodeName = value; }
        public string ImageURL { get => imageURL; set => imageURL = value; }
        public string Overview { get => overview; set => overview = value; }
        public string AirDate { get => airDate; set => airDate = value; }
        public int Id { get => id; set => id = value; }

        public int Insert(string mail)
        {
            DataServices ds = new DataServices();
            ds.Insert(this,mail);
            return 1;
        }



        public List<Episode> Get(int seriesID,string mail)
        {
            DataServices ds = new DataServices();
            List<Episode> eList = ds.Get(seriesID,mail);
            return eList;
        }

        public DataSet GetAdminData()
        {
            DataServices ds = new DataServices();
            return ds.GetAdminData();
        }

    }
}
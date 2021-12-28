using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Data;
using System.Text;
using System.Data.SqlClient;


namespace Assignment1_ServerSide.Models.DAL
{
    public class DataServices
    {
        int current_SeriesID = 0;
        int current_UserID = 0;

        public SqlDataAdapter da;
        //public DataTable dt;
        public DataSet ds;


        public DataServices()
        {
        }


        //--------------------------------------------------------------------------------------------------
        // This method creates a connection to the database according to the connectionString name in the web.config 
        //--------------------------------------------------------------------------------------------------
        public SqlConnection connect(String conString)
        {

            // read the connection string from the configuration file
            string cStr = WebConfigurationManager.ConnectionStrings[conString].ConnectionString;
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }

        public DataSet GetAdminData()
        {
            if (ds == null)
                ds = new DataSet("AdminDS");
            SqlConnection con;
            try
            {
                con = connect("connectionDB");
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            try
            {
                string usersDT = "SELECT * FROM UsersTBL;";
                string moviesDT = "select ID, s.Title, count(distinct f.User_ID) NumOfUsers from Movies s inner join favoriteMovies f on s.ID = f.Movie_ID GROUP BY ID,s.Title;";
                string seriesDT = "select ID, s.Name, count(distinct f.User_ID) NumOfUsers from Series s inner join Favorites f on s.ID = f.Series_ID GROUP BY ID,s.Name;";
                string episodesDT = "select e.Series_ID,s.Name ,e.ID,e.Episode_Name ,count(distinct f.User_ID) NumOfUsers from Episodes e inner join Favorites f on e.ID = f.Episode_ID inner join Series s on e.Series_ID = s.ID GROUP BY e.Series_ID,s.Name,e.ID, e.Episode_Name";

                SqlDataAdapter da = new SqlDataAdapter(usersDT +moviesDT+seriesDT+ episodesDT, con);
                da.TableMappings.Add("Table", "Users");
                da.TableMappings.Add("Table1", "LikedMovies");
                da.TableMappings.Add("Table2", "LikedSeries");
                da.TableMappings.Add("Table3", "LikedEpisodes");
                da.Fill(ds);
                return ds;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                    con.Close();
            }
        }


        //Series_POST_DB
        public int Insert(Series series)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("ConnectionDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            String cStr = BuildInsertCommand(series);      // helper method to build the insert string


            cmd = CreateCommand(cStr, con);             // create the command

            try
            {
                int numEffected = cmd.ExecuteNonQuery(); // execute the command
                return numEffected;
            }
            catch (SqlException ex)
            {
                // write to log
                if (ex.Number == 2627)
                    return 0;
                throw ex;

            }
            catch (Exception ex)
            {
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }
        // Insert Selected Episode 
        public int Insert(Episode episode, string mail)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("ConnectionDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            current_UserID = GetUserID(mail);
            current_SeriesID = GetSeriesID(episode.SeriesName);
            String cStr = BuildInsertCommand(episode);      // helper method to build the insert string
            cmd = CreateCommand(cStr, con);

            try
            {
                int numEffected = cmd.ExecuteNonQuery(); // execute the command
                return numEffected + InsertToFavorites(episode);
            }

            catch (SqlException ex)
            {
                // write to log
                if (ex.Number == 2627)
                    return InsertToFavorites(episode);
                throw ex;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {

                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }

        public int Insert(Movie movie,string mail)
        {
            SqlConnection con;
            SqlCommand cmd;
            current_UserID = GetUserID(mail);
            try
            {
                con = connect("ConnectionDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            String cStr = BuildInsertCommand(movie);      // helper method to build the insert string
            cmd = CreateCommand(cStr, con);             // create the command

            try
            {
                int numEffected = cmd.ExecuteNonQuery(); // execute the command
                return numEffected + InsertToMovieFavorites(movie);
            }
            catch (SqlException ex)
            {
                // write to log
                if (ex.Number == 2627)
                    return InsertToMovieFavorites(movie);
                throw ex;

            }
            catch (Exception ex)
            {
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }

        public int InsertToFavorites(Episode episode)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("ConnectionDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("Values ({0},{1},{2})", current_UserID, episode.Id, current_SeriesID);
            String prefix = "INSERT INTO Favorites" + "([User_ID],[Episode_ID],[Series_ID])";
            String cStr = prefix + sb.ToString();
            cmd = CreateCommand(cStr, con);

            try
            {
                int numEffected = cmd.ExecuteNonQuery();
                return numEffected;
            }
            catch (SqlException ex)
            {
                // write to log
                if (ex.Number == 2627)
                    return 0;
                throw ex;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }

        }

        public int InsertToMovieFavorites(Movie movie)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("ConnectionDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("Values ({0},{1})", movie.Id , current_UserID);
            String prefix = "INSERT INTO favoriteMovies" + "([Movie_ID],[User_ID])";
            String cStr = prefix + sb.ToString();
            cmd = CreateCommand(cStr, con);

            try
            {
                int numEffected = cmd.ExecuteNonQuery();
                return numEffected;
            }
            catch (SqlException ex)
            {
                // write to log
                if (ex.Number == 2627)
                    return 0;
                throw ex;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }

        }
        public int GetSeriesID(string name)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("ConnectionDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            try
            {
                //Get SeriesID
                String getID = "SELECT [ID] FROM Series where [Name] = '" + name + "'";
                cmd = CreateCommand(getID, con);  // create the command
                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                while (dataReader.Read())
                {
                    current_SeriesID = (int)dataReader[0];
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
            return current_SeriesID;
        }

        public int GetUserID(string mail)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("ConnectionDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            try
            {
                String getUserID = "SELECT [ID] FROM UsersTBL where [Mail] = '" + mail + "'";
                cmd = CreateCommand(getUserID, con);  // create the command
                SqlDataReader userReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                while (userReader.Read())
                {
                    current_UserID = (int)userReader[0];
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
            return current_UserID;
        }

        //User_POST_DB
        public int Insert(User user)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("ConnectionDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            String cStr = BuildInsertCommand(user);      // helper method to build the insert string
            cmd = CreateCommand(cStr, con);             // create the command

            try
            {
                int numEffected = cmd.ExecuteNonQuery(); // execute the command
                return numEffected;
            }
            catch (SqlException ex)
            {
                // write to log
                if (ex.Number == 2627)
                    return 0;
                throw ex;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }

        //--------------------------------------------------------------------
        // Build the Insert command String
        //--------------------------------------------------------------------
        private String BuildInsertCommand(Object obj)
        {
            String command;
            String prefix = "";
            StringBuilder sb = new StringBuilder();
            // use a string builder to create the dynamic string
            switch (obj.GetType().Name)
            {
                case "Series":
                    {
                        Series series = (Series)obj;
                        if (series != null)
                        {
                            string seriesName = series.Name.Replace("'", "");
                            string seriesOverview = series.Overview.Replace("'", "");
                            sb.AppendFormat("Values({0}, '{1}', '{2}','{3}','{4}','{5}',{6},'{7}')", series.Id, series.First_Air_Date, seriesName, series.Origin_Country, series.Original_Language, seriesOverview, series.Popularity, series.Poster_Path);
                            prefix = "INSERT INTO Series " + "([ID], [First_Air_Date], [Name], [Origin_Country], [Original_Language], [Overview], [Popularity], [Poster_Path]) ";
                        }
                        break;
                    }
                case "User":
                    {
                        User user = (User)obj;
                        if (user != null)
                        {
                            sb.AppendFormat("Values('{0}', '{1}', '{2}','{3}','{4}','{5}',{6},'{7}','{8}')", user.FirstName, user.LastName, user.Mail, user.Password, user.PhoneNum, user.Gender, user.BirthYear, user.Style, user.Address);
                            prefix = "INSERT INTO UsersTBL " + "([FirstName], [LastName], [Mail], [Pass], [PhoneNum], [Gender], [BirthYear], [Style], [HomeAddress]) ";
                        }
                        break;
                    }
                case "Episode":
                    {
                        Episode episode = (Episode)obj;
                        string episodeName = episode.EpisodeName.Replace("'", "");
                        string episodeOverview = episode.Overview.Replace("'", "");
                        if (episode != null)
                        {
                            sb.AppendFormat("Values({0}, {1}, {2},'{3}','{4}','{5}','{6}')", current_SeriesID, episode.Id, episode.Season, episodeName, episode.ImageURL, episodeOverview, episode.AirDate);
                            prefix = "INSERT INTO Episodes " + "([Series_ID], [ID], [Season_Number], [Episode_Name],[ImageURL], [Overview], [Air_Date]) ";
                        }
                        break;
                    }
                case "Movie":
                    {
                        Movie movie= (Movie)obj;
                        if (movie != null)
                        {
                            
                            string movieTitle = movie.Title.Replace("'", "");
                            string movieOverview = movie.Overview.Replace("'", "");
                            string tagline = movie.Tagline.Replace("'", "");
                            sb.AppendFormat("Values({0}, '{1}', '{2}','{3}','{4}',{5},'{6}','{7}','{8}')", movie.Id,movieTitle,movie.Release_Date, movie.Original_Language, movieOverview, movie.Popularity, movie.Backdrop_Path, movie.Status,tagline);
                            prefix = "INSERT INTO Movies " + "([ID], [Title], [Release_Date], [Original_Language], [Overview], [Popularity], [Backdrop_Path],[Status],[Tagline]) ";
                        }
                        break;
                    }
            }
            command = prefix + sb.ToString();

            return command;
        }
        //---------------------------------------------------------------------------------
        // Create the SqlCommand
        //---------------------------------------------------------------------------------
        private SqlCommand CreateCommand(String CommandSTR, SqlConnection con)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = CommandSTR;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.Text; // the type of the command, can also be stored procedure

            return cmd;
        }


        public User Get(string mail, string password) 
        {
            SqlConnection con;
            SqlCommand cmd;
            User u = new User();
            try
            {
                con = connect("connectionDB");
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            try
            {
                String cStr = "SELECT * FROM UsersTBL where [Mail]='" + mail + "' and [Pass]='" + password + "'";
                cmd = CreateCommand(cStr, con);

                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    int index = 1;
                    u.FirstName = reader.GetString(index++);
                    u.LastName = reader.GetString(index++);
                    u.Mail = reader.GetString(index++);
                    u.Password = reader.GetString(index++);
                    u.PhoneNum = reader.GetString(index++);
                    u.Gender = reader.GetString(index++).ToCharArray()[0];
                    u.BirthYear = reader.GetInt32(index++);
                    u.Style = reader.GetString(index++);
                    u.Address = reader.GetString(index++);
                }

                if (u.Mail != null && u.Mail.Equals("admin@admin.com"))
                    ds = new DataSet("AdminDS");
                return u;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                    con.Close();
            }
        }

        public List<Series> Get(string mail)
        {
            SqlConnection con;
            SqlCommand cmd;
            List<Series> sList = new List<Series>();
            try
            {
                con = connect("connectionDB");
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            try
            {
                String cStr = "SELECT distinct Series_ID,S.Name,S.Poster_Path FROM Favorites F inner join Series S on F.Series_ID = S.ID  inner join UsersTBL u on u.ID = F.User_ID where u.Mail='" + mail + "'";
                cmd = CreateCommand(cStr, con);

                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Series s = new Series();
                    s.Id = (int)reader["Series_ID"];
                    s.Name = reader["Name"].ToString();
                    s.Poster_Path = reader["Poster_Path"].ToString();
                    sList.Add(s);
                }
                return sList;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
			finally
			{
                if (con != null)
                    con.Close();
			}
        }

        public List<Movie> GetMovies(string mail)
        {
            SqlConnection con;
            SqlCommand cmd;
            List<Movie> mList = new List<Movie>();
            try
            {
                con = connect("connectionDB");
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            try
            {
                String cStr = "SELECT distinct m.* FROM favoriteMovies F inner join Movies m on F.Movie_ID = m.ID  inner join UsersTBL u on u.ID = F.User_ID where u.Mail='" + mail + "'";
                cmd = CreateCommand(cStr, con);

                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    int index = 0;
                    Movie m = new Movie();
                    m.Id = reader.GetInt32(index++);
                    m.Title = reader.GetString(index++);
                    m.Release_Date = reader.GetString(index++);
                    m.Original_Language = reader.GetString(index++);
                    m.Overview = reader.GetString(index++);
                    m.Popularity = reader.GetDouble(index++);
                    m.Backdrop_Path = reader.GetString(index++);
                    m.Status = reader.GetString(index++);
                    m.Tagline = reader.GetString(index++);
                    mList.Add(m);
                }
                return mList;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                    con.Close();
            }
        }

        public List<Episode> Get(int seriesID, string mail)
        {
            SqlConnection con;
            SqlCommand cmd;
            List<Episode> eList = new List<Episode>();
            try
            {
                con = connect("connectionDB");
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            try
            {
                String cStr = "Select E.* FROM Favorites F inner join Episodes E on F.Series_ID=E.Series_ID and F.Episode_ID=E.ID inner join UsersTBL U on U.ID = F.User_ID where U.Mail='" + mail + "' and E.Series_ID = " + seriesID;
                cmd = CreateCommand(cStr, con);

                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Episode e = new Episode();
                    e.Id = (int)reader["ID"];
                    e.Season = (int)reader["Season_Number"];
                    e.EpisodeName = reader["Episode_Name"].ToString();
                    e.ImageURL = reader["ImageURL"].ToString();
                    e.Overview = reader["Overview"].ToString();
                    e.AirDate = reader["Air_Date"].ToString();
                    eList.Add(e);
                }
                return eList;
            }

            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                    con.Close();
            }
        }

        public List<Series> GetRecommendations(string mail)
        {
            SqlConnection con;
            SqlCommand cmd;
            List<Series> sList = new List<Series>();
            try
            {
                con = connect("connectionDB");
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            try
            {
                int userId = GetUserID(mail);
                String cStr = "select distinct s.* from Favorites fav inner join Series s on fav.Series_ID = s.ID where fav.User_ID in (select f2.User_ID from Favorites f1 inner join Favorites f2 on f1.Series_ID = f2.Series_ID  inner join favorites f3 on f2.User_ID = f3.User_ID inner join favorites f4  on f4.User_ID = f1.User_ID where f1.User_ID = "+userId+" and f2.User_ID != "+userId+" group by f1.User_ID, f2.User_ID having ROUND(CAST(count(distinct f2.Series_ID) AS float) / CAST(count(distinct f3.Series_ID) AS float), 2) * ROUND(CAST(count(distinct f1.Series_ID) AS float) / CAST(count(distinct f4.Series_ID) AS float), 2) > 0.3) and fav.Series_ID not in (select distinct favorite.Series_id from Favorites favorite where favorite.User_ID = "+userId+")";
                cmd = CreateCommand(cStr, con);

                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    int index = 0;
                    Series s = new Series();
                    s.Id = reader.GetInt32(index++);
                    s.First_Air_Date = reader.GetString(index++);
                    s.Name = reader.GetString(index++);
                    s.Origin_Country = reader.GetString(index++);
                    s.Original_Language = reader.GetString(index++);
                    s.Overview = reader.GetString(index++);
                    s.Popularity = reader.GetDouble(index++);
                    s.Poster_Path = reader.GetString(index++);
                    sList.Add(s);
                }
                return sList;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                    con.Close();
            }
        }
        public List<Movie> GetMovieRecommendations(string mail)
        {
            SqlConnection con;
            SqlCommand cmd;
            List<Movie> mList = new List<Movie>();
            try
            {
                con = connect("connectionDB");
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            try
            {
                int userId = GetUserID(mail);
                String cStr = "select distinct m.* from favoriteMovies fav inner join Movies m on fav.Movie_ID = m.ID where fav.User_ID in (select f2.User_ID from favoriteMovies f1 inner join favoriteMovies f2 on f1.Movie_ID = f2.Movie_ID inner join favoriteMovies f3 on f2.User_ID = f3.User_ID inner join favoriteMovies f4  on f4.User_ID = f1.User_ID where f1.User_ID = " + userId + " and f2.User_ID != " + userId + " group by f1.User_ID, f2.User_ID having ROUND(CAST(count(distinct f2.Movie_ID) AS float) / CAST(count(distinct f3.Movie_ID) AS float), 2) * ROUND(CAST(count(distinct f1.Movie_ID) AS float) / CAST(count(distinct f4.Movie_ID) AS float), 2) > 0.3) and fav.Movie_ID not in (select distinct favorite.Movie_ID from favoriteMovies favorite where favorite.User_ID = " + userId + ")";
                cmd = CreateCommand(cStr, con);

                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    int index = 0;
                    Movie m = new Movie();
                    m.Id = reader.GetInt32(index++);
                    m.Title = reader.GetString(index++);
                    m.Release_Date = reader.GetString(index++);
                    m.Original_Language = reader.GetString(index++);
                    m.Overview = reader.GetString(index++);
                    m.Popularity = reader.GetDouble(index++);
                    m.Backdrop_Path = reader.GetString(index++);
                    m.Status = reader.GetString(index++);
                    m.Tagline = reader.GetString(index++);
                    mList.Add(m);
                }
                return mList;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                    con.Close();
            }
        }
    }
}
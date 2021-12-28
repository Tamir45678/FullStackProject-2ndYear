using Assignment1_ServerSide.Models.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Assignment1_ServerSide.Models
{

    public class User
    {
        string firstName;
        string lastName;
        string mail;
        string password;
        string phoneNum;
        char gender;
        int birthYear;
        string style;
        string address;


        public User()
        {

        }
        public User(string firstName, string lastName, string mail, string password, string phoneNum, char gender, int birthYear, string style, string address)
        {
            FirstName = firstName;
            LastName = lastName;
            Mail = mail;
            Password = password;
            PhoneNum = phoneNum;
            Gender = gender;
            BirthYear = birthYear;
            Style = style;
            Address = address;
        }

        public string FirstName { get => firstName; set => firstName = value; }
        public string LastName { get => lastName; set => lastName = value; }
        public string Mail { get => mail; set => mail = value; }
        public string Password { get => password; set => password = value; }
        public string PhoneNum { get => phoneNum; set => phoneNum = value; }
        public char Gender { get => gender; set => gender = value; }
        public int BirthYear { get => birthYear; set => birthYear = value; }
        public string Style { get => style; set => style = value; }
        public string Address { get => address; set => address = value; }

        public int Insert()
        {
            DataServices ds = new DataServices();
            return ds.Insert(this);        
        }

        public User Get(string mail,string password)
        {
            DataServices ds = new DataServices();
            User u = ds.Get(mail,password);
            return u;
        }

  //      public List<User> GetUsers()
		//{
  //          DataServices ds = new DataServices();
  //          return ds.GetUsers();
  //      }
    }
}
using DAL.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace Backend.MOJ.Helpers
{
    public static class UserHelper
    {
        public static bool CheckEmailIsExit(string email, string userId)
        {
            bool isExit;
            try
            {
                using (var db = new MOJDBEntities())
                {
                    if (!string.IsNullOrEmpty(userId))
                    {
                        //var user = Get(x => x.Email == email && (string.IsNullOrEmpty(userId) || x.Id != userId) && x.IsDeleted !=true);
                        var user =
                            db.AspNetUsers.Where(
                                x =>
                                    x.Email == email && (string.IsNullOrEmpty(userId) || x.Id != userId)).ToList();
                        isExit = user.Count > 0;
                    }
                    else
                    {
                        //var user = Get(x => x.Email == email);
                        var user = db.AspNetUsers.Where(x => x.Email == email).ToList();
                        isExit = user.Count > 0;
                    }
                }

            }
            catch (Exception)
            {
                isExit = false;
            }
            return isExit;
        }
        public static bool CheckUserNameIsExit(string userName, string userId)
        {
            bool isExit;
            try
            {
                using (var db = new MOJDBEntities())
                {
                    if (!string.IsNullOrEmpty(userId))
                    {
                        //var user = Get(x => x.Email == email && (string.IsNullOrEmpty(userId) || x.Id != userId) && x.IsDeleted !=true);
                        var user =
                            db.AspNetUsers.Where(
                                x =>
                                    x.UserName == userName && (string.IsNullOrEmpty(userId) || x.Id != userId)).ToList();
                        isExit = user.Count > 0;
                    }
                    else
                    {
                        //var user = Get(x => x.Email == email);
                        var user = db.AspNetUsers.Where(x => x.UserName == userName).ToList();
                        isExit = user.Count > 0;
                    }
                }

            }
            catch (Exception)
            {
                isExit = false;
            }
            return isExit;
        }
    }
}
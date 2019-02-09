using DAL.DAL;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;


namespace Backend.MOJ.Helpers
{
    public class CustomAuthorize : AuthorizeAttribute
    {
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            var user = actionContext.RequestContext.Principal.Identity;

            if (user == null || string.IsNullOrWhiteSpace(user.Name))
                return false;


            if (string.IsNullOrWhiteSpace(Roles) && string.IsNullOrWhiteSpace(Users))
                return true;


            var roles = new List<string>();
            if (!string.IsNullOrWhiteSpace(Roles))
            {
                roles =
                    Roles.Split(new[] {","}, StringSplitOptions.RemoveEmptyEntries)
                        .ToList();
            }

            if (roles.Any())
            {
                using (var db = new MOJDBEntities())
                {
                    var hasAnyRole =
                        db.AspNetUsers
                            .Any(x => x.UserName == user.Name && x.AspNetRoles.Any(r => Roles.Contains(r.Name)));

                    if (hasAnyRole)
                    {
                        return true;
                    }
                }
            }


            var users = new List<string>();
            if (!string.IsNullOrWhiteSpace(Users))
            {
                users =
                    Users.Split(new[] {","}, StringSplitOptions.RemoveEmptyEntries)
                        .Select(x => x.ToLower())
                        .ToList();
            }
            if (users.Contains(user.Name.ToLower()))
            {
                return true;
            }

            return false;
            //return base.IsAuthorized(actionContext);
        }
    }
}
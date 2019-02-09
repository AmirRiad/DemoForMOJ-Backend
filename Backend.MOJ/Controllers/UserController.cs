using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web.Http;
using Microsoft.AspNet.Identity;

using static Backend.MOJ.Helpers.Constants;
using DAL.DAL;
using Backend.MOJ.Helpers;

namespace Backend.MOJ.Controllers
{
    //[EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
    [CustomAuthorize]
    [RoutePrefix("api/user")]
    public class UserController : ApiController
    {
        private MOJDBEntities db = new MOJDBEntities();


        #region Manage my info

        [Route("GetUserInformation")]
        [HttpGet]
        public object GetUserInformation()
        {
            var userName = User.Identity.Name;

            var model = GetUserInfo(userName);

            return model;
        }

        #endregion



        #region Manage users info

        [CustomAuthorize(Roles = Helpers.Constants.UserRole.ManageUserRoles)]
        [Route("GetUsersAndRoles")]
        [HttpGet]
        public object GetUsersAndRoles()
        {
            var users =
                db.AspNetUsers.Include(x=>x.LK_SystemUserType).Where(x => x.SystemUserTypeId != (int)SystemUsers.SystemHead)
                    .Select(x => new
                    {
                        userName = x.UserName,
                        displayName = x.UserName,
                        userTypeId=x.SystemUserTypeId,
                        userNameWithTitle = (x.UserName + " - " + x.LK_SystemUserType.Name)
                    })
                    .OrderBy(x=> x.userName)
                    .ToList();

            var roles =
                db.AspNetRoles
                    .Select(x => new
                    {
                        roleName = x.Name,
                        displayName = x.Name
                    })
                    .OrderBy(x=> x.roleName)
                    .ToList();

            var model = new
            {
                users = users,
                roles = roles
            };

            return model;
        }

        [CustomAuthorize(Roles = Helpers.Constants.UserRole.ManageUserRoles)]
        [Route("GetSpecificUserInformation")]
        [HttpGet]
        public object GetSpecificUserInformation(string userName)
        {
            var model = GetUserInfo(userName);

            return model;
        }


        [CustomAuthorize(Roles = Helpers.Constants.UserRole.ManageUserRoles)]
        [Route("UpdateUserRoles")]
        [HttpPut]
        public object UpdateUserRoles(string userName, List<string> roles)
        {
            roles = roles ?? new List<string>();
            roles = roles.Select(x => x.ToLower()).ToList();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user =
                db.AspNetUsers
                .Include(x => x.AspNetRoles)
                .FirstOrDefault(x => x.UserName == userName);

            if (user == null)
            {
                return BadRequest("User (" + userName + ") not found.");
            }

            // remove roles
            var rolesToRemove = 
                user.AspNetRoles.Where(x => !roles.Contains(x.Name.ToLower()))
                .ToList();
            foreach (var userAspNetRole in rolesToRemove)
            {
                user.AspNetRoles.Remove(userAspNetRole);
            }

            // add roles
            var userApsRoleNames = 
                user.AspNetRoles.Select(x => x.Name.ToLower())
                .ToList();
            var newRoleNames = 
                roles.Where(x => !userApsRoleNames.Contains(x.ToLower()))
                .ToList();
            var newRoles = 
                db.AspNetRoles.Where(x => newRoleNames.Contains(x.Name))
                .ToList();
            foreach (var aspNetRole in newRoles)
            {
                user.AspNetRoles.Add(aspNetRole);
            }

            try
            {
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                throw;
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        #endregion


        private object GetUserInfo(string userName)
        {
            var userRoles =
                db.AspNetRoles
                    .Where(x => x.AspNetUsers.Any(u => u.UserName == userName))
                    .Select(x => x.Name)
                    .ToList();
            var userId = User.Identity.GetUserId();
            var userDetails = db.AspNetUsers.Include(x=>x.LK_SystemUserType).Where(x=>x.Id == userId ).FirstOrDefault(); 

            var model = new
            {
                userNameWithTitle= userDetails!=null ? userDetails.UserName +" - "+ userDetails.LK_SystemUserType.Name :"",
                userName = userName,
                displayName = userDetails != null ? userDetails.UserName :"",
                userTypeId= userDetails != null ? userDetails.SystemUserTypeId :-1,
                roles = userRoles
            };
            return model;
        }

        //[Route("AddRole")]
        //[HttpGet]
        //public object AddRole()
        //{
        //    using (var context = new ApplicationDbContext())
        //    {
        //        var roleStore = new RoleStore<IdentityRole>(context);
        //        var roleManager = new RoleManager<IdentityRole>(roleStore);

        //        //await roleManager.CreateAsync(new IdentityRole { Name = "Administrator" });

        //        var userStore = new UserStore<ApplicationUser>(context);
        //        var userManager = new UserManager<ApplicationUser>(userStore);

        //        //var user = new ApplicationUser { UserName = "admin" };
        //        //await userManager.CreateAsync(user);
        //        //await userManager.AddToRoleAsync(user.Id, "Administrator");
        //        var addToRole = userManager.AddToRole("a1d976aa-586a-4865-9250-aab391b163ee", Constants.UserRole.Charters);
        //        return addToRole.Succeeded;
        //    }
        //}

        //[Route("RemoveRole")]
        //[HttpGet]
        //public object RemoveRole()
        //{
        //    using (var context = new ApplicationDbContext())
        //    {
        //        var roleStore = new RoleStore<IdentityRole>(context);
        //        var roleManager = new RoleManager<IdentityRole>(roleStore);

        //        //await roleManager.CreateAsync(new IdentityRole { Name = "Administrator" });

        //        var userStore = new UserStore<ApplicationUser>(context);
        //        var userManager = new UserManager<ApplicationUser>(userStore);

        //        //var user = new ApplicationUser { UserName = "admin" };
        //        //await userManager.CreateAsync(user);
        //        //await userManager.AddToRoleAsync(user.Id, "Administrator");

        //        var addToRole = userManager.RemoveFromRole("a1d976aa-586a-4865-9250-aab391b163ee", Constants.UserRole.Charters);
        //        return addToRole.Succeeded;
        //    }
        //}


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
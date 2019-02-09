using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Backend.MOJ.Helpers
{
    public class Constants
    {
        public enum SystemUsers
        {
            SystemHead = 1,
        }

        public class UserRole
        {
            public const string Patients = "feature_Patients";
            public const string ManageUserRoles = "feature_manage-user-roles";

        }
    }
}
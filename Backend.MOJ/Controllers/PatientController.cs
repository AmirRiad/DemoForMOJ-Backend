using Backend.MOJ.Helpers;
using DAL.DAL;

using System;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;

namespace Backend.MOJ.Controllers
{
    //[EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
    [CustomAuthorize(Roles = Constants.UserRole.Patients)]
    public class PatientController : ApiController
    {
        private MOJDBEntities db = new MOJDBEntities();

        // GET: api/Patient
        [AllowAnonymous]
        public object GetPatients(int page =1, int? patientId = null)
        {
            Expression<Func<Patients, bool>> whereExpression = x => x.IsActive == true;

            if (patientId !=null)
            {
                var model =
                    db.Patients.Where(x => x.IsActive == true && x.Id == patientId)
                        .OrderBy(x => x.Name)
                        .Select(x => new
                        {
                            x.Id,
                            x.Name,
                            x.Mobile,
                            x.IsActive
                        })
                        .ToList();

                return model;
            }
            else
            {
                page = (page < 1 ? 1 : page) - 1;
                int pageSize = 10;

                var items =
                    db.Patients.Where(whereExpression)
                        .OrderBy(x => x.Id)
                        .Skip(page * pageSize)
                        .Take(pageSize)
                        .Select(x => new
                        {
                            x.Id,
                            x.Name,
                            x.Mobile,
                            x.IsActive
                        })
                        .ToList();
                page += 1;

                var totalItems =
                    db.Patients.Where(whereExpression)
                        .Count();

                var model = new
                {
                    items,
                    totalItems,
                    page,
                    pageSize
                };

                return model;
            }
            //return db.Patients;
        }

        // GET: api/Patient/5
        [ResponseType(typeof(Patients))]
        public IHttpActionResult GetPatients(int id)
        {
            Patients patient = db.Patients.Find(id);
            if (patient == null)
            {
                return NotFound();
            }

            return Ok(patient);
        }

        // PUT: api/Patient/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutPatients(int id, Patients patient)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            // -------- Custom code here...
            var dbEntity = db.Patients.Find(id);
            if (dbEntity == null || dbEntity.IsActive == false)
            {
                return BadRequest("Entity with id (" + id + ") not found.");
            }

            // only update the values that user can update
            dbEntity.Name = patient.Name;
            dbEntity.Mobile = patient.Mobile;
            dbEntity.Id = patient.Id;
            // -------- Custom code end.

            //db.Entry(Patients).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatientExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Patient
        [ResponseType(typeof(Patients))]
        public IHttpActionResult PostPatients(Patients Patients)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            // -------- Custom code here...
            Patients.IsActive = true;
            // -------- Custom code end.

            db.Patients.Add(Patients);
            db.SaveChanges();

            return Ok();
            //  return CreatedAtRoute("DefaultApi", new { id = Patients.Id }, Patients);
        }

        // DELETE: api/Patient/5
        [ResponseType(typeof(Patients))]
        public IHttpActionResult DeletePatients(int id)
        {
            Patients Patients = db.Patients.Find(id);
            if (Patients == null)
            {
                return NotFound();
            }

            // -------- Custom code here...
            var dbEntity = db.Patients.Find(id);
            if (dbEntity == null || dbEntity.IsActive == false)
            {
                return NotFound();
            }

            // only update the values that user can update
            dbEntity.IsActive = false;
            // -------- Custom code end.

            //db.Patients.Remove(Patients);
            db.SaveChanges();

            return Ok(Patients);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PatientExists(int id)
        {
            return db.Patients.Count(e => e.Id == id) > 0;
        }
    }
}
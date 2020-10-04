using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DBKalmy.Entity;
using KalmyExam.Model;
using KalmyExam.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace KalmyExam.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AutomovilController : Controller
    {
        private DB_A68548_KalmyContext _context = new DB_A68548_KalmyContext();
        private readonly IJwtAuthenticationManager jwtAuthenticationManager;
        public AutomovilController(IJwtAuthenticationManager  jwtAuthenticationManager)
        {
            this.jwtAuthenticationManager = jwtAuthenticationManager;
        }
        // GET: api/<AuthenticationController>
        [Authorize]
        [HttpGet("Report")]

        public IActionResult Report(string type)
        {
            if (type == "1")
            {
                var count = (from aut in _context.Autos
                             group aut by aut.Type into g
                             select new
                             {
                                 Type = g.Key,
                                 num = g.Count(),

                             }).ToList();
                return Json(count);


            }

            if (type == "2")
            {
                var types = (from aut in _context.Autos
                             select new
                             {
                                 name=aut.Type
                             }).ToList().Distinct();

                  var count = (from t in types
                             select new
                             {
                                 Type=t.name,
                                 TypesCount =(from aut in _context.Autos
                                             where
                                             aut.Type==t.name
                                             group aut by aut.Brand into g
                                             select new
                                             {
                                                 brand=g.Key,
                                                 count=g.Count()
                                             }).ToList()

                             }).ToList();
                return Json(count);
            }

            if (type == "3")
            {
                var Brands = (from aut in _context.Autos
                             select new
                             {
                                 name = aut.Brand
                             }).ToList().Distinct();

                var count = (from t in Brands
                             select new
                             {
                                 Brand = t.name,
                                 BrandCount = (from aut in _context.Autos
                                               where
                                               aut.Brand == t.name
                                               group aut by aut.Type into g
                                               select new
                                               {
                                                   type = g.Key,
                                                   count = g.Count()
                                               }).ToList()

                             }).ToList();
                return Json(count);
            }
            if (type == "4")
            {
                var count = (from aut in _context.Autos
                             group aut by aut.Brand into g
                             select new
                             {
                                 Type = g.Key,
                                 num = g.Count(),

                             }).ToList();
                return Json(count);

            }
            return BadRequest(new { message = "El tipo no es válido" });
        }
    }
}

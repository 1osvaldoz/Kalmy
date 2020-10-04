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
    public class AuthenticationController : Controller
    {
        private DB_A68548_KalmyContext _context = new DB_A68548_KalmyContext();
        private readonly IJwtAuthenticationManager jwtAuthenticationManager;
        public AuthenticationController(IJwtAuthenticationManager  jwtAuthenticationManager)
        {
            this.jwtAuthenticationManager = jwtAuthenticationManager;
        }
        // GET: api/<AuthenticationController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "hermosillo", "nogales" };
        }

        [AllowAnonymous]
        [HttpPost("Register")]

        public IActionResult Register([FromBody] User userCred)
        {
            var us=_context.User.Where(x => x.UserName.ToLower() == userCred.UserName.ToLower()).FirstOrDefault();
            string token = "",mensaje="";
            if (us == null)
            {
                token = jwtAuthenticationManager.Authenticate(userCred.UserName, userCred.Password);
                userCred.Token = token;
                _context.User.Add(userCred);
                _context.SaveChanges();
                mensaje = "Usuario creado con éxito";
            }
            else
            {
                Response.StatusCode = 500;
                mensaje = "El usuario ya existe";

            }
            return Json(new { Token = token,Usuario= userCred,Mensaje = mensaje });
        }

        [AllowAnonymous]
        [HttpPost("Aunthenticate")]

        public IActionResult Authenticate([FromBody] UserCred userCred)
        {
            var us = _context.User.Where(x => x.UserName.ToLower() == userCred.UserName.ToLower() && x.Password == userCred.Password).FirstOrDefault();
             
            if (us == null)
                return BadRequest(new { message = "el usuario o contraseña es incorrecta" });
            us.Token = jwtAuthenticationManager.Authenticate(userCred.UserName, userCred.Password);

            return Json(new {   Usuario = us });
        }
    }
}

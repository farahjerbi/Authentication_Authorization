using CRUD.Data;
using CRUD.helpers;
using CRUD.Models;
using CRUD.Models.Dto;
using CRUD.Repository;
using CRUD.UtitlityServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace CRUD.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly CrudDbContext _context;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;
        private readonly IFileService _fileService;

        public UserController(CrudDbContext context, IConfiguration config , IEmailService emailService ,IFileService fileService)
        {
            _context = context;
            _config = config;
            _emailService = emailService;
            _fileService = fileService;

        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] User userObj)
        {
            if(userObj == null) { return BadRequest(); }

            var user = await _context.Users.FirstOrDefaultAsync(x=>x.Username== userObj.Username);

            if(user == null) { return NotFound(new {Message="User Not found !"}); }

            if(!PasswordHasher.VerifyPassword(userObj.Password,user.Password))
            {
                return BadRequest(new { Message = "Password incorrect!" });
            }

            var Token = CreateJWT(user);

            return Ok(new { Token =Token , Message = "Login Success!" , User =user});

        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromForm] User userObj)
        {
            if(userObj == null) { return BadRequest(); }

            //CheckUserName
            if( await CheckUserNameExistAsync(userObj.Username))
            {
                return BadRequest(new { Message = "Username Already Exists!" });
            }

            //CheckEmail 
            if (await CheckEmailExistAsync(userObj.Email))
            {
                return BadRequest(new { Message = "Email Already Exists!" });
            }

            //CheckPasswordStrength
            var pass = CheckPasswordStrength(userObj.Password);
            if (!string.IsNullOrEmpty(pass)) 
            { return BadRequest(new { Message = pass.ToString() }); }

            if (userObj.ImageFile != null)
            {
                var fileResult = _fileService.SaveImage(userObj.ImageFile);

                if (fileResult.Item1 == 1)
                {
                    userObj.ProfileImage = fileResult.Item2; // imageName
                }
                else
                {
                    // Log the error message when file saving fails
                    Console.WriteLine($"File saving error: {fileResult.Item2}");
                }
            }
            else
            {
                // Log a message indicating that no file was provided
                Console.WriteLine("No file provided in the request");
            }

            userObj.Password = PasswordHasher.HashPassword(userObj.Password);

            userObj.Role = "User";

            userObj.Token = "";

            await _context.Users.AddAsync(userObj);
            await _context.SaveChangesAsync();



            return Ok(new { Message = "Register Success!" });
        }





    


    private  Task<bool> CheckUserNameExistAsync(string userName) => _context.Users.AnyAsync(x => x.Username == userName);
        

        private Task<bool> CheckEmailExistAsync(string email)=> _context.Users.AnyAsync(x => x.Email == email);
        

        private string CheckPasswordStrength(string password)
        {
            StringBuilder sb = new StringBuilder();
            if (password.Length < 8)
            {
                sb.Append("Minimum password length should be 8" + Environment.NewLine);
                
            }
            if (!(Regex.IsMatch(password, "[a-zA-Z]") && Regex.IsMatch(password, "[0-9]")))
            {
                sb.Append("Password should be alphanumeric" + Environment.NewLine);
            }


            if (Regex.IsMatch(password, "[<,>,@]")) {
                sb.Append("Password should no contain special caracters " + Environment.NewLine);
            }

            return sb.ToString();
        }

        private string CreateJWT(User user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("A_Secret_Key_I_Choose_Randomly");

            var identity = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Role , user.Role),
                new Claim(ClaimTypes.Name , $"{user.Username}"),

            });

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credentials
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);

            return jwtTokenHandler.WriteToken(token);
        }


        private string CreateRefreshToken()
        {
            var tokenBytes= RandomNumberGenerator.GetBytes(64);
            var refreshToken = Convert.ToBase64String(tokenBytes);

            var tokenInUser = _context.Users.Any(a => a.RefreshToken == refreshToken);
            if(tokenInUser) { return CreateRefreshToken(); }
            return refreshToken;
        }


        //[Authorize]
        [HttpGet]
        public async Task<ActionResult<User>> GetAllUsers()
        {
            return Ok( await _context.Users.ToListAsync() );
        }


        [HttpPost("send-reset-email/{email}")]
        public async Task<IActionResult> SendEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(a => a.Email == email);

            if(user is null) {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message="email does not exist"
                });
                }

            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var emailToken = Convert.ToBase64String(tokenBytes);

            user.ResetPasswordToken = emailToken;
            user.ResetPasswordTokenExpiryTime = DateTime.Now.AddMinutes(15);

            string from = _config["EmailSettings:From"];
            var emailModel = new EmailModel(email, "Reset Password !" , EmailBody.EmailStringBody(email ,emailToken));
            _emailService.SendEmail(emailModel);
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Email sent!"
            });
            
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword( ResetPasswordDto resetPasswordDto)
        {
            var newToken = resetPasswordDto.EmailToken.Replace(" ", "+");
            var user = await _context.Users.FirstOrDefaultAsync(b => b.Email == resetPasswordDto.Email);

            if (user is null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "user does not exist"
                });
            }

            var tokenCode = user.ResetPasswordToken;
            DateTime emailTokenExpiry = (DateTime)user.ResetPasswordTokenExpiryTime;
            if(tokenCode != resetPasswordDto.EmailToken || emailTokenExpiry < DateTime.Now) 
            {
                return BadRequest(new
                {
                    StatusCode = 400,
                    Message = "Invalid Reset Link"
                });
            }

            user.Password = PasswordHasher.HashPassword(resetPasswordDto.NewPassword);
            _context.Entry(user).State=EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                StatusCode = 200,
                Message = "Password Reset Successfullly "
            });

        }
    }
}

/* using CRUD.Data;
using CRUD.Models;
using CRUD.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;*/

using CRUD.Data;
using CRUD.Models;
using CRUD.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.Text.Json;
using System.Threading.Tasks;

namespace CRUD.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly CrudDbContext _crudDb;
        private readonly IFileService _fileService;

        public BookController(CrudDbContext context, IFileService fileService)
        {
            _crudDb = context;
            _fileService = fileService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await _crudDb.Books.Include(b => b.User).ToListAsync();

            JsonSerializerOptions options = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.Preserve,
                WriteIndented = true
            };

            string json = JsonSerializer.Serialize(books, options);

            return Ok(json);
        }

        [HttpGet]
        [Route("{idUser}")]

        public async Task<IActionResult> GetAllBooksByUser([FromRoute] int idUser )
        {
            var books = await _crudDb.Books.Where(b => b.UserId == idUser).ToListAsync();

            if (books == null) { return NotFound(); };


      
            return Ok(books);
        }





        [HttpPost("Add")]
        public async Task<IActionResult> RegisterBook([FromForm] Book book)
        {
            if (book == null) { return BadRequest(); }

            var user = await _crudDb.Users.FindAsync(book.UserId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            book.User = user;

            if (book.ImageFile != null)
            {
                var fileResult = _fileService.SaveImage(book.ImageFile);

                if (fileResult.Item1 == 1)
                {
                    book.Image = fileResult.Item2; // imageName
                }
                else
                {
                    Console.WriteLine($"File saving error: {fileResult.Item2}");
                }
            }
            else
            {
                Console.WriteLine("No file provided in the request");
            }


            await _crudDb.Books.AddAsync(book);
            await _crudDb.SaveChangesAsync();



            return Ok(new { Message = "Book added Successfully!" });
        }



    }
}

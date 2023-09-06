using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CRUD.Models
{
    public class Book
    {
        [Key]
        public int? IdBook { get; set; }

        public string Title { get; set; }
        public string AuthorName { get; set; }
        public string Description { get; set; }
        [DataType(DataType.Date)]
        public DateTime? ReleaseDate { get; set; }

        public Category Category { get; set; } = Category.Autobiography;
        public string Image { get; set; }
        [NotMapped]
        public IFormFile ImageFile { get; set; }

        //ForeignKey
        public  int UserId { get; set; }
        public User User { get; set; }

    }
}

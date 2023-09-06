using CRUD.Data;
using CRUD.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CRUD.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class EmployeeController : Controller
    {
        private readonly CrudDbContext _CrudDb;

        public EmployeeController(CrudDbContext db)
        {
            _CrudDb = db;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllEmployees()
        {
            var employees = await _CrudDb.Employees.ToListAsync();
            return Ok(employees);
        }

        [HttpPost]
        public async Task<IActionResult> AddEmployee([FromBody] Employee employee)
        {
            employee.Id = Guid.NewGuid();
            await _CrudDb.Employees.AddAsync(employee);
            await _CrudDb.SaveChangesAsync();

            return Ok(employee);
        }

        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetEmployee([FromRoute] Guid id)
        {
             var employee= await _CrudDb.Employees.FirstOrDefaultAsync(x => x.Id == id);

            if(employee== null) { return NotFound(); };
            return Ok(employee);

        }

        [HttpPut]
        [Route("{id:Guid}")]
        public async Task<IActionResult> UpdateEmployee([FromRoute] Guid id , Employee employee)
        {
            var e = await _CrudDb.Employees.FindAsync(id);

            if(e==null) { return NotFound(); };
            e.Name= employee.Name;
            e.Phone = employee.Phone;
            e.Email = employee.Email;
            e.Salary = employee.Salary;
            e.department = employee.department;

            await _CrudDb.SaveChangesAsync();

            return Ok(e);


        }

        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteEmployee([FromRoute] Guid id)
        {
            var e = await _CrudDb.Employees.FindAsync(id);
            if (e == null) { return NotFound(); };
            _CrudDb.Employees.Remove(e);
            await _CrudDb.SaveChangesAsync();
            return Ok(e);
        }


    }
}

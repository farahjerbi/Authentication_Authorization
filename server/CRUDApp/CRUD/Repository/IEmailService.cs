using CRUD.Models;

namespace CRUD.UtitlityServices
{
    public interface IEmailService
    {
        void SendEmail(EmailModel email);
    }
}

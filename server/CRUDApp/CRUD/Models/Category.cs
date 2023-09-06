using System.Text.Json.Serialization;

namespace CRUD.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]

    public enum Category
    {
        Romance,
        Horror,
        Action,
        Drama,
        Classic,
        Fantasy,
        Crime,
        Poetry,
        Autobiography

    }
}

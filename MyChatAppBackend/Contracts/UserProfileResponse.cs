namespace MyChatAppBackend.Contracts
{
    public class UserProfileResponse
    {
        public string Id { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Username { get; set; } = default!;
        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;
    }
}
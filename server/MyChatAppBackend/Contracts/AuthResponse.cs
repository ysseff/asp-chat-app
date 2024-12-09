namespace MyChatAppBackend.Contracts.Authentication
{
    public class AuthResponse
    {
        public string UserId { get; }
        public string Email { get; }
        public string UserName { get; }
        public string FirstName { get; }
        public string LastName { get; }
        public string Token { get; }
        public int ExpiresIn { get; }

        public AuthResponse(string userId, string email, string userName, string firstName, string lastName, string token, int expiresIn)
        {
            UserId = userId;
            Email = email;
            UserName = userName;
            FirstName = firstName;
            LastName = lastName;
            Token = token;
            ExpiresIn = expiresIn;
        }
    }
}
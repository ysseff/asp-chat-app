using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using MyChatAppBackend.Authentication;
using MyChatAppBackend.Contracts;
using MyChatAppBackend.Contracts.Authentication;
using MyChatAppBackend.Entities;

namespace MyChatAppBackend.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IJwtProvider _jwtProvider;

        public AuthService(UserManager<ApplicationUser> userManager, IJwtProvider jwtProvider)
        {
            _userManager = userManager;
            _jwtProvider = jwtProvider;
        }

        public async Task<AuthResponse?> GetTokenAsync(string email, string password, CancellationToken cancellationToken = default)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user is null)
                return null;

            var isPasswordCorrect = await _userManager.CheckPasswordAsync(user, password);
            if (!isPasswordCorrect)
                return null;

            var (token, expiresIn) = _jwtProvider.GenerateToken(user);
            return new AuthResponse(user.Id, user.Email!, user.UserName!, user.FirstName!, user.LastName!, token, expiresIn);
        }

        public async Task<AuthResponse?> RegisterAsync(UserRegistrationRequest request, CancellationToken cancellationToken = default)
        {
            // Check if user with the same email already exists
            var existingUser = await _userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
                return null;

            // Create the new user
            var user = new ApplicationUser
            {
                UserName = request.UserName,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
                return null;

            // Generate token
            var (token, expiresIn) = _jwtProvider.GenerateToken(user);
            return new AuthResponse(user.Id, user.Email!, user.UserName!, user.FirstName!, user.LastName!, token, expiresIn);
        }
    }
}
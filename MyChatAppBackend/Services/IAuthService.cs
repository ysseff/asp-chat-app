using MyChatAppBackend.Contracts.Authentication;
using System.Threading;
using System.Threading.Tasks;
using MyChatAppBackend.Contracts;

namespace MyChatAppBackend.Services
{
    public interface IAuthService
    {
        Task<AuthResponse?> GetTokenAsync(string email, string password, CancellationToken cancellationToken = default);
        Task<AuthResponse?> RegisterAsync(UserRegistrationRequest request, CancellationToken cancellationToken = default);
    }
}
using MyChatAppBackend.Contracts;
using System.Threading;
using System.Threading.Tasks;

namespace MyChatAppBackend.Services
{
    public interface IUserProfileService
    {
        Task<UserProfileResponse?> GetUserProfileAsync(string userId, CancellationToken cancellationToken = default);
        Task<UserProfileUpdateResponse> UpdateUserProfileAsync(string userId, UpdateUserProfileRequest request, CancellationToken cancellationToken = default);
        Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPassword, CancellationToken cancellationToken = default);
    }
}
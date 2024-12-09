using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using MyChatAppBackend.Contracts;
using MyChatAppBackend.Entities;

namespace MyChatAppBackend.Services
{
    public class UserProfileService(UserManager<ApplicationUser> userManager) : IUserProfileService
    {
        public async Task<UserProfileResponse?> GetUserProfileAsync(string userId, CancellationToken cancellationToken = default)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null) return null;

            return new UserProfileResponse
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                Username = user.UserName ?? string.Empty,
                FirstName = user.FirstName ?? string.Empty,
                LastName = user.LastName ?? string.Empty
            };
        }

        public async Task<bool> UpdateUserProfileAsync(string userId, UpdateUserProfileRequest request, CancellationToken cancellationToken = default)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null) return false;

            bool shouldUpdate = false;

            if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
            {
                var emailUser = await userManager.FindByEmailAsync(request.Email);
                if (emailUser != null)
                    throw new System.InvalidOperationException("Email is already taken");

                user.Email = request.Email;
                shouldUpdate = true;
            }

            if (!string.IsNullOrEmpty(request.Username) && request.Username != user.UserName)
            {
                var usernameUser = await userManager.FindByNameAsync(request.Username);
                if (usernameUser != null)
                    throw new System.InvalidOperationException("Username is already taken");

                user.UserName = request.Username;
                shouldUpdate = true;
            }

            if (!string.IsNullOrEmpty(request.FirstName))
            {
                user.FirstName = request.FirstName;
                shouldUpdate = true;
            }

            if (!string.IsNullOrEmpty(request.LastName))
            {
                user.LastName = request.LastName;
                shouldUpdate = true;
            }

            if (shouldUpdate)
            {
                var result = await userManager.UpdateAsync(user);
                if (!result.Succeeded)
                    throw new System.InvalidOperationException("Failed to update user profile.");
            }

            return true;
        }

        public async Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPassword, CancellationToken cancellationToken = default)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null) return false;

            var result = await userManager.ChangePasswordAsync(user, currentPassword, newPassword);
            if (!result.Succeeded)
                throw new System.InvalidOperationException("Failed to change password.");

            return true;
        }
    }
}
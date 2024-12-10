using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyChatAppBackend.Contracts;
using MyChatAppBackend.Services;

namespace MyChatAppBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController(IUserProfileService userProfileService) : ControllerBase
    {
        [HttpGet("me")]
        public async Task<IActionResult> GetUserProfile(CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var profile = await userProfileService.GetUserProfileAsync(userId, cancellationToken);
            if (profile == null) return NotFound("User not found");
            return Ok(profile);
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UpdateUserProfileRequest request, CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            try
            {
                var response = await userProfileService.UpdateUserProfileAsync(userId, request, cancellationToken);
                return Ok(response);
            }
            catch (System.InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request, CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            try
            {
                await userProfileService.ChangePasswordAsync(userId, request.CurrentPassword, request.NewPassword, cancellationToken);
                return Ok("Password changed successfully");
            }
            catch (System.InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
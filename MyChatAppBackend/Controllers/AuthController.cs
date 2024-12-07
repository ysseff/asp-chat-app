using Microsoft.AspNetCore.Mvc;
using MyChatAppBackend.Contracts;
using MyChatAppBackend.Contracts.Authentication;
using MyChatAppBackend.Services;

namespace MyChatAppBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationRequest request)
        {
            var response = await _authService.RegisterAsync(request);
            if (response is null)
                return BadRequest("Registration failed or user already exists.");

            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest request)
        {
            var response = await _authService.GetTokenAsync(request.Email, request.Password);
            if (response is null)
                return Unauthorized("Invalid credentials.");

            return Ok(response);
        }
    }
}

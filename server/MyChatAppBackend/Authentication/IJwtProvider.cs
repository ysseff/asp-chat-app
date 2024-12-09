using Microsoft.AspNetCore.Identity;
using MyChatAppBackend.Entities;

namespace MyChatAppBackend.Authentication;

public interface IJwtProvider
{
    (string token, int expiresIn) GenerateToken(ApplicationUser user);
}
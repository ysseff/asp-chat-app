using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MyChatAppBackend.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using MyChatAppBackend.Entities;

namespace MyChatAppBackend.Authentication;

public class JwtProvider : IJwtProvider
{
    public (string token, int expiresIn) GenerateToken(ApplicationUser user)
    {
        Claim[] claims =
        [
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(JwtRegisteredClaimNames.GivenName, user.FirstName),
            new(JwtRegisteredClaimNames.FamilyName, user.LastName),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("username", user.UserName!)
        ];
        
        var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("7JPdBxSGtQ8FFKjy8KM9y6dwcRNLlTi0"));
        
        var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);
        
        var expirationDate = DateTime.UtcNow.AddDays(7);
        
        var token = new JwtSecurityToken(
            issuer: "MyChatAppBackend",
            audience: "MyChatAppBackend users",
            claims: claims,
            expires: expirationDate,
            signingCredentials: signingCredentials
        );
        
        return (token: new JwtSecurityTokenHandler().WriteToken(token), 7*24*60*60);
    }
}
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MyChatAppBackend.Authentication;
using MyChatAppBackend.Entities;
using MyChatAppBackend.Persistence;
using MyChatAppBackend.Services;

namespace MyChatAppBackend;

public static class DependencyInjection
{
    public static IServiceCollection AddDependencies(this IServiceCollection services, IConfiguration configuration)
    {
        // Add Controllers with basic JSON options if needed
        services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.DefaultIgnoreCondition = 
                System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
        });

        // Configure EF Core with connection string
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string is missing");
        
        services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));

        // Add application-specific services
        services.AddScoped<IConversationService, ConversationService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddSingleton<IJwtProvider, JwtProvider>();
        services.AddScoped<IMessageService, MessageService>();
        services.AddScoped<IUserProfileService, UserProfileService>();
        services.AddSignalR();
        
        

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(o =>
        {
            
            o.SaveToken = true;
            o.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("7JPdBxSGtQ8FFKjy8KM9y6dwcRNLlTi0")),
                ValidateIssuer = true,
                ValidIssuer = "MyChatAppBackend",
                ValidateAudience = true,
                ValidAudience = "MyChatAppBackend users",
                ValidateLifetime = true,
                NameClaimType = ClaimTypes.NameIdentifier
            };
            o.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var accessToken = context.Request.Query["access_token"];

                    // If the request is for our hub...
                    var path = context.HttpContext.Request.Path;
                    if (!string.IsNullOrEmpty(accessToken) &&
                        (path.StartsWithSegments("/chathub")))
                    {
                        // Read the token out of the query string
                        context.Token = accessToken;
                    }
                    return Task.CompletedTask;
                }
            };
        });
        
        
        return services;
    }
}
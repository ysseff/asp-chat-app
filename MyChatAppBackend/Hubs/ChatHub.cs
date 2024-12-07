using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MyChatAppBackend.Hubs;

public class ChatHub : Hub
{
    public async Task SendMessage(string userId, string messageContent)
    {
        await Clients.User(userId).SendAsync("ReceiveMessage", messageContent);
    }
    
    // public override async Task OnConnectedAsync()
    // {
    //     await Clients.All.SendAsync("ReceiveMessage", "A new user has joined the chat");
    // }
}
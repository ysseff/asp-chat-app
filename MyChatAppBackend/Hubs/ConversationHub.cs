using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using MyChatAppBackend.Contracts;

namespace MyChatAppBackend.Hubs;

public class ConversationHub : Hub
{
    public async Task SendNewConversation(ConversationResponse conversation)
    {
        await Clients.All.SendAsync("ReceiveNewConversation", conversation);
    }
}
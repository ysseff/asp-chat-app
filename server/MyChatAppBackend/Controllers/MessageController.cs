using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyChatAppBackend.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using MyChatAppBackend.Contracts;
using MyChatAppBackend.Hubs;

namespace MyChatAppBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MessagesController(IMessageService messageService, IConversationService conversationService)
        : ControllerBase
    {
        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request, [FromServices] IHubContext<ChatHub> hubContext, CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var conversation = await conversationService.GetConversationByIdAsync(request.ConversationId, cancellationToken);
            if (conversation == null) return BadRequest("Conversation not found");

            // Check if user is part of the conversation
            if (conversation.User1Id != userId && conversation.User2Id != userId)
                return Forbid();

            var message = await messageService.SendMessageAsync(request.ConversationId, userId, request.Content, cancellationToken);
            
            // Determine the other party in the conversation
            var otherUserId = conversation.User1Id == userId ? conversation.User2Id : conversation.User1Id;

            // Notify the other user via SignalR
            await hubContext.Clients.User(otherUserId).SendAsync("ReceiveMessage", new {
                ConversationId = request.ConversationId,
                SenderId = userId,
                Content = request.Content,
                message.Timestamp
            }, cancellationToken);
            
            return Ok(message);
        }

        [HttpGet("{conversationId}")]
        public async Task<IActionResult> GetMessages(int conversationId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var conversation = await conversationService.GetConversationByIdAsync(conversationId);
            if (conversation == null) return BadRequest("Conversation not found");

            if (conversation.User1Id != userId && conversation.User2Id != userId)
                return Forbid();

            var messages = await messageService.GetMessagesForConversationAsync(conversationId);
            return Ok(messages);
        }
    }
}
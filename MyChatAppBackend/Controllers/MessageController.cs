using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyChatAppBackend.Services;
using System.Security.Claims;

namespace MyChatAppBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MessagesController(IMessageService messageService, IConversationService conversationService)
        : ControllerBase
    {
        [HttpPost("send/{conversationId}")]
        public async Task<IActionResult> SendMessage(int conversationId, [FromBody] string content, CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var conversation = await conversationService.GetConversationByIdAsync(conversationId, cancellationToken);
            if (conversation == null) return BadRequest("Conversation not found");

            // Check if user is part of the conversation
            if (conversation.User1Id != userId && conversation.User2Id != userId)
                return Forbid();

            var message = await messageService.SendMessageAsync(conversationId, userId, content, cancellationToken);
            // Later, we’ll broadcast via SignalR here
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